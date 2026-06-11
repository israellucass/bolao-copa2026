import { toPortugueseTeamName } from "./team-names";

/** Códigos flagcdn.com (ISO ou subdivisão, ex: gb-sct). */
const FLAG_BY_PT: Record<string, string> = {
  Uruguai: "uy",
  Alemanha: "de",
  Espanha: "es",
  Paraguai: "py",
  Argentina: "ar",
  Gana: "gh",
  Brasil: "br",
  Portugal: "pt",
  Japão: "jp",
  México: "mx",
  Inglaterra: "gb-eng",
  "Estados Unidos": "us",
  "Coreia do Sul": "kr",
  França: "fr",
  "África do Sul": "za",
  Argélia: "dz",
  Austrália: "au",
  "Nova Zelândia": "nz",
  Suíça: "ch",
  Equador: "ec",
  Suécia: "se",
  Tchéquia: "cz",
  Croácia: "hr",
  "Arábia Saudita": "sa",
  Tunísia: "tn",
  Turquia: "tr",
  Senegal: "sn",
  Bélgica: "be",
  Marrocos: "ma",
  Áustria: "at",
  Colômbia: "co",
  Egito: "eg",
  Canadá: "ca",
  Haiti: "ht",
  Irã: "ir",
  "Bósnia e Herzegovina": "ba",
  Panamá: "pa",
  "Cabo Verde": "cv",
  "RD Congo": "cd",
  "Costa do Marfim": "ci",
  Catar: "qa",
  Jordânia: "jo",
  Iraque: "iq",
  Uzbequistão: "uz",
  Holanda: "nl",
  Noruega: "no",
  Escócia: "gb-sct",
  Curaçao: "cw",
};

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function getTeamFlagCode(teamName: string): string | null {
  const ptName = toPortugueseTeamName(teamName);
  if (FLAG_BY_PT[ptName]) return FLAG_BY_PT[ptName];

  const key = normalizeKey(teamName);
  const fromEnglish = FLAG_BY_PT[toPortugueseTeamName(key)];
  if (fromEnglish) return fromEnglish;

  return null;
}

export function getTeamFlagUrl(
  teamName: string,
  width: 20 | 24 | 32 | 40 = 40
): string | null {
  const code = getTeamFlagCode(teamName);
  if (!code) return null;
  return `https://flagcdn.com/w${width}/${code}.png`;
}
