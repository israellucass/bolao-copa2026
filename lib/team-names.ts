/**
 * Nomes das seleções em português brasileiro (como exibidos na mídia esportiva do BR).
 */

const BY_TLA: Record<string, string> = {
  URY: "Uruguai",
  GER: "Alemanha",
  ESP: "Espanha",
  PAR: "Paraguai",
  ARG: "Argentina",
  GHA: "Gana",
  BRA: "Brasil",
  POR: "Portugal",
  JPN: "Japão",
  MEX: "México",
  ENG: "Inglaterra",
  USA: "Estados Unidos",
  KOR: "Coreia do Sul",
  FRA: "França",
  RSA: "África do Sul",
  ALG: "Argélia",
  AUS: "Austrália",
  NZL: "Nova Zelândia",
  SUI: "Suíça",
  ECU: "Equador",
  SWE: "Suécia",
  CZE: "Tchéquia",
  CRO: "Croácia",
  KSA: "Arábia Saudita",
  TUN: "Tunísia",
  TUR: "Turquia",
  SEN: "Senegal",
  BEL: "Bélgica",
  MAR: "Marrocos",
  AUT: "Áustria",
  COL: "Colômbia",
  EGY: "Egito",
  CAN: "Canadá",
  HAI: "Haiti",
  IRN: "Irã",
  BIH: "Bósnia e Herzegovina",
  PAN: "Panamá",
  CPV: "Cabo Verde",
  COD: "RD Congo",
  CIV: "Costa do Marfim",
  QAT: "Catar",
  JOR: "Jordânia",
  IRQ: "Iraque",
  UZB: "Uzbequistão",
  NED: "Holanda",
  NOR: "Noruega",
  SCO: "Escócia",
  CUW: "Curaçao",
};

const BY_NAME: Record<string, string> = {
  uruguay: "Uruguai",
  germany: "Alemanha",
  spain: "Espanha",
  paraguay: "Paraguai",
  argentina: "Argentina",
  ghana: "Gana",
  brazil: "Brasil",
  brasil: "Brasil",
  portugal: "Portugal",
  japan: "Japão",
  mexico: "México",
  méxico: "México",
  england: "Inglaterra",
  "united states": "Estados Unidos",
  usa: "Estados Unidos",
  "south korea": "Coreia do Sul",
  "korea republic": "Coreia do Sul",
  france: "França",
  "south africa": "África do Sul",
  algeria: "Argélia",
  australia: "Austrália",
  "new zealand": "Nova Zelândia",
  switzerland: "Suíça",
  ecuador: "Equador",
  sweden: "Suécia",
  czechia: "Tchéquia",
  "czech republic": "Tchéquia",
  croatia: "Croácia",
  "saudi arabia": "Arábia Saudita",
  tunisia: "Tunísia",
  turkey: "Turquia",
  senegal: "Senegal",
  belgium: "Bélgica",
  morocco: "Marrocos",
  austria: "Áustria",
  colombia: "Colômbia",
  egypt: "Egito",
  canada: "Canadá",
  haiti: "Haiti",
  iran: "Irã",
  "bosnia-herzegovina": "Bósnia e Herzegovina",
  "bosnia-h.": "Bósnia e Herzegovina",
  panama: "Panamá",
  "cape verde islands": "Cabo Verde",
  "cape verde": "Cabo Verde",
  "congo dr": "RD Congo",
  "ivory coast": "Costa do Marfim",
  "côte d'ivoire": "Costa do Marfim",
  qatar: "Catar",
  jordan: "Jordânia",
  iraq: "Iraque",
  uzbekistan: "Uzbequistão",
  netherlands: "Holanda",
  holland: "Holanda",
  norway: "Noruega",
  scotland: "Escócia",
  curaçao: "Curaçao",
  curacao: "Curaçao",
  "a definir": "A definir",
  tbd: "A definir",
};

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function toPortugueseTeamName(
  name: string | null | undefined,
  tla?: string | null
): string {
  if (!name && !tla) return "A definir";

  if (tla) {
    const byCode = BY_TLA[tla.toUpperCase()];
    if (byCode) return byCode;
  }

  if (!name) return "A definir";

  const trimmed = name.trim();
  const key = normalizeKey(trimmed);
  const translated = BY_NAME[key];
  if (translated) return translated;

  // Já está em português ou nome desconhecido — capitaliza primeira letra
  return trimmed;
}

export function isBrasilTeamName(name: string): boolean {
  const key = normalizeKey(name);
  return key === "brasil" || key === "brazil";
}
