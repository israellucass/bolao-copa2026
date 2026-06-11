"use client";

import { useState } from "react";
import { maskWhatsAppInput } from "@/lib/format";
import { theme } from "@/lib/theme";

interface WhatsAppInputProps {
  id?: string;
  name?: string;
  defaultValue?: string;
  required?: boolean;
}

export function WhatsAppInput({
  id = "whatsapp",
  name = "whatsapp",
  defaultValue = "",
  required = true,
}: WhatsAppInputProps) {
  const [value, setValue] = useState(() => maskWhatsAppInput(defaultValue));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(maskWhatsAppInput(e.target.value));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && value.endsWith(") ")) {
      e.preventDefault();
      setValue(maskWhatsAppInput(value.replace(/\D/g, "").slice(0, -1)));
    }
  }

  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      required={required}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="(98) 99999-9999"
      maxLength={16}
      className={theme.input}
      aria-describedby={`${id}-hint`}
    />
  );
}
