"use client";

import { AlertCircle, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  onClear: () => void;
  isVisible: boolean;
}

export default function FormDraftNotice({ onClear, isVisible }: Props) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-yellow-800">Dữ liệu bản nháp</h4>
          <p className="text-xs text-yellow-700">
            Dữ liệu chưa lưu đã được khôi phục từ phiên làm việc trước.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onClear();
            setShow(false);
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-yellow-200 text-yellow-700 text-xs font-bold rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Xóa bản nháp
        </button>
        <button 
          onClick={() => setShow(false)}
          className="p-1.5 hover:bg-yellow-100 rounded-md transition-colors text-yellow-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
