# amiltondesigner.com — Portfolio Experience

Portfólio de [Amilton Schlemper](https://www.behance.net/amilton-schlemper), UI/UX Designer Sênior. Não é um portfólio tradicional: é uma experiência narrativa em cinco capítulos onde o próprio site é o primeiro case, mostrando o pensamento antes das telas.

A visão completa do produto está em [`docs/VISION.md`](docs/VISION.md), a fonte da verdade de toda decisão de layout, animação e arquitetura.

## A experiência

1. **Abertura** — impacto e silêncio, tipografia cinética
2. **Descoberta** — quem pensa assim (sem seção "Sobre")
3. **Pensamento** — cinco atos scrubados: perguntas, hipóteses, rabiscos, descartes e consequência
4. **Evidências** — os projetos como prova, abrindo em overlay com URL própria
5. **Conexão** — contato direto via construtor de mensagem de WhatsApp, sem formulário

Sem navbar: um ponto fixo (na cor do capítulo atual) abre o mapa conceitual. Tem um manifesto escondido pra quem explora.

## Stack

- [Astro 7](https://astro.build) estático + ilhas [Preact](https://preactjs.com)
- [Tailwind CSS v4](https://tailwindcss.com) com tokens de capítulo interpolados via `@property`
- [GSAP + ScrollTrigger](https://gsap.com) (cenas só no desktop com motion) + [Lenis](https://lenis.darkroom.engineering)
- Conteúdo dos cases em MDX (`src/content/projects/`)
- Tipografia: [Clash Display](https://www.fontshare.com/fonts/clash-display) (display, self-host, licença ITF FFL) + Inter (corpo)

Acessibilidade como piso: mobile, no-JS e `prefers-reduced-motion` recebem a versão editorial linear com 100% do conteúdo, e o alvo é zero violações no axe.

## Rodando

```bash
npm install
npm run dev      # localhost:4321 (daemon; parar com: npx astro dev stop)
npm run check    # typecheck (astro check)
npm run build    # site estático em dist/
```

## Estrutura

```
src/
  config/        site.ts, inquiry.ts, chapters.ts (paletas e nós do mapa)
  scripts/       experience.ts (orquestrador: tema por capítulo, Lenis, cenas)
  components/
    experience/  os 5 capítulos + CaseOverlay + ConceptMap
    contact/     construtor de mensagem do WhatsApp
  content/       cases em MDX
  pages/         index, trabalho/[slug], 404 (+ /dev/type, specimen local)
docs/VISION.md   fonte da verdade do produto
```
