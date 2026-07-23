import { PIPE_SPEED, PIPE_WIDTH, PIPE_GAP } from '../constants';
import { Rect } from '../core/Physics';

export interface PipeState {
    x: number;
    topHeight: number;
    bottomY: number;
    passed: boolean;
}

export class Pipe {
    private state: PipeState;
    private readonly canvasHeight: number;
    private isActive: boolean = false;

    constructor(canvasHeight: number) {
        this.canvasHeight = canvasHeight;
        this.state = {
            x: 0,
            topHeight: 0,
            bottomY: 0,
            passed: false
        };
    }

    /**
     * Activates the pipe and initializes its position and gap height.
     * Used for object pooling to avoid GC spikes.
     * @param x The starting horizontal position.
     */
    spawn(x: number): void {
        // Randomize the gap position
        // Ensure the pipe doesn't go off-screen (min height 50, max height canvasHeight - GAP - 50)
        const minHeight = 50;
        const maxHeight = this.canvasHeight - PIPE_GAP - minHeight;
        const randomTopHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        this.state = {
            x: x,
            topHeight: randomTopHeight,
            bottomY: randomTopHeight + PIPE_GAP,
            passed: false
        };
        this.isActive = true;
    }

    /**
     * Updates the pipe's position based on the constant pipe speed.
     */
    update(): void {
        if (!this.isActive) return;

        this.state = { ...this.state, x: this.state.x - PIPE_SPEED };
    }

    /**
     * Renders the pipe pair (top and bottom) to the canvas.
     * @param ctx The canvas 2D rendering context.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        ctx.fillStyle = '#2ecc71';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // Top Pipe
        ctx.fillRect(this.state.x, 0, PIPE_WIDTH, this.state.topHeight);
        ctx.strokeRect(this.state.x, 0, PIPE_WIDTH, this.state.topHeight);

        // Bottom Pipe
        const bottomHeight = this.canvasHeight - this.state.bottomY;
        ctx.fillRect(this.state.x, this.state.bottomY, PIPE_WIDTH, bottomHeight);
        ctx.strokeRect(this.state.x, this.state.bottomY, PIPE_WIDTH, bottomHeight);
    }

    /**
     * Returns the collision boxes for both the top and bottom pipes.
     */
    getCollisionRects(): Rect[] {
        return [
            {
                x: this.state.x,
                y: 0,
                width: PIPE_WIDTH,
                height: this.state.topHeight
            },
            {
                x: this.state.x,
                y: this.state.bottomY,
                width: PIPE_WIDTH,
                height: this.canvasHeight - this.state.bottomY
            }
        ];
    }

    /**
     * Marks the pipe as inactive so it can be recycled by the pool.
     */
    recycle(): void {
        this.isActive = false;
    }

    /**
     * Checks if the bird has passed the pipe to increment score.
     */
    checkPassed(birdX: number): boolean {
        if (this.isActive && !this.state.passed && birdX > this.state.x + PIPE_WIDTH) {
            this.state = { ...this.state, passed: true };
            return true;
        }
        return false;
    }

    isActive(): boolean {
        return this.isActive;
    }

    getX(): number {
        return this.state.x;
    }
}