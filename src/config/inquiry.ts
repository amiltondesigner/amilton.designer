/**
 * Opções do construtor de mensagem do WhatsApp.
 * Amilton: edite à vontade os grupos e opções abaixo, a UI se adapta.
 */
export type InquiryGroup = {
  id: "services" | "type" | "deadline" | "budget";
  label: string;
  /** permite selecionar mais de uma opção */
  multi?: boolean;
  optional?: boolean;
  options: string[];
};

export const inquiryGroups: InquiryGroup[] = [
  {
    id: "services",
    label: "Do que você precisa?",
    multi: true,
    options: ["UI/UX Design", "Brand Design", "Product Design", "Consultoria"],
  },
  {
    id: "type",
    label: "Que tipo de projeto?",
    options: ["App", "Site / Landing", "Sistema / Plataforma", "Outro"],
  },
  {
    id: "deadline",
    label: "Qual o prazo?",
    options: ["Tenho urgência", "Nos próximos meses", "Só explorando"],
  },
  {
    id: "budget",
    label: "Faixa de investimento?",
    optional: true,
    options: ["Até R$ 5 mil", "R$ 5 a 15 mil", "R$ 15 mil ou mais", "Prefiro não dizer"],
  },
];

export type InquiryState = {
  services: string[];
  type: string;
  deadline: string;
  budget: string;
  name: string;
  note: string;
};

export const emptyInquiry: InquiryState = {
  services: [],
  type: "",
  deadline: "",
  budget: "",
  name: "",
  note: "",
};

/** Monta a mensagem em PT-BR a partir das escolhas. */
export function buildInquiryMessage(s: InquiryState): string {
  const lines: string[] = ["Oi, Amilton! Cheguei pelo seu site."];
  if (s.services.length) lines.push(`• Preciso de: ${s.services.join(", ")}`);
  if (s.type) lines.push(`• Tipo de projeto: ${s.type}`);
  if (s.deadline) lines.push(`• Prazo: ${s.deadline}`);
  if (s.budget && s.budget !== "Prefiro não dizer")
    lines.push(`• Investimento: ${s.budget}`);
  const who = s.name.trim() ? `Sou ${s.name.trim()}.` : "";
  const note = s.note.trim();
  const last = [who, note].filter(Boolean).join(" ");
  if (last) lines.push(last);
  lines.push("Podemos conversar?");
  return lines.join("\n");
}
