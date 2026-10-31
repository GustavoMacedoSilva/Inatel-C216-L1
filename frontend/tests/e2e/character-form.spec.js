import { test, expect } from "@playwright/test";

test.describe("Cadastro de personagens - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("deve exibir a página de cadastro", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Taverna do Aventureiro",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Criar Personagem",
      }),
    ).toBeVisible();

    await expect(page.getByLabel("Nome do personagem")).toBeVisible();

    await expect(page.getByLabel("Raça")).toBeVisible();

    await expect(page.getByLabel("Classe")).toBeVisible();
  });

  test("deve cadastrar um personagem corretamente", async ({ page }) => {
    await page.getByLabel("Nome do personagem").fill("Arthas");

    await page.getByLabel("Raça").selectOption("Humano");

    await page.getByLabel("Classe").selectOption("Paladino");

    // Verifica os valores antes do envio
    await expect(page.getByLabel("Nome do personagem")).toHaveValue("Arthas");

    await expect(page.getByLabel("Raça")).toHaveValue("Humano");

    await expect(page.getByLabel("Classe")).toHaveValue("Paladino");

    // Captura o alerta exibido pelo navegador
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toBe("Personagem criado com sucesso!");

      await dialog.accept();
    });

    await page
      .getByRole("button", {
        name: "Criar Personagem",
      })
      .click();

    // Verifica se os campos foram limpos
    await expect(page.getByLabel("Nome do personagem")).toHaveValue("");

    await expect(page.getByLabel("Raça")).toHaveValue("");

    await expect(page.getByLabel("Classe")).toHaveValue("");
  });

  test("não deve permitir cadastro com campos vazios", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Criar Personagem",
      })
      .click();

    // O navegador deve impedir o envio por validação HTML
    await expect(page.getByLabel("Nome do personagem")).toBeFocused();
  });
});
