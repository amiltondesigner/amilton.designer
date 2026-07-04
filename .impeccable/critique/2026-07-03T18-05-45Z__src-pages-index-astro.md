---
target: Portfolio Experience v2 (home 5 capítulos + overlay + mapa + 404)
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-07-03T18-05-45Z
slug: src-pages-index-astro
---
## Design Health Score

| # | Heurística | Nota | Ponto-chave |
|---|-----------|:----:|-----------|
| 1 | Visibilidade do status | 3 | Dot-bússola por capítulo, "Abrindo case…", contador do construtor. Falta indício de progresso dentro do pin de 460%. |
| 2 | Sistema ↔ mundo real | 4 | Metáfora de filme sustentada; PT-BR natural; zero jargão. A melhor heurística do site. |
| 3 | Controle e liberdade | 3 | Esc/✕/back nunca dessincronizam URL e dialog; scrub dá ritmo. Pular a narrativa era só teclado [corrigido: "ou vá direto às provas"]. |
| 4 | Consistência e padrões | 3 | Sistema interno rigoroso; deslizes no mapa mobile (ordem dos satélites) e risco multiline [ambos corrigidos]. |
| 5 | Prevenção de erros | 3 | Tudo opcional, escolhas sobrevivem ao recolher; CTA fixo cobria campos no mobile [corrigido: pb-28]. |
| 6 | Reconhecer > lembrar | 2 | O ponto-mapa é mystery meat: única navegação do site, sem rótulo visível. Preview ao vivo da mensagem é o contraponto excelente. |
| 7 | Flexibilidade/eficiência | 3 | Skip link, atalho direto de WhatsApp, mapa como acelerador, deep-links. |
| 8 | Estético e minimalista | 4 | Vazio deliberado, tipografia protagonista, uma dominante por capítulo. Colisões de transição no palco [corrigidas: espaçamento 1.9 + dispersão lateral]. |
| 9 | Recuperação de erro | 3 | 404 na voz da marca; fetch do overlay falha → navegação de página inteira (fallback honesto). |
| 10 | Ajuda e documentação | 3 | Microcopy contextual: "Role pra entrar", "esc fecha", "tudo opcional". |
| **Total** | | **31/40** | **Bom (topo da faixa), com 2 P1 reais no dia da crítica** |

## Anti-Patterns Verdict — parece feito por IA? Não.

**LLM (Assessment A):** conceito com dono (capítulos/atos, mapa escondido, manifesto como recompensa, símbolo A+S autoral, cor como narrativa). Anti-referências do PRODUCT.md respeitadas. Flertes com gramática de IA: o sistema kicker/eyebrow está saturado (abre TODA dobra), numeração 01-04 com três significados diferentes, a bio "experiências digitais que encantam" era a única frase hype [corrigida], Clash+Inter é o pairing da temporada (execução salva).

**Detector (Assessment B):** CLI: 1 warning (`overused-font` Inter em /dev/type — falso positivo: fonte de corpo deliberada, página interna). Browser: 17/14/2 achados em home/case/404, dos quais reais: `line-length` ~104ch nos 12 parágrafos do case [corrigido: 70ch] e ~92ch num resumo de card [corrigido: 65ch]. Falsos positivos fundamentados: kickers uppercase = sistema nomeado de capítulos/atos; `hero-eyebrow-chip` = componente consistente do site; `cream-palette` = base quente registrada da visão; `gradient-text`/`bounce-easing`/`image-hover-transform` = utilities no bundle Tailwind sem uso no markup autoral (mesma conclusão da crítica v1); `tight-leading` em display type = editorial intencional (regra mira corpo).

**Overlays:** sessão headless (Playwright); sem aba [Human] apresentável. Injeção preflight OK nas 3 páginas, console íntegro coletado, live server parado e confirmado.

## Overall Impression

É um dos raros portfólios que cumpre a própria tese: o site demonstra método antes de mostrar telas. A direção é autoral, o piso técnico (URL síncrona no overlay, fallbacks, axe zero) é raro em scrollytelling. O que segurava a nota no dia: dois P1 (atos invisíveis pra leitores de tela no desktop; dupla exposição nas transições do palco) e a navegação-segredo.

## What's Working

1. **O Ato 04 (descartes) é a melhor peça de storytelling do formato:** "Fogo literal no símbolo" riscado em vermelho e "Uma resposta por tela / SOBREVIVEU" vendem método sem case study. O vermelho foi reservado o site inteiro só pra isso.
2. **Arquitetura serve a narrativa sem sacrificar o resto:** pushState + history.back como única via de fechamento, case→case com replaceState, sem JS/reduced-motion/mobile com 100% do conteúdo.
3. **O construtor de WhatsApp é anti-formulário de verdade:** colapsado, escape hatch, ≤4 chips por grupo, preview editável. A promessa "sem formulário" é cumprida pela interface.

## Priority Issues

- **[P1] Atos invisíveis pra leitor de tela no desktop com motion** — autoAlpha punha visibility:hidden nos 5 atos; o capítulo-tese saía da árvore de acessibilidade. **[corrigido: opacity + pointer-events none; verificado 5/5 visible]**
- **[P1] Dupla exposição nas transições dos Atos 01-02** — perguntas coexistiam no mesmo eixo; hipóteses dispersas colidiam fisicamente. **[corrigido: espaçamento 1.9 com vão real + dispersão lateral; verificado em screenshot]**
- **[P2] Visitante apressado sem porta** — só o ponto sem rótulo e skip link de teclado; ~8.000px até a primeira prova. **[parcialmente corrigido: link "ou vá direto às provas" na Abertura; affordance do ponto segue em aberto — decisão de direção]**
- **[P2] CTA fixo mobile cobria "Resumo rápido"** durante o preenchimento. **[corrigido: pb-28 no construtor expandido]**
- **[P2] Rabisco do Ato 03 ilegível no mobile** (~6px). **[corrigido: corpo dos rótulos sobe no viewBox em <768px]**
- **[P3] Skip link focado parecia quebrado** (sr-only zerava padding). **[corrigido: classe .skip-link própria]**

## Persona Red Flags

**Jordan (decide em minutos):** ganhou a porta "ou vá direto às provas"; o ponto-mapa segue sem rótulo (decisão pendente). Se cair num case compartilhado, a página direta é excelente.
**Casey (mobile, uma mão):** caminho linear sólido; campo não fica mais sob o CTA; escolhas sobrevivem ao recolher (sem indicação disso, P3 aceito).
**Sam (leitor de tela/teclado):** de pior caso a melhor caso: dialogs nativos, foco restaurado, sr-only nos descartes, focus-within fura reveals, e agora o palco inteiro presente na árvore de acessibilidade.

## Minor Observations

- "04 áreas de atuação" era estatística vazia [removida]; células do grid de serviços ainda parecem clicáveis sem ser.
- Bio hype [reescrita: "fazer o complexo caber numa tela simples, sem perder o que importa"].
- Mapa: satélites agora na ordem certa na lista mobile; "esc fecha" só em desktop; linhas de órbita a 14%.
- "Sofia,28" sem espaço está DENTRO da imagem personas.png (asset do Amilton, fora do código).
- Kickers saturados e numeração 01-04 com três significados: em aberto (pergunta de direção).
- 504 "Outdated Optimize Dep" só em dev (Vite); build de produção limpo (suíte passa nele).

## Questions to Consider

1. Se o mapa é A navegação, por que ele é o segredo mais bem guardado do site? O que os dados de clique teriam que mostrar pra admitir que ele precisa de rótulo?
2. O palco de 460% merece scrub contínuo ou atos com snap? Um gesto = um ato mudaria a natureza da cena.
3. Quando todo momento tem kicker numerado, o que sobra pra marcar o momento excepcional? Qual seção ganharia mais se fosse a única SEM ele?
