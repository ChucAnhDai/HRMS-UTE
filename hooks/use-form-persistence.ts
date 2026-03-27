"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseFormPersistenceOptions {
  /** Entity type: "employee", "department", "leave", "overtime", etc. */
  entity: string;
  /** Action: "create" | "edit" */
  action: "create" | "edit";
  /** ID cụ thể hoặc "new". */
  id?: string | number;
  /** Debounce time (ms). Default: 500 */
  debounceMs?: number;
  /** Field names cần bỏ qua (file inputs, passwords...). Default: [] */
  excludeFields?: string[];
}

interface UseFormPersistenceReturn<T extends Record<string, unknown>> {
  /** Dữ liệu draft đã lưu (null nếu chưa có) */
  savedData: T | null;
  /** Gọi để lưu dữ liệu (debounce xử lý bên trong hook) */
  saveFormData: (data: Partial<T>) => void;
  /** Xóa draft (gọi sau khi submit thành công) */
  clearSavedData: () => void;
  /** true CHỈ KHI dữ liệu thực sự được load từ sessionStorage và đã áp dụng */
  isRestored: boolean;
  /** Cho biết component đã mount xong chưa (SSR safety) */
  isMounted: boolean;
}

/**
 * Hook sanitize data: loại bỏ Files, passwords, và excluded fields
 */
function sanitizeFormData(
  raw: Record<string, unknown>,
  excludeFields: string[]
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(raw)) {
    // Skip excluded fields
    if (excludeFields.includes(key)) continue;
    // Skip File objects
    if (typeof window !== "undefined" && value instanceof File) continue;
    if (value && typeof value === "object" && "name" in value && "size" in value)
      continue;

    // Chỉ giữ string, number, boolean
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      result[key] = value;
    }
  }

  return result;
}

export function useFormPersistence<T extends Record<string, unknown>>({
  entity,
  action,
  id = "new",
  debounceMs = 500,
  excludeFields = [],
}: UseFormPersistenceOptions): UseFormPersistenceReturn<T> {
  const [savedData, setSavedData] = useState<T | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `form_draft:${entity}:${action}:${id}`;

  // 1. Mark as mounted on client
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Load data on mount/storageKey change
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Object.keys(parsed).length > 0) {
          // Wrap in setTimeout to avoid cascading render warnings during hydration/mount
          setTimeout(() => {
            setSavedData(parsed as T);
            setIsRestored(true);
          }, 0);
        }
      }
    } catch (err) {
      console.error(`[FormPersistence] Failed to read from storage:`, err);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [storageKey]);

  // 2. Save data with debounce
  const saveFormData = useCallback(
    (data: Partial<T>) => {
      // Clear previous timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        try {
          // Merge with existing draft to avoid losing unsubmitted fields
          const currentRaw = sessionStorage.getItem(storageKey);
          const currentData = currentRaw ? JSON.parse(currentRaw) : {};
          
          const sanitized = sanitizeFormData({ ...currentData, ...data }, excludeFields);
          
          if (Object.keys(sanitized).length > 0) {
            sessionStorage.setItem(storageKey, JSON.stringify(sanitized));
          } else {
            sessionStorage.removeItem(storageKey);
          }
        } catch (err) {
          console.error(`[FormPersistence] Failed to save to storage:`, err);
        }
      }, debounceMs);
    },
    [storageKey, debounceMs, excludeFields]
  );

  // 3. Clear data
  const clearSavedData = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      sessionStorage.removeItem(storageKey);
      setSavedData(null);
      setIsRestored(false);
    } catch (err) {
      console.error(`[FormPersistence] Failed to clear storage:`, err);
    }
  }, [storageKey]);

  return {
    savedData,
    saveFormData,
    clearSavedData,
    isRestored,
    isMounted,
  };
}
