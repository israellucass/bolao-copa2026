"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface CopyPixButtonProps {
  pixKey: string;
  className?: string;
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CopyPixButton({ pixKey, className }: CopyPixButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Chave Pix copiada" : "Copiar chave Pix"}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition active:scale-[0.98]",
        copied
          ? "border-lime-600/60 bg-lime-950/60 text-lime-300"
          : "border-lime-600/50 bg-lime-400 text-stone-950 hover:bg-lime-300",
        className
      )}
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>Copiado!</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-4 w-4 shrink-0" />
          <span>Copiar</span>
        </>
      )}
    </button>
  );
}
