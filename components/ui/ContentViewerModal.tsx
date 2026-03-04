"use client";

import React from "react";
import { X, Eye } from "lucide-react";

interface ContentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function ContentViewerModal({
  isOpen,
  onClose,
  title,
  content,
}: ContentViewerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {content}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper component: truncated text with a "Xem" button
 */
interface TruncatedTextWithViewProps {
  text: string;
  maxLength?: number;
  modalTitle?: string;
  className?: string;
}

export function TruncatedTextWithView({
  text,
  modalTitle = "Nội dung chi tiết",
  className = "",
}: TruncatedTextWithViewProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!text) return <span className="text-gray-400">---</span>;

  return (
    <>
      <div className={className}>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Xem
        </button>
      </div>

      <ContentViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={modalTitle}
        content={text}
      />
    </>
  );
}
