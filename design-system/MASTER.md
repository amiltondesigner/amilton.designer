# Design System — Portfólio Amilton Schlemper (MASTER)

Fonte da verdade para a revisão premium. **Dark-only** (sem switch de tema) — convertido em 2026-06-23 remapeando os tokens.
Projeto Framer `mCwjzR1jj2V4k7Bh1V4F` · sessão `1` · relay port `19989`.

## Tema (dark-only)
Re-skin feito remapeando os valores `light` dos tokens (não há dark mode ativo; o slot `light` carrega as cores escuras).
| Papel | Token | Valor dark |
|---|---|---|
| Fundo da página | Background/Disabled [0] `d7cf06c5` | `#0B0B0D` |
| Superfície/card (elevado) | Background/White `aeb9b272` | `#18181B` |
| Borda/sutil | Background/Normal [25] `4a2af52f` | `#27272A` |
| Texto principal | Text/Normal [500] `1bebaf07` | `#FAFAFA` |
| Texto secundário | Text/Subdued [400] `75df6c99` | `#A1A1AA` |
| Acento (CTA/links) | Primary/100 `df87b371` | `#3B82F6` (mais luminoso no dark) |

Notas: foto do hero foi re-cropada (moldura branca estava embutida no PNG) e re-subida → `1T7KwbG1QPcoAF7wdWebZzcxhs.png`. Botão "Simple Secondary" (`BNtRvdgS1`) virou ghost dark. Pills/cards do form de contato têm fills escuros hardcoded.

## Tipografia
- **Títulos (H1/H2/H3/H4, Display, Title, Subtitle):** **Inter Display** — 700 (display/H1), 600 (H2/H3/H4). Tracking levemente negativo nos grandes (-0.02em H1, -0.015em H2, -0.01em H3).
- **Corpo/parágrafos:** **Inter** — 500 (lead/XL/MD), 400 (SM/XS).
- Base 16px, line-height ~1.5. Tabular numbers (Inter `tnum`) em dados/datas/preços.
- ❌ Rejeitado: Space Grotesk / Archivo (usuário prefere Inter/neutro).

## Cores (ColorStyleTokenNode — evoluídos in place)
| Token (nome no Framer) | Valor light | Uso |
|---|---|---|
| `Text/Normal [500]` | `#18181B` (rgb 24,24,27) | títulos / texto principal |
| `Text/Loud [900]` | ~`#000` | ênfase máxima |
| `Text/Subdued [400]` | `#52525B` (rgb 82,82,91) | texto secundário (corrigido p/ WCAG AA) |
| `Primary/25` | `#60A5FA` | azul claro |
| `Primary/50` | `#3B82F6` | azul |
| `Primary/100` | `#2563EB` | **acento principal** (CTA, links, destaque) |
| `Primary/200` | `#1D4ED8` | azul escuro |
| `Primary/300` | `#1E40AF` | azul mais escuro |
| `Background/White` | `#FFFFFF` | superfícies/cards |
| (fundo de página) | ~`#FAFAFA` | fundo |

Regra: base monocromática (grafite/neutros) + **azul como acento cirúrgico** (1 ação primária por tela). Evitar azul espalhado.

## Espaçamento / forma
- Escala 4/8px (gaps 8/16/24/32/48). Padding de seção consistente.
- Raio concêntrico: card > botão > input.
- Efeitos de vidro/blur só em acentos (parcimônia — alerta de contraste/perf).

## Status de render
⚠️ Renderizador on-demand do agente + preview falhando project-wide ("missing modules"/CodeError) — **não causado pelas edições** (revert test) e site publicado renderiza ok. Verificação visual via editor do Framer até o render normalizar.

## Breakpoints
Desktop `BuGfRD_DJ` (≥1440) · Tablet `iz8IaQRM6` (810–1439) · Phone `CrM65H6FZ` (≤809).

## IDs úteis
- Páginas: home `iNp6NwX4i` · meus-projetos `Iz0n6wy2U` · detalhe `YIDXar1mg` · contato `rCp0gKxkG` · obrigado `qNgzx4LX1` · 404 `YnMw3hiAY`
- Layout template "Home": `JKOdZoegA`
- CMS Projects: `qOQe0xwFx` (4 itens)
- Presets título (Inter Display): Ss_ZWq_TF, oZlmYr1FD, wdOHsqOpQ (700); hYuMv717b, OdI3e17Xp, LqA9HWpH_, pfGhme45C, RD90YSH4n, EKK4gZCOL, H1CjFJzqy, BAgW2gYZD (600)
- Presets corpo (Inter): ZnekVA9au, zippme_qp (500); S1PHtaFDP, IOPP6wl0c (400)
