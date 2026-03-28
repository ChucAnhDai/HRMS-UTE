"use client";

import React, { useState } from "react";
import {
  checkInAction,
  checkOutAction,
} from "@/server/actions/quick-attendance";
import { toast } from "@/hooks/use-toast";

interface AttendanceStatus {
  check_in_time?: string | null;
  check_out_time?: string | null;
}

interface Props {
  initialStatus: AttendanceStatus | null;
}

export default function QuickAttendance({ initialStatus }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleCheckIn() {
    setIsLoading(true);
    setMessage(null);

    const result = await checkInAction();
    setIsLoading(false);

    if (result.success) {
      if (result.status === "Late") {
        toast({
          title: "Đi muộn",
          description: `Check In thành công nhưng bạn đã đi muộn! (${new Date().toLocaleTimeString("vi-VN")})`,
          variant: "destructive", // Warning-like
        });
        setMessage({
          type: "error",
          text: `Check In thành công nhưng bạn đã đi muộn! (${new Date().toLocaleTimeString("vi-VN")})`,
        });
      } else if (result.forgotCheckout) {
        toast({
          title: "Cảnh báo",
          description: "Check In thành công. Cảnh báo: Bạn đã quên Checkout ngày hôm trước!",
          variant: "destructive",
        });
        setMessage({
          type: "error",
          text: "Check In thành công. Cảnh báo: Bạn đã quên Checkout ngày hôm trước!",
        });
      } else {
        toast({
          title: "Thành công",
          description: result.message || "Check In thành công!",
        });
        setMessage({
          type: "success",
          text: result.message || "Check In thành công!",
        });
      }
      setTimeout(() => window.location.reload(), 2500);
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Có lỗi xảy ra",
        variant: "destructive",
      });
      setMessage({ type: "error", text: result.error || "Có lỗi xảy ra" });
    }
  }

  async function handleCheckOut() {
    setIsLoading(true);
    setMessage(null);

    const result = await checkOutAction();
    setIsLoading(false);

    if (result.success) {
      if (result.warning) {
        toast({
          title: "Check Out thành công",
          description: result.warning,
          variant: "destructive",
        });
        setMessage({
          type: "error",
          text: `Check Out thành công. ${result.warning}`,
        });
      } else {
        toast({
          title: "Thành công",
          description: result.message || "Check Out thành công!",
        });
        setMessage({
          type: "success",
          text: result.message || "Check Out thành công!",
        });
      }
      setTimeout(() => window.location.reload(), 2500);
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Có lỗi xảy ra",
        variant: "destructive",
      });
      setMessage({ type: "error", text: result.error || "Có lỗi xảy ra" });
    }
  }

  const hasCheckedIn = !!initialStatus?.check_in_time;
  const hasCheckedOut = !!initialStatus?.check_out_time;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Success Banner */}
      {message?.type === "success" && (
        <div className="bg-teal-50 border-b border-teal-100 px-6 py-4">
          <p className="text-teal-800 font-medium">{message.text}</p>
        </div>
      )}

      {/* Error Banner */}
      {message?.type === "error" && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-4">
          <p className="text-red-800 font-medium">{message.text}</p>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Chấm công hôm nay ({new Date().toLocaleDateString("vi-VN")})
        </h2>

        {/* Status Display */}
        <div className="space-y-2 mb-6">
          {hasCheckedIn ? (
            <p className="text-green-600 font-medium">
              Đã Check In lúc:{" "}
              <span className="font-bold">{initialStatus.check_in_time}</span>
            </p>
          ) : (
            <p className="text-gray-500">Chưa check in</p>
          )}

          {hasCheckedOut ? (
            <p className="text-red-600 font-medium">
              Đã Check Out lúc:{" "}
              <span className="font-bold">{initialStatus.check_out_time}</span>
            </p>
          ) : hasCheckedIn ? (
            <p className="text-gray-500">Chưa check out</p>
          ) : null}

          {hasCheckedOut && (
            <p className="text-gray-600 mt-4">
              Bạn đã hoàn thành chấm công hôm nay.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {!hasCheckedOut && (
          <div className="flex gap-3">
            {!hasCheckedIn && (
              <button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Đang xử lý..." : "Check In"}
              </button>
            )}

            {hasCheckedIn && !hasCheckedOut && (
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Đang xử lý..." : "Check Out"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
