import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Coleção de projetos — fonte única que alimenta a home (lista) e as
 * páginas de case (/trabalho/[slug]). O id vem do nome do arquivo .mdx.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      year: z.number(),
      role: z.string(),
      summary: z.string(),
      order: z.number(),
      /** wide = ênfase maior no grid editorial; narrow = menor */
      span: z.enum(["wide", "narrow"]).default("narrow"),
      /** rótulo curto pro placeholder enquanto não há imagem real */
      glyph: z.string().optional(),
      /** área de atuação associada — exibida como título secundário no detalhe */
      area: z
        .enum([
          "UI/UX Design",
          "Brand Design",
          "Product Design",
          "Consultoria de Design",
        ])
        .optional(),
      /**
       * Imagem de capa. Solte o arquivo em src/content/projects/ e referencie
       * no frontmatter, ex.: `cover: ./greensync.jpg`. astro:assets otimiza.
       */
      cover: image().optional(),
    }),
});

export const collections = { projects };
