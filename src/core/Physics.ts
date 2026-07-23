import { GRAVITY } from '../constants';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Physics {
    /**
     * Updates velocity based on gravity
     * Returns a new state object to maintain immutability
     */
    static applyGravity(velocity: number): number {
        return velocity + GRAVITY;
    }

    /**
     * AABB (Axis-Aligned Bounding Box) Collision Detection
     * Checks if a circular object (bird) collides with a rectangular object (pipe)
     */
    static checkCollision(birdX: number, birdY: number, birdRadius: number, pipe: Rect): boolean {
        // Find the closest point on the rectangle to the center of the circle
        const closestX = Math.max(pipe.x, Math.min(birdX, pipe.x + pipe.width));
        const closestY = Math.max(pipe.y, Math.min(birdY, pipe.y + pipe.height));

        // Calculate the distance between the circle's center and this closest point
        const distanceX = birdX - closestX;
        const distanceY = birdY - closestY;

        // If the distance is less than the radius, an intersection has occurred
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (birdRadius * birdRadius);
    }
}