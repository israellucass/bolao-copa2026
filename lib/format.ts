import { toPortugueseTeamName } from "./team-names";

export function formatTeamName(name: string): string {
  return toPortugueseTeamName(name);
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Valor numérico sem o símbolo R$ (ex: "4,00") */
export function formatAmountBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMatchDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(isoDate));
}

/** Máscara brasileira: (98) 99999-9999 — até 11 dígitos */
export function maskWhatsAppInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return maskWhatsAppInput(digits);
  }
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return maskWhatsAppInput(digits);
}

export function normalizeWhatsApp(value: string): string {
  return value.replace(/\D/g, "");
}
