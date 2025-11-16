import { test, expect, Page } from "@playwright/test";

const APP_URL = process.env.E2E_BASE_URL ?? "http://localhost:4173";

async function startBattle(page: Page) {
  await page.goto(APP_URL);
  await page.waitForSelector("#title-screen.screen--active");
  await page.click("#btn-start");
  await page.waitForSelector("#battle-screen.screen--active");
  await waitForPlayerTurn(page);
}

async function waitForPlayerTurn(page: Page) {
  await page.waitForFunction(() => {
    const button = document.querySelector<HTMLButtonElement>("#cmd-attack");
    return !!button && !button.disabled;
  });
}

test.describe("Backline recovery and visibility", () => {
  test("backline ST regenerates while enemy ST stays hidden", async ({ page }) => {
    await startBattle(page);

    await page.evaluate(() => {
      const app = (window as any).__casualGameApp;
      if (!app?.parties?.player) return;
      const party = app.parties.player;
      party.members.forEach((member: any, idx: number) => {
        if (idx !== party.frontIndex) {
          member.currentST = 5;
        }
      });
      app.renderParties();
    });

    await page.click("#cmd-attack");
    await waitForPlayerTurn(page);

    await expect(page.locator("#battle-log")).toContainText("[backline_st_regen]");
    await expect(page.locator("#backline-st-live")).toContainText("+3");
    await expect(page.locator("#player-backline .mini-gauge__fill--st").first()).toBeVisible();
    await expect(page.locator("#enemy-front-card .gauge--st")).toHaveCount(0);
    await expect(page.locator("#enemy-backline .mini-gauge__fill--st")).toHaveCount(0);
  });
});
