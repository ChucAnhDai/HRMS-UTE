"use client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:flex-col md:max-w-[420px] gap-3">
      {toasts.map(function ({ id, title, description, variant }) {
        const isDestructive = variant === "destructive";
        
        return (
          <div
            key={id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-right-full slide-out-to-right-full hover:scale-[1.02]",
              isDestructive
                ? "bg-red-500/95 border-red-400/50 text-white backdrop-blur-md shadow-red-500/20"
                : "bg-white/90 border-gray-200/50 text-gray-950 backdrop-blur-md shadow-gray-400/10"
            )}
          >
            {/* Status Icon */}
            <div className={cn(
              "mt-0.5 shrink-0 rounded-full p-1",
              isDestructive ? "bg-white/20 text-white" : "bg-green-100 text-green-600"
            )}>
              {isDestructive ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 space-y-1 pr-4">
              {title && (
                <div className={cn(
                  "text-sm font-bold leading-none tracking-tight",
                  isDestructive ? "text-white" : "text-gray-900"
                )}>
                  {title}
                </div>
              )}
              {description && (
                <div className={cn(
                  "text-sm leading-relaxed",
                  isDestructive ? "text-red-50 opacity-90" : "text-gray-500 font-medium"
                )}>
                  {description}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => dismiss(id)}
              className={cn(
                "absolute right-2 top-2 rounded-lg p-1 transition-all opacity-0 group-hover:opacity-100",
                isDestructive ? "hover:bg-white/20 text-white" : "hover:bg-gray-100 text-gray-400"
              )}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Decorative Gradient Background */}
            {!isDestructive && (
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-green-50 blur-3xl opacity-50 pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
}
