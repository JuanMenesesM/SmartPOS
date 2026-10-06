import React, { useState } from "react";
import { Package } from "lucide-react";
import { getProductImageUrl } from "@/utils/productImages";

interface Props {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProductThumbnail({ name, className = "", size = "md" }: Props) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getProductImageUrl(name);

  // Exact same dimensions everywhere for complete visual consistency
  const sizeClasses = {
    sm: "w-8 h-8 min-w-[32px] rounded-lg",
    md: "w-10 h-10 min-w-[40px] rounded-xl",
    lg: "w-14 h-14 min-w-[56px] rounded-2xl",
  }[size];

  if (hasError || !imageUrl) {
    return (
      <div
        className={`${sizeClasses} bg-gradient-to-br from-primary/10 via-primary/5 to-muted border border-border/80 flex items-center justify-center shrink-0 text-muted-foreground shadow-xs ${className}`}
      >
        <Package className={size === "sm" ? "h-4 w-4" : size === "lg" ? "h-7 w-7" : "h-5 w-5"} />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses} overflow-hidden border border-border/80 bg-muted/40 shrink-0 shadow-xs group ${className}`}>
      <img
        src={imageUrl}
        alt={name}
        onError={() => setHasError(true)}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}
