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

export function formatLogTimestamp(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
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

/** Armazena sempre 11 dígitos: DDD + 9 + número (sem código do país 55). */
export function normalizeWhatsApp(value: string): string {
  let digits = value.replace(/\D/g, "").replace(/^0+/, "");

  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }

  // Celular antigo sem o 9 após o DDD (10 dígitos) → insere o 9
  if (digits.length === 10 && digits[2] !== "9") {
    digits = `${digits.slice(0, 2)}9${digits.slice(2)}`;
  }

  return digits;
}

/** Variantes legadas para encontrar usuário já cadastrado com outro formato. */
export function whatsAppLookupVariants(value: string): string[] {
  const canonical = normalizeWhatsApp(value);
  const variants = new Set<string>([canonical, value.replace(/\D/g, "")]);

  if (canonical.length === 11 && canonical[2] === "9") {
    const legacy10 = `${canonical.slice(0, 2)}${canonical.slice(3)}`;
    variants.add(legacy10);
    variants.add(`55${canonical}`);
    variants.add(`55${legacy10}`);
  }

  return [...variants];
}

export function isValidBrazilianMobileWhatsApp(digits: string): boolean {
  return /^[1-9]{2}9\d{8}$/.test(digits);
}
