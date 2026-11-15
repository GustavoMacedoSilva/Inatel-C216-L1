import { expect, test } from "@playwright/test";

const fillCharacterForm = async (page, name) => {
  await page
    .getByRole("button", {
      name: "Criar personagem",
      exact: true,
    })
    .click();

  await page.getByLabel("Nome do personagem").fill(name);
  await page.getByLabel("Raça").selectOption("Humano");
  await page.getByLabel("Classe").selectOption("Paladino");
};

test.describe("Cadastro e listagem de personagens - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("deve exibir a interface de cadastro e as abas", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Taverna do Aventureiro" }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Criar personagem",
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Personagens",
        exact: true,
      }),
    ).toBeVisible();

    await expect(page.getByLabel("Nome do personagem")).toBeVisible();
  });

  test("deve cadastrar e manter o personagem após recarregar a página", async ({
    page,
  }) => {
    const characterName = `Arthas-${Date.now()}`;

    await fillCharacterForm(page, characterName);

    const createResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/characters/"),
    );

    await page
      .getByRole("button", {
        name: "Criar Personagem",
        exact: true,
      })
      .click();

    const created = await createResponse;

    expect(created.status()).toBe(201);

    expect(created.headers()["access-control-allow-origin"]).toBe(
      "http://127.0.0.1:5174",
    );

    await expect(
      page.getByRole("button", {
        name: "Personagens",
        exact: true,
      }),
    ).toHaveAttribute("aria-current", "page");

    await expect(
      page.getByRole("heading", { name: characterName }),
    ).toBeVisible();

    await page.reload();

    await page
      .getByRole("button", {
        name: "Personagens",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", { name: characterName }),
    ).toBeVisible();
  });

  test("deve impedir o cadastro de dois personagens com o mesmo nome", async ({
    page,
  }) => {
    const characterName = `Duplicado-${Date.now()}`;

    await fillCharacterForm(page, characterName);

    await page
      .getByRole("button", {
        name: "Criar Personagem",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("heading", { name: characterName }),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Criar personagem",
        exact: true,
      })
      .click();

    await page.getByLabel("Nome do personagem").fill(characterName);
    await page.getByLabel("Raça").selectOption("Humano");
    await page.getByLabel("Classe").selectOption("Paladino");

    await page
      .getByRole("button", {
        name: "Criar Personagem",
        exact: true,
      })
      .click();

    await expect(page.getByRole("alert")).toHaveText(
      "Já existente um personagem com esse nome",
    );
  });

  test("não deve permitir cadastro com campos vazios", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Criar Personagem",
        exact: true,
      })
      .click();

    await expect(page.getByLabel("Nome do personagem")).toBeFocused();
  });
});
