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

test.describe("Swap validation and forced swaps", () => {
  test("KO backliners are disabled in the swap modal", async ({ page }) => {
    await startBattle(page);

    await page.evaluate(() => {
      const app = (window as any).__casualGameApp;
      if (app?.parties?.player?.members) {
        const member = app.parties.player.members[2];
        member.currentHP = 0;
        app.renderParties();
      }
    });

    await page.click("#cmd-swap");
    await page.waitForSelector("#swap-panel[aria-hidden='false']");
    await expect(page.locator("#battle-log")).toContainText("[swap_request]");
    await expect(page.locator("#swap-candidates button[data-index='2']")).toBeDisabled();
    await page.click("#btn-swap-cancel");
    await expect(page.locator("#swap-panel")).toHaveAttribute("aria-hidden", "true");
  });

  test("forced swaps trigger on KO and ST lockout", async ({ page }) => {
    await startBattle(page);

    await page.evaluate(() => {
      const app = (window as any).__casualGameApp;
      const front = app.getFrontMember(app.parties.player);
      if (front) {
        front.currentHP = 1;
      }
      app.renderParties();
    });

    await page.click("#cmd-attack");
    await waitForPlayerTurn(page);
    await expect(page.locator("#battle-log")).toContainText("[forced_swap]");
    await page.waitForSelector("#forced-swap-banner[aria-hidden='false']");

    await page.evaluate(() => {
      const app = (window as any).__casualGameApp;
      if (!app?.parties?.player) return;
      const party = app.parties.player;
      party.members.forEach((member: any, idx: number) => {
        member.currentHP = member.maxHP;
        member.currentST = member.maxST;
        if (idx !== party.frontIndex) {
          member.currentST = member.maxST;
        }
      });
      const front = app.getFrontMember(party);
      if (front) {
        front.currentST = 0;
      }
      app.renderParties();
    });

    await page.click("#cmd-attack");
    await expect(page.locator("#battle-log")).toContainText("[forced_swap]");
  });
});
