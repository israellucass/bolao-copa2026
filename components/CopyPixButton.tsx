"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";

interface CopyPixButtonProps {
  pixKey: string;
}

export function CopyPixButton({ pixKey }: CopyPixButtonProps) {
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
      className={`${theme.btnGhost} shrink-0 px-3 py-2 text-xs`}
    >
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}
