# Playwriter — Navegacao Colaborativa e Eficiente

Skill ativada automaticamente quando o Claude Code usa o plugin Playwriter para navegacao no browser.

## Alternativas de MCP (avaliar migracao)

| MCP | Vantagem | Status |
|-----|----------|--------|
| `playwriter` (atual) | Funciona, testado | Em uso |
| [`@playwright/cli`](https://testcollab.com/blog/playwright-cli) | **4x menos tokens**, YAML snapshots, refs compactas (`e21`). Nao precisa extensao. | Avaliar — melhor fit para Claude Code |
| [`microsoft/playwright-mcp`](https://github.com/microsoft/playwright-mcp) | 30k+ stars, oficial. Chrome bridge (sessao autenticada), upload, `get_visible_html` | Alternativa robusta |

**Recomendacao:** testar `@playwright/cli` (`npx @playwright/cli snapshot <url>`) para reduzir tokens drasticamente.

## Principios

1. **Observe antes de agir.** Nunca clicar, digitar ou navegar sem antes entender o estado da tela.
2. **Pedir ajuda rapido, nao insistir sozinho.** O olho humano resolve modais, popups e z-index em 1 segundo.
3. **Economizar tokens.** Snapshots antes de screenshots. Uma acao por chamada. Sem retries cegos.

---

## Loop Fundamental: Observe → Act → Observe

Toda interacao com o browser segue este ciclo:

```
1. OBSERVE  — accessibilitySnapshot() ou snapshot()
2. ANALISE  — identificar elemento alvo, verificar se ha overlays bloqueantes
3. ACT      — UMA unica acao (click, type, goto)
4. OBSERVE  — snapshot de verificacao para confirmar resultado
```

**Regra critica:** NUNCA encadear multiplas acoes sem snapshot intermediario.

---

## Gestao de Pagina e Estado

### Usar `state.page` para persistir referencia da tab

```js
// Primeira chamada — inicializar
state.page = context.pages().find(p => p.url().includes('meusite'))
  ?? (await context.newPage())
await state.page.goto('https://exemplo.com')

// Chamadas seguintes — reutilizar
await state.page.click('text=Entrar')
```

Isso evita interferencia entre tabs e perda de contexto entre chamadas.

### Apos toda navegacao (goto), checar overlays

```js
await state.page.goto(url)
await waitForPageLoad()
const snap = await accessibilitySnapshot({ page: state.page })
// Procurar por: "aceitar", "consent", "fechar", "cookie", modais
// Dispensar overlays ANTES de prosseguir com a acao principal
```

---

## Utility Functions Disponiveis

Usar a ferramenta certa para cada situacao:

| Funcao | Quando usar | Custo |
|--------|------------|-------|
| `accessibilitySnapshot({ page })` | **Sempre como primeiro passo.** Estrutura semantica da pagina | Baixo (5-20KB texto) |
| `screenshotWithAccessibilityLabels({ page })` | Quando precisa verificacao visual com labels sobrepostos | Alto (100KB+) |
| `screenshot()` | Verificacao visual simples | Alto |
| `getPageMarkdown()` | Extrair conteudo textual da pagina (usa Readability) | Medio |
| `getCleanHTML()` | HTML semantico com busca | Medio |
| `waitForPageLoad()` | Aguardar carregamento inteligente (ignora analytics) | — |
| `getLatestLogs()` | Ler console do browser (debug) | Baixo |
| `recording.start()` / `recording.stop()` | Gravar video da sessao | — |

**Regra:** Preferir `accessibilitySnapshot()` sobre `screenshot()` sempre que possivel. Screenshot so quando a informacao visual for essencial.

---

## Escala de Recovery: Tentativa → Reset → Ajuda

Quando uma acao falha:

```
Tentativa 1  →  falhou  →  snapshot para entender por que
Tentativa 2  →  falhou  →  mcp__playwriter__reset (limpar estado)
Tentativa 3  →  falhou  →  PARAR e pedir ajuda ao usuario
```

O `reset` limpa o estado interno do Playwriter e pode resolver problemas de sessao/memoria. Usar ANTES de pedir ajuda — se resolver, economiza tempo do usuario.

---

## Roteiro de Navegacao

Antes de comecar uma sequencia complexa, apresentar o plano ao usuario:

```
Vou precisar:
1. Trocar para perfil Admin
2. Ir em Embarcadores
3. Clicar no Tech Parts
4. Verificar os valores de Saldo/Limite

Se eu travar em algum passo, te peco ajuda.
```

Isso permite ao usuario antecipar onde pode ser necessario intervir.

---

## Regras de Interacao

### 1. Uma acao por chamada execute
NAO tentar fazer tudo em 1 chamada. Dividir em passos atomicos com snapshot de verificacao entre eles.

### 2. Pedir screenshot quando incerto
Ao inves de adivinhar o estado da tela:
- "Pode tirar um screenshot do que voce esta vendo?"
- "Pode me dizer se o modal esta aberto?"
- "Qual texto aparece no botao?"

### 3. Dar coordenadas ao usuario
Quando pedir ajuda, ser especifico:
- "Clica no botao 'Sair' no menu que abriu"
- "Fecha o modal clicando no X no canto superior direito"
- "Seleciona 'Admin' no dropdown de perfil"
- NAO dizer "clica em algum lugar" — sempre dar contexto

### 4. Nao insistir em seletores frageis
Se `page.click('text=Admin')` falha porque ha multiplos matches:
- NAO tentar variantes do mesmo seletor
- Pedir ao usuario: "Tem mais de um elemento com texto 'Admin' na tela. Pode clicar no correto?"

### 5. Usar evaluate como fallback tecnico
Quando clique normal falha, tentar `page.evaluate()` para encontrar o elemento no DOM:

```js
await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Fechar"]');
  if (btn) btn.click();
});
```

Isso e a tentativa 2, antes do reset.

---

## Quando Pedir Ajuda — Referencia Rapida

| Situacao | Acao |
|----------|------|
| Modal/popup nao fecha | "Fecha o modal pra mim? Vou aguardar." |
| Dropdown nao abre | "Clica no seletor de perfil e seleciona Admin" |
| Elemento nao encontrado | "Nao achei o botao X. Esta visivel na tela?" |
| Clique errado (abriu coisa errada) | "Abriu o elemento errado. Pode voltar pro estado anterior?" |
| Timeout em acao | Fazer reset primeiro. Se persistir: "Pode executar manualmente?" |
| Z-index bloqueando | "Tem algo na frente (checklist/modal). Pode fechar?" |
| CAPTCHA ou 2FA | "Preciso que voce resolva o CAPTCHA/2FA. Avisa quando terminar." |
| Extensao desconectada (icone cinza) | "O icone do Playwriter esta cinza. Pode clicar nele pra reconectar?" |

---

## Fluxo Colaborativo Ideal

```
Claude: "Vou navegar para Admin > Embarcadores > Tech Parts"
Claude: [snapshot → identifica estado → tenta via Playwriter]
Claude: [falhou 2x no seletor de perfil → reset]
Claude: [tentou 1x apos reset → ainda falhou]
Claude: "Nao consigo trocar o perfil. Pode selecionar Admin no dropdown do nav-rail?"
Usuario: "feito"
Claude: [snapshot para confirmar estado]
Claude: [continua navegacao]
```

---

## Anti-patterns — NAO fazer

1. **NAO** agir sem observar — sempre snapshot antes de qualquer acao
2. **NAO** tentar o mesmo clique 5x com variacoes de seletor
3. **NAO** usar sleeps longos (>3s) esperando animacoes — usar `waitForPageLoad()`
4. **NAO** adivinhar coordenadas de pixel
5. **NAO** fazer scroll agressivo tentando encontrar elemento
6. **NAO** ignorar erros de timeout e seguir em frente
7. **NAO** fazer multiplas acoes numa unica chamada execute
8. **NAO** chamar `browser.close()` ou `context.close()` — mata a sessao
9. **NAO** usar screenshot como primeiro recurso — snapshot primeiro
10. **NAO** tentar resolver CAPTCHA ou 2FA — sempre pedir ao usuario
