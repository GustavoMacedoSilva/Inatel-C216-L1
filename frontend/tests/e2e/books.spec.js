import { expect, test } from "@playwright/test";

test("should create, edit, persist and delete a book", async ({ page }) => {
  const originalTitle = `Livro E2E ${Date.now()}`;
  const updatedTitle = `${originalTitle} - Editado`;

  await page.goto("/");

  // Criação
  await page.getByRole("button", { name: /adicionar livro/i }).click();

  await page.getByLabel("Título *").fill(originalTitle);
  await page.getByLabel("Autor *").fill("Autor dos testes E2E");
  await page.getByLabel("Total de páginas *").fill("250");

  await page.getByRole("button", { name: "Adicionar livro" }).click();

  await expect(
    page.getByRole("heading", { name: originalTitle }),
  ).toBeVisible();

  // Persistência após recarregar a página
  await page.reload();

  await expect(
    page.getByRole("heading", { name: originalTitle }),
  ).toBeVisible();

  // Edição
  await page.getByRole("button", { name: `Editar ${originalTitle}` }).click();

  await page.getByLabel("Título *").fill(updatedTitle);

  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();

  // Exclusão
  page.on("dialog", (dialog) => dialog.accept());

  await page.getByRole("button", { name: `Excluir ${updatedTitle}` }).click();

  await expect(
    page.getByRole("heading", { name: updatedTitle }),
  ).not.toBeVisible();
});
