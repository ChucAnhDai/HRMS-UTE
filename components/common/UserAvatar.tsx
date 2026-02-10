"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  avatarUrl?: string | null;
  name?: string;
  fallbackUrl?: string;
}

export default function UserAvatar({
  avatarUrl,
  name,
  className,
  fallbackUrl = "/default-avatar.svg",
  alt,
  ...props
}: UserAvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={avatarUrl}
      src={avatarUrl || fallbackUrl}
      alt={alt || name || "Avatar"}
      className={cn("object-cover", className)}
      onError={(e) => {
        e.currentTarget.src = fallbackUrl;
        e.currentTarget.onerror = null;
      }}
      {...props}
    />
  );
}
