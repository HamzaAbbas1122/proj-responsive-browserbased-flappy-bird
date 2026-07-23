export class HUD {
    /**
     * Renders the real-time score overlay on the game canvas.
     * @param ctx The canvas 2D rendering context.
     * @param score The current game score to display.
     */
    draw(ctx: CanvasRenderingContext2D, score: number): void {
        // Set styles for the score text
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        
        // Use a bold, large font for high visibility
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Position the score at the top center of the canvas
        const x = ctx.canvas.width / 2;
        const y = 60;

        // Draw the stroke first to create an outline effect (common in arcade games)
        ctx.strokeText(score.toString(), x, y);
        
        // Fill the text with white
        ctx.fillText(score.toString(), x, y);
    }
}