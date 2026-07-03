---
name: benchmark-visual
description: Benchmarking competitivo visual — pesquisa como os melhores produtos resolvem o mesmo problema
user-invocable: true
argument-hint: [feature]
---

# Benchmark Visual — Analise Competitiva de UX/UI

O usuario quer entender como os melhores produtos do mercado resolvem um problema especifico de UX/UI. Pesquisa, compara e gera relatorio priorizado com oportunidades para o seu produto.

**Input:** Nome da feature ou problema (ex: "rastreamento", "dashboard de KPIs", "onboarding", "status de pedido")

## Steps

1. **WebSearch** para encontrar exemplos atuais do mercado:
   - "{feature} UX best practices 2025 2026"
   - "{feature} SaaS UI"
   - "{feature} design Awwwards Dribbble"
2. Se aplicavel, **Read** a implementacao atual no projeto:
   - **Grep** no codebase para encontrar a feature correspondente
   - **Read** os arquivos da feature atual
3. **Analyze** e comparar: produto atual vs mercado vs melhores praticas
4. **Write** resultado em `docs/benchmarks/YYYY-MM-DD_benchmark-{slug}.md`

---

## Prompt de Execucao

> **Mode: Strategic intelligence.** Nao copie — entenda os principios por tras das melhores solucoes.

### Personas

**1. UX Researcher** — Especialista em analise competitiva e benchmarking. Identifica patterns recorrentes, outliers positivos e oportunidades nao exploradas. Documenta com rigor metodologico.

**2. Product Strategist** — Entende o mercado do produto. Sabe o que e viavel para a maturidade tecnica e operacional do time. Prioriza oportunidades por impacto x esforco.

### Categorias de Analise

Para cada produto benchmarked, avaliar:

1. **Information Architecture:** Como organizam a informacao?
2. **Visual Design:** Que patterns visuais usam?
3. **Interaction Design:** Como o usuario interage?
4. **Data Visualization:** Como mostram dados/metricas?
5. **Trust & Compliance:** Sinais de confianca, transparencia, trilha de auditoria (quando aplicavel)
6. **Mobile Experience:** Como funciona em mobile?
7. **CTA Clarity:** Acao primaria e clara? Conversao e facilitada? (ref: Tapflare B2B rubric)
8. **Differentiator:** O que fazem de unico?

### Filosofia

1. **Principios > Screenshots.** Entender POR QUE funciona, nao apenas COMO parece.
2. **Contexto brasileiro.** Padroes do mercado BR podem diferir do mercado US/EU.
3. **Viabilidade.** Cada oportunidade deve ser realizavel com a stack e equipe do projeto.
4. **Quick wins.** Identificar o que pode ser implementado em 1-2 sprints.
5. **Nao reinventar.** Se o mercado convergiu para um padrao, ha razao.

---

## Template de Output

```markdown
# Benchmark Visual — {Feature}

**Data:** {YYYY-MM-DD}
**Tag:** [P1]
**Status:** Em analise
**Feature:** {descricao}

---

## Resumo Executivo

{2-3 paragrafos: o que o mercado faz, onde o produto esta, quais as oportunidades}

---

## Produtos Analisados

### {Produto 1} — {categoria}

**URL:** {se disponivel}
**Segmento:** {SaaS/e-commerce/institucional/geral}

| Criterio | Score (1-5) | Observacao |
|----------|------------|-----------|
| Information Architecture | {score} | {nota} |
| Visual Design | {score} | {nota} |
| Interaction Design | {score} | {nota} |
| Data Visualization | {score} | {nota} |
| Mobile Experience | {score} | {nota} |
| **Media** | **{X.X}** | |

**Destaque:** {o que fazem de melhor}
**Fraqueza:** {onde falham}
**Pattern key:** {1 pattern que o produto poderia adotar}

### {Produto 2}
{mesmo formato}

### {Produto 3}
{mesmo formato}

---

## Patterns Recorrentes (convergencia de mercado)

| Pattern | Adotado por | Relevancia |
|---------|------------|---------------|
| {pattern 1} | {produtos} | {Alta/Media/Baixa} |
| {pattern 2} | {produtos} | {Alta/Media/Baixa} |

---

## Produto Atual vs Mercado

| Aspecto | Hoje | Media Mercado | Melhor do Mercado | Gap |
|---------|---------|--------------|------------------|-----|
| {aspecto 1} | {como e} | {como a maioria faz} | {quem faz melhor} | {Alto/Medio/Baixo} |

---

## Oportunidades Priorizadas

### Oportunidade 1: {titulo}

- **Impacto:** {Alto/Medio/Baixo}
- **Esforco:** {Alto/Medio/Baixo}
- **Referencia:** {produto que faz bem}
- **Descricao:** {o que implementar}
- **Quick win?** {Sim/Nao}

### Oportunidade 2
{idem}

---

## Matriz Impacto x Esforco

```
IMPACTO
Alto   │ [Opp 1]          │ [Opp 3]
       │   FAZER JA        │   PLANEJAR
       │                   │
Medio  │───────────────────┤──────────────
       │ [Opp 4]          │ [Opp 5]
       │   QUICK WIN       │   CONSIDERAR
Baixo  │                   │
       └───────────────────┴──────────────
        Baixo              Alto
                    ESFORCO
```

## Proximos Passos

1. {acao imediata}
2. {acao de medio prazo}
3. {acao de longo prazo}
```

