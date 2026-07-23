import { GRAVITY, JUMP_FORCE, BIRD_RADIUS } from '../constants';
import { Physics } from '../core/Physics';

export interface BirdState {
    x: number;
    y: number;
    velocity: number;
    rotation: number;
}

export class Bird {
    private state: BirdState;
    private readonly canvasHeight: number;

    constructor(canvasHeight: number) {
        this.canvasHeight = canvasHeight;
        this.state = {
            x: 50,
            y: canvasHeight / 2,
            velocity: 0,
            rotation: 0
        };
    }

    /**
     * Updates the bird's position and velocity based on physics.
     * Implements immutability by creating a new state object.
     */
    update(): void {
        const newVelocity = Physics.applyGravity(this.state.velocity);
        const newY = this.state.y + newVelocity;

        // Clamp bird to screen boundaries
        const clampedY = Math.max(0, Math.min(this.canvasHeight - BIRD_RADIUS, newY));
        
        // Calculate rotation based on velocity (tilting up when jumping, down when falling)
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (newVelocity * 0.1)));

        this.state = { ...this.state, y: clampedY, velocity: newVelocity, rotation };
    }

    /**
     * Applies an upward force to the bird.
     */
    jump(): void {
        this.state = { ...this.state, velocity: JUMP_FORCE };
    }

    /**
     * Renders the bird to the canvas.
     * @param ctx The canvas 2D rendering context.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        const { x, y, rotation } = this.state;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Draw Bird Body
        ctx.fillStyle = '#f8d020';
        ctx.beginPath();
        ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(BIRD_RADIUS / 2, -BIRD_RADIUS / 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(BIRD_RADIUS / 2 + 1, -BIRD_RADIUS / 3, 1, 0, Math.PI * 2);
        ctx.fill();

        // Draw Beak
        ctx.fillStyle = '#f5a623';
        ctx.beginPath();
        ctx.moveTo(BIRD_RADIUS - 2, 0);
        ctx.lineTo(BIRD_RADIUS + 5, 2);
        ctx.lineTo(BIRD_RADIUS - 2, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Getter for the current state to be used by the Physics engine for collision detection.
     */
    getState(): BirdState {
        return { ...this.state };
    }

    /**
     * Resets the bird to the starting position.
     */
    reset(): void {
        this.state = {
            x: 50,
            y: this.canvasHeight / 2,
            velocity: 0,
            rotation: 0
        };
    }
}