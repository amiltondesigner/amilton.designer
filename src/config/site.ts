/**
 * Configuração central do site. Fonte única para identidade, contato e redes.
 */
export const site = {
  name: "Amilton Schlemper",
  role: "Designer de Produtos Digitais",
  tagline: "Crio produtos digitais fáceis de usar e difíceis de esquecer.",
  bio: "Sou Amilton, designer há mais de 15 anos. Ajudo a deixar mais simples o que ficou complicado, sem perder o que importa.",
  yearsOfExperience: 15,
  location: "Ibirama, SC, Brasil",
  whatsapp: "5547988065376", // E.164 sem '+', para wa.me
  social: {
    behance: "https://www.behance.net/amilton-schlemper/",
    dribbble: "https://dribbble.com/amiltondesigner",
    figma: "https://www.figma.com/@amiltondesigner",
    linkedin: "https://www.linkedin.com/in/amiltondesigner/",
  },
} as const;

export const services = [
  { id: "uiux", label: "UI/UX Design" },
  { id: "brand", label: "Brand Design" },
  { id: "product", label: "Product Design" },
  { id: "consulting", label: "Consultoria de Design" },
] as const;

/** Monta a URL do WhatsApp com a mensagem já urlencoded. */
export function whatsappUrl(text: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
