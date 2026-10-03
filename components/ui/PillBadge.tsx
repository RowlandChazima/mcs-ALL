import { ReactNode } from "react";

interface PillBadgeProps {
  children: ReactNode;
  variant?: "coral" | "butter" | "lilac" | "ice";
  className?: string;
}

export function PillBadge({
  children,
  variant = "coral",
  className = "",
}: PillBadgeProps) {
  const variantStyles = {
    coral: "bg-coral text-white border-ink shadow-chunky-sm",
    butter: "bg-butter text-ink border-ink shadow-chunky-sm",
    lilac: "bg-lilac text-ink border-ink shadow-chunky-sm",
    ice: "bg-ice text-ink border-ink shadow-chunky-sm",
  };

  return (
    <span
      className={`inline-flex items-center text-lg sm:text-[24px] font-bold px-4 py-1 mx-1.5 my-1 rounded-full border-2 transition-transform hover:-translate-y-1 hover:rotate-1 cursor-default select-none align-middle ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
