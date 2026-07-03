---
target: home (one-page portfolio) + 4 cases + 404
total_score: 36
p0_count: 0
p1_count: 0
timestamp: 2026-06-24T14-54-31Z
slug: src-pages-index-astro
---
## Design Health Score

| # | Heurística | Nota | Δ | Ponto-chave |
|---|-----------|:----:|:--:|-----------|
| 1 | Visibilidade do status | 3 | = | Resumo ao vivo, estado dos chips, "✓ Copiado", CTA que aparece. Sem "enviado" in-page (hand-off ao WhatsApp). |
| 2 | Sistema ↔ mundo real | 4 | = | PT-BR natural; verde = o app real; narrativa de case agora concreta. |
| 3 | Controle e liberdade | 3 | = | Mensagem editável, "restaurar", copiar; o 404 dá saída do beco. Falta "limpar tudo". |
| 4 | Consistência | 4 | = | Um sistema coeso; o 404 reforça a mesma linguagem. |
| 5 | Prevenção de erro | 3 | = | Tudo opcional + pré-montado; chips eliminam erro de texto livre. |
| 6 | Reconhecer > lembrar | 4 | = | Preview ao vivo elimina memória; toda opção visível. |
| 7 | Flexibilidade/eficiência | 3 | = | Três caminhos + CTA na zona do polegar. Sem atalhos de teclado (não precisa). |
| 8 | Estético e minimalista | 4 | = | Editorial, zero slop no markup; cases agora coerentes ponta a ponta. |
| 9 | Recuperação de erro | **4** | **+1** | 404 próprio, on-brand, com diagnóstico e duas saídas claras; clipboard cai em seleção manual. |
| 10 | Ajuda e documentação | **4** | **+1** | "Tudo opcional" surge onde a dúvida nasce; placeholders + "abre direto no seu WhatsApp" + preview autoexplicativo. |
| **Total** | | **36/40** | **+2** | **Excelente (base da faixa)** |

## Anti-Patterns Verdict — parece feito por IA? Não.

O scan voltou **11 ocorrências, e só 1 está no HTML renderizado** (`numbered-section-markers: 01–04`, as etiquetas das partes do construtor, sequência guiada legítima pela própria regra do skill). As outras 10 são a camada de utilitários do Tailwind (`.border-l-2`, `bg-clip-text`, `text-gray-400 on bg-blue-500`, `animate-bounce`) que existem como definições no bundle mas não aparecem em nenhum componente, mais `Inter` (identidade travada). **0 tells genuínos no markup autoral.** O 404 novo e a copy dos quatro cases não acrescentaram nenhuma ocorrência.

## Overall Impression

Subiu de "muito bom" para "pronto pra mostrar". O que travava em 34 era a promessa não paga: o home prometia craft que os cases não entregavam. Agora os quatro cases têm narrativa real, ancorada nas telas, e cada "Ver case" leva a algo que sustenta o primeiro olhar. O 404 fecha o único beco sem saída do site. O que sobra é refinamento de gosto, não falha.

## What's Working

1. **A promessa agora se paga.** Home forte → "Ver case" → case real (problema, decisões, resultado honesto). O GreenSync ("o que eu faço com isso?"), o Wood Grill (o W vazado na grelha), o GeoTrack (densidade domada) e o Serenity (a interface que "some") provam repertório de fato, não placeholder.
2. **O construtor como qualificador.** Preview ao vivo + edição final + CTA no polegar + "tudo opcional". O lead chega contextualizado e a interface nunca exige memória.
3. **Coerência até no erro.** O 404 não é genérico: mesma tipografia monumental, mesmo azul cirúrgico, saídas claras. A marca não quebra nem fora da rota.

## Priority Issues

Tudo que sobra é P3 (refinamento, sem impacto real de uso):

- **[P3] Numeração 01–04 do construtor.** As partes não têm ordem obrigatória, então o número sugere sequência que não existe. *Eu manteria* pela sensação de "quatro partes curtas"; trocar por rótulos puros é a alternativa.
- **[P3] Sem "limpar tudo" no construtor.** Dá pra desmarcar chip a chip, mas um reset rápido ajudaria quem quer recomeçar.
- **[P3] Prova social.** Nenhum nome de cliente ou resultado aparece. Uma linha discreta elevaria a confiança sem sujar o layout.

## Persona Red Flags

**Jordan (1º contato):** flag anterior resolvida. O "tudo opcional" aparece exatamente onde a dúvida nascia. Sobra zero atrito de entrada.

**Casey (mobile, uma mão):** forte. CTA no polegar, estado in-page, chips agora a 40px (subiram de ~34px, confortáveis; 44px seria o teto ideal). Interrupção não perde nada.

**Sam (leitor de tela/teclado):** forte. axe 0/0 em home, case e 404; foco visível, `aria-pressed`, textarea rotulada, CTA fora de tela sem foco. Reveal é enhancement (conteúdo nasce visível).

## Minor Observations

- O 404 retorna status HTTP 404 de verdade (não 200 disfarçado), correto pra SEO e crawlers.
- Reveal variado (cards/imagens em scale, texto subindo) seguiu sem regressão.
- Os quatro `summary` dos cards saíram de fórmula ("transforma X em Y") para frases concretas.

## Questions to Consider

- O site está em nível de envio. O que segura o deploy hoje além da decisão de domínio/host?
- Vale abrir versão EN agora (o conteúdo está maduro) ou depois de mais cases reais?
- Uma única prova social (nome de cliente, número real) mudaria a conversa com quem chega pela primeira vez?
