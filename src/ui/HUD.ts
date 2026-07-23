export class HUD {
    private scoreElement: HTMLDivElement;

    constructor() {
        this.scoreElement = document.createElement('div');
        this.scoreElement.id = 'score';
        this.scoreElement.className = 'score';
        // Keep it visible but positioned off-screen or styled so it doesn't interfere with canvas
        // but is detectable by E2E tests
        this.scoreElement.style.cssText = 'position: absolute; top: -100px; left: 0; visibility: hidden;';
        document.body.appendChild(this.scoreElement);
    }

    draw(ctx: CanvasRenderingContext2D, score: number): void {
        // Update DOM for E2E tests
        this.scoreElement.innerText = score.toString();

        // Set styles for the score text
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = ctx.canvas.width / 2;
        const y = 60;

        ctx.strokeText(score.toString(), x, y);
        ctx.fillText(score.toString(), x, y);
    }
}