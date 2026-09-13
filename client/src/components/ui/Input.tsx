import type { InputHTMLAttributes } from "react";

export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:border-brand-crimson focus:outline-none ${className}`}
      {...props}
    />
  );
}
