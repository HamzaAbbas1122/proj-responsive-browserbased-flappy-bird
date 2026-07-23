import { GameStateManager } from '../state/GameState';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public drawText(text: string, x: number, y: number, fontSize: number, color: string, align: 'center' | 'left' | 'right' = 'center'): void {
    this.ctx.font = `bold ${fontSize}px Arial`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
  }

  public drawRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  public renderUI(gameState: GameStateManager): void {
    const state = gameState.getState();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    if (state === 'START') {
      this.drawOverlay('FLAPPY BIRD', centerX, centerY - 50, 40, 'white');
      this.drawOverlay('Press SPACE or Click to Start', centerX, centerY + 20, 20, 'white');
    }

    if (state === 'PLAYING') {
      this.drawText(`Score: ${gameState.getScore()}`, centerX, 50, 30, 'white');
    }

    if (state === 'GAME_OVER') {
      this.drawOverlay('GAME OVER', centerX, centerY - 50, 40, 'white');
      this.drawOverlay(`Final Score: ${gameState.getScore()}`, centerX, centerY, 25, 'white');
      this.drawOverlay('Press SPACE to Restart', centerX, centerY + 50, 20, 'white');
    }
  }

  private drawOverlay(text: string, x: number, y: number, fontSize: number, color: string): void {
    this.ctx.font = `bold ${fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    
    // Drop shadow for depth
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillText(text, x + 3, y + 3);
    
    this.drawText(text, x, y, fontSize, color);
  }
}