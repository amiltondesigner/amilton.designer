/**
 * Capítulos da Portfolio Experience — fonte única de narrativa e paleta.
 * Ver docs/VISION.md: a cor representa o momento da jornada, nunca só identidade.
 *
 * Cada paleta foi validada WCAG AA (texto 4.5:1) nos pares usados pela UI;
 * a página /dev/type recalcula e exibe os ratios como prova viva.
 */

export type ChapterId =
  | "abertura"
  | "descoberta"
  | "pensamento"
  | "evidencias"
  | "conexao";

export type ChapterPalette = {
  /** fundo do capítulo (claro, tingido pela dominante) */
  background: string;
  /** texto principal */
  foreground: string;
  /** texto secundário */
  muted: string;
  /** dominante do capítulo — CTA, destaques, texto de acento */
  accent: string;
  /** versão profunda da dominante — momentos de impacto (fundo inunda) */
  deep: string;
};

export type Chapter = {
  id: ChapterId;
  numero: string;
  label: string;
  /** uma linha sobre o papel narrativo (uso interno/dev) */
  papel: string;
  palette: ChapterPalette;
};

/** Texto claro usado sobre fundos `deep` nos momentos de impacto. */
export const paper = "#FAFAF7";

/** Vermelho reservado aos descartes/erros do capítulo Pensamento. */
export const descarte = "#D92D20";

export const chapters: Chapter[] = [
  {
    id: "abertura",
    numero: "01",
    label: "Abertura",
    papel: "Impacto e silêncio. Quase nenhuma informação, muito espaço.",
    palette: {
      background: "#FAF6F0",
      foreground: "#1C1917",
      muted: "#57534E",
      accent: "#44403C",
      deep: "#1C1917",
    },
  },
  {
    id: "descoberta",
    numero: "02",
    label: "Descoberta",
    papel:
      "Quem é o Amilton. A abertura explode e apaga a luz: capítulo escuro, azul na sombra.",
    palette: {
      background: "#0F1522",
      foreground: "#F2F5FB",
      muted: "#A7B4CB",
      accent: "#8FB3FF",
      deep: "#101B36",
    },
  },
  {
    id: "pensamento",
    numero: "03",
    label: "Pensamento",
    papel: "Como ele resolve problemas. Laranja; vermelho só nos descartes.",
    palette: {
      background: "#FBF2E9",
      foreground: "#201509",
      muted: "#635247",
      accent: "#C2410C",
      deep: "#9A3412",
    },
  },
  {
    id: "evidencias",
    numero: "04",
    label: "Evidências",
    papel: "Os projetos como prova do discurso. Verde.",
    palette: {
      background: "#EEF6EE",
      foreground: "#101913",
      muted: "#48594C",
      accent: "#15803D",
      deep: "#14532D",
    },
  },
  {
    id: "conexao",
    numero: "05",
    label: "Conexão",
    papel: "Contato como consequência. Violeta.",
    palette: {
      background: "#F3F0FA",
      foreground: "#171221",
      muted: "#564D6B",
      accent: "#6D28D9",
      deep: "#4C1D95",
    },
  },
];

/**
 * Nós do mapa conceitual (navegação sem menu — ver VISION.md).
 * Regra (Amilton, 2026-07-03): cada nó leva a um destino DISTINTO;
 * os quatro princípios do Pensamento viraram um nó só e os cases
 * entram como satélites (abrem direto no overlay).
 * Manifesto é conteúdo exclusivo do mapa (recompensa de exploração).
 */
export const mapNodes = [
  {
    id: "quem",
    label: "Quem pensa",
    href: "#descoberta",
    desc: "o designer por trás",
  },
  {
    id: "pensamento",
    label: "Como eu penso",
    href: "#pensamento",
    desc: "processo, pesquisa, interface, IA",
  },
  {
    id: "provas",
    label: "As provas",
    href: "#evidencias",
    desc: "quatro projetos",
  },
  {
    id: "manifesto",
    label: "Manifesto",
    href: "#manifesto",
    desc: "só existe aqui",
  },
  {
    id: "conversar",
    label: "Conversar",
    href: "#conexao",
    desc: "direto no WhatsApp",
  },
] as const;
