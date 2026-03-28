"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Info, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "primary";
}

export default function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "primary",
}: ConfirmDialogProps) {
  
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <HelpCircle className="h-6 w-6 text-blue-600" />;
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 shadow-red-200";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 shadow-amber-200";
      case "info":
        return "bg-blue-500 hover:bg-blue-600 shadow-blue-200";
      default:
        return "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center",
              variant === "danger" ? "bg-red-50" : 
              variant === "warning" ? "bg-amber-50" : "bg-blue-50"
            )}>
              {getIcon()}
            </div>
            <div className="flex-1 pt-1">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 leading-none mb-2">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-gray-500 leading-relaxed">
                  {description}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-50/80 backdrop-blur-sm p-4 gap-3 sm:gap-0">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200 rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={cn(
              "flex-1 sm:flex-none px-8 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0",
              getButtonClass()
            )}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
