import { test, expect } from "@playwright/test";

const APP_URL = process.env.E2E_BASE_URL ?? "http://localhost:4173";

const battleSelectors = {
  titleScreen: "#title-screen",
  battleScreen: "#battle-screen",
  resultScreen: "#result-screen",
  startButton: "#btn-start",
  attackButton: "#cmd-attack",
  backToTitle: "#btn-result-title",
};

test.describe("Battle flow smoke", () => {
  test("navigates title → battle → result → title", async ({ page }) => {
    await page.goto(APP_URL);

    await page.waitForSelector(`${battleSelectors.titleScreen}.screen--active`);
    await expect(page.locator(battleSelectors.startButton)).toBeVisible();

    await page.click(battleSelectors.startButton);
    await page.waitForSelector(`${battleSelectors.battleScreen}.screen--active`);
    await expect(page.locator(battleSelectors.attackButton)).toBeVisible();

    await page.evaluate(async () => {
      const app = (window as any).__casualGameApp;
      if (app?.finishBattle) {
        await app.finishBattle(true);
      } else {
        throw new Error("GameApp instance not found on window");
      }
    });

    await page.waitForSelector(`${battleSelectors.resultScreen}.screen--active`);
    await expect(page.locator(battleSelectors.backToTitle)).toBeVisible();

    await page.click(battleSelectors.backToTitle);
    await page.waitForSelector(`${battleSelectors.titleScreen}.screen--active`);
  });
});
