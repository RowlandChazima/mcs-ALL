import { ReactNode } from "react";

interface PillBadgeProps {
  children: ReactNode;
  variant?: "coral" | "butter" | "lilac" | "ice";
  size?: "md" | "sm"; // "md" = big hero pill (default), "sm" = inline pill for notes
  className?: string;
}

export function PillBadge({
  children,
  variant = "coral",
  size = "md",
  className = "",
}: PillBadgeProps) {
  const variantStyles = {
    coral: "bg-coral text-white border-ink shadow-chunky-sm",
    butter: "bg-butter text-ink border-ink shadow-chunky-sm",
    lilac: "bg-lilac text-ink border-ink shadow-chunky-sm",
    ice: "bg-ice text-ink border-ink shadow-chunky-sm",
  };

  const sizeStyles = {
    md: "text-lg sm:text-[24px] px-4 py-1 mx-1.5 my-1",
    sm: "text-xs sm:text-sm px-3 py-0.5 mx-1 my-0.5",
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border-2 transition-transform hover:-translate-y-1 hover:rotate-1 cursor-default select-none align-middle ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
