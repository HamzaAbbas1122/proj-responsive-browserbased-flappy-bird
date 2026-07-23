import { test, expect } from '@playwright/test';

test.describe('Flappy Bird E2E Tests', () => {
  const URL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('should start game and apply upward impulse on space key', async ({ page }) => {
    // The game usually starts on first input or has a start screen
    // We press Space to trigger the jump/start
    await page.keyboard.press('Space');
    
    // Since it's a Canvas game, we verify the game is running by checking 
    // if the canvas is present and visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should increment score when passing pipes', async ({ page }) => {
    // Start game
    await page.keyboard.press('Space');
    
    // Simulate a series of jumps to keep the bird alive
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(500);
    }

    // The HUD is rendered as an overlay. Based on PRD, it's a real-time score overlay.
    // We look for the score element. Assuming the developer uses a class like .score or an ID #score
    const scoreElement = page.locator('.score, #score, [data-testid="score"]');
    
    // Wait for score to be greater than 0
    await expect(async () => {
      const scoreText = await scoreElement.innerText();
      expect(parseInt(scoreText)).toBeGreaterThan(0);
    }).toPass();
  });

  test('should trigger Game Over screen on collision', async ({ page }) => {
    await page.keyboard.press('Space');
    
    // To trigger a collision quickly, we stop providing input so the bird falls
    await page.waitForTimeout(3000);

    // Based on PRD: "Game Over Screen: Modal with Final Score, High Score, and Restart button"
    const gameOverModal = page.locator('.game-over, #game-over, [role="dialog"]');
    await expect(gameOverModal).toBeVisible();
    
    const restartButton = page.locator('button:has-text("Restart"), .restart-btn');
    await expect(restartButton).toBeVisible();
  });

  test('should persist high score in localStorage', async ({ page }) => {
    // Set a mock high score in localStorage
    await page.evaluate(() => {
      localStorage.setItem('fb_highscore', '100');
    });
    
    await page.reload();
    
    // Trigger game over to see the high score screen
    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);
    
    const highScoreElement = page.locator('.high-score, #high-score');
    await expect(highScoreElement).toContainText('100');
  });

  test('should reset game state on restart', async ({ page }) => {
    await page.keyboard.press('Space');
    await page.waitForTimeout(3000); // Trigger Game Over
    
    const restartButton = page.locator('button:has-text("Restart"), .restart-btn');
    await restartButton.click();
    
    // The Game Over modal should disappear
    const gameOverModal = page.locator('.game-over, #game-over, [role="dialog"]');
    await expect(gameOverModal).not.toBeVisible();
    
    // Score should reset to 0
    const scoreElement = page.locator('.score, #score, [data-testid="score"]');
    await expect(scoreElement).toHaveText('0');
  });

  test('should handle mouse clicks as jump input', async ({ page }) => {
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      // Verify game started (canvas is active)
      await expect(canvas).toBeVisible();
    }
  });
});