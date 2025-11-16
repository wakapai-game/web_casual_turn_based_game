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

test.describe("Battle flow interactions", () => {
  test("player can attack, defend, use an item, and perform a swap", async ({ page }) => {
    await startBattle(page);

    await expect(page.locator("#player-front-name")).toContainText("Hero");

    await page.click("#cmd-attack");
    await expect(page.locator("#battle-log")).toContainText("[action_attack]");
    await waitForPlayerTurn(page);

    await page.click("#cmd-defend");
    await expect(page.locator("#battle-log")).toContainText("[action_defend]");
    await waitForPlayerTurn(page);

    await page.click("#cmd-item");
    await expect(page.locator("#battle-log")).toContainText("[item_use]");
    await expect(page.locator("#inventory-display")).toContainText("x0");
    await waitForPlayerTurn(page);

    await page.evaluate(() => {
      const app = (window as any).__casualGameApp;
      if (app?.parties?.player?.members) {
        app.parties.player.members.forEach((member: any) => {
          member.currentST = member.maxST;
        });
        app.renderParties();
      }
    });

    await page.click("#cmd-swap");
    await page.waitForSelector("#swap-panel[aria-hidden='false']");
    await expect(page.locator("#battle-log")).toContainText("[swap_request]");

    const firstCandidate = page.locator("#swap-candidates button:not(.candidate-card--disabled)").first();
    const candidateName = (await firstCandidate.locator(".candidate-card__name").textContent())?.trim() ?? "";
    await firstCandidate.click();
    await expect(page.locator("#btn-swap-confirm")).not.toBeDisabled();
    await page.click("#btn-swap-confirm");
    await expect(page.locator("#swap-panel")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("#battle-log")).toContainText("[swap_confirmed]");
    await expect(page.locator("#player-front-name")).toContainText(candidateName);
  });
});
