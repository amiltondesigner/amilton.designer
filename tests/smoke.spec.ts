/**
 * Smoke da Portfolio Experience: jornada, overlay de cases, mapa,
 * fallbacks (mobile/reduced-motion) e acessibilidade (axe = 0 violações).
 * A régua de a11y do projeto: o caminho linear tem 100% do conteúdo.
 */
import { test, expect, type Page } from "playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function esperaAxeZero(page: Page) {
  const resultado = await new AxeBuilder({ page }).analyze();
  expect(
    resultado.violations,
    resultado.violations.map((v) => `${v.id}: ${v.help}`).join("; "),
  ).toEqual([]);
}

test.describe("jornada", () => {
  test("os 5 capítulos existem e o tema acompanha o scroll", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    for (const id of [
      "abertura",
      "descoberta",
      "pensamento",
      "evidencias",
      "conexao",
    ]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await page.evaluate(() =>
      document.getElementById("conexao")!.scrollIntoView(),
    );
    await expect
      .poll(() => page.evaluate(() => document.body.dataset.chapter), {
        timeout: 5_000,
      })
      .toBe("conexao");
  });

  test("404 de verdade para rota inexistente", async ({ page }) => {
    const resposta = await page.goto("/nao-existe");
    expect(resposta!.status()).toBe(404);
    await expect(page.getByText("Erro 404")).toBeVisible();
  });
});

test.describe("overlay de cases", () => {
  test("abre com URL própria, fecha com Esc e o histórico volta", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // como um usuário: rola até a evidência (o reveal a torna visível) e clica
    const card = page.locator('#evidencias a[href="/trabalho/greensync"]');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await card.click();
    const overlay = page.locator(".case-overlay");
    await expect(overlay).toHaveAttribute("open", "");
    await expect(page).toHaveURL(/\/trabalho\/greensync/);
    await expect(overlay.locator("h1")).toContainText("energia solar");

    await page.keyboard.press("Escape");
    await expect(overlay).not.toHaveAttribute("open", "");
    await expect(page).toHaveURL(/\/$/);
  });

  test("deep-link renderiza a página completa do case", async ({ page }) => {
    await page.goto("/trabalho/serenity/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("App de meditação");
    await expect(page.locator('article[data-case-conteudo]')).toBeAttached();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://amiltondesigner.com/trabalho/serenity/",
    );
  });
});

test.describe("mapa conceitual", () => {
  test("o ponto abre o mapa, o manifesto existe e Esc fecha", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.click(".ponto-mapa");
    const mapa = page.locator(".mapa-overlay");
    await expect(mapa).toHaveAttribute("open", "");
    // 5 destinos distintos + 4 cases satélites
    await expect(mapa.locator(".mapa-no")).toHaveCount(9);

    await mapa.getByRole("button", { name: /Manifesto/ }).click();
    await expect(mapa.locator(".manifesto-linha").first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(mapa).not.toHaveAttribute("open", "");
  });

  test("navegar por um nó fecha o mapa e rola até a âncora", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.click(".ponto-mapa");
    await page.getByRole("button", { name: /Como eu penso/ }).click();
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              Math.abs(
                document
                  .getElementById("pensamento")!
                  .getBoundingClientRect().top,
              ),
          ),
        { timeout: 8_000 },
      )
      .toBeLessThan(500);
  });

  test("case satélite do mapa abre direto no overlay", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.click(".ponto-mapa");
    await page.locator('.mapa-caso[href="/trabalho/serenity"]').click();
    const overlay = page.locator(".case-overlay");
    await expect(overlay).toHaveAttribute("open", "");
    await expect(page).toHaveURL(/\/trabalho\/serenity/);
    await expect(overlay.locator("h1")).toContainText("App de meditação");
    await expect(page.locator(".mapa-overlay")).not.toHaveAttribute(
      "open",
      "",
    );
  });
});

test.describe("conexão", () => {
  test("construtor de mensagem abre e fecha preservando escolhas", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const abrir = page.getByRole("button", { name: "Montar minha mensagem" });
    await abrir.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // hidratação da ilha (client:visible)
    await abrir.click();
    await expect(page.locator("#construtor-whatsapp")).toBeVisible();

    await page.getByRole("button", { name: "UI/UX Design" }).click();
    await page.getByRole("button", { name: "Recolher o construtor" }).click();
    await expect(page.locator("#construtor-whatsapp")).toHaveCount(0);

    await page.getByRole("button", { name: "Montar minha mensagem" }).click();
    await expect(
      page.getByRole("button", { name: "UI/UX Design" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("fallbacks lineares", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("reduced-motion: sem pins e conteúdo 100% visível", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect(
      await page.evaluate(() => document.querySelectorAll(".pin-spacer").length),
    ).toBe(0);
    expect(
      await page.evaluate(
        () =>
          getComputedStyle(document.querySelector(".palavra-inner")!).transform,
      ),
    ).toBe("none");
    expect(
      await page.evaluate(
        () => getComputedStyle(document.querySelector("[data-anima]")!).opacity,
      ),
    ).toBe("1");
  });
});

test.describe("mobile linear", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("sem pins, atos do Pensamento empilhados e visíveis", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    expect(
      await page.evaluate(() => document.querySelectorAll(".pin-spacer").length),
    ).toBe(0);
    expect(
      await page.evaluate(
        () =>
          [...document.querySelectorAll(".cena")].filter(
            (c) => getComputedStyle(c).position === "static",
          ).length,
      ),
    ).toBe(5);
  });
});

test.describe("acessibilidade (axe)", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("home sem violações", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await esperaAxeZero(page);
  });

  test("case sem violações", async ({ page }) => {
    await page.goto("/trabalho/greensync/", { waitUntil: "networkidle" });
    await esperaAxeZero(page);
  });

  test("404 sem violações", async ({ page }) => {
    await page.goto("/nao-existe");
    await esperaAxeZero(page);
  });

  test("overlay aberto sem violações", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.click('#evidencias a[href="/trabalho/greensync"]');
    await expect(page.locator(".case-overlay h1")).toContainText("energia solar");
    await esperaAxeZero(page);
  });

  test("mapa aberto sem violações", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.click(".ponto-mapa");
    await expect(page.locator(".mapa-no").first()).toBeVisible();
    await esperaAxeZero(page);
  });
});
