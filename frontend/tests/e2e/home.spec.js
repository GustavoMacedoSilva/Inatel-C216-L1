import { expect, test } from "@playwright/test";

test("should display the application home page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "EstantePessoal" }),
  ).toBeVisible();

  await expect(
    page.getByText("Seu catálogo pessoal de leitura."),
  ).toBeVisible();
});
