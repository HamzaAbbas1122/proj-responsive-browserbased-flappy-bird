import { Point } from '../types';

export class Bird {
  public position: Point = { x: 50, y: 300 };
  public velocity: number = 0;
  private gravity: number = 0.6;
  private jumpStrength: number = -8;
  private radius: number = 15;

  constructor() {
    this.position.y = 300;
  }

  public jump(): void {
    this.velocity = this.jumpStrength;
  }

  public update(deltaTime: number): void {
    // Apply gravity
    this.velocity += this.gravity * deltaTime;
    this.position.y += this.velocity * deltaTime;

    // Floor collision
    if (this.position.y > 550) {
      this.position.y = 550;
      this.velocity = 0;
    }

    // Ceiling collision
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity = 0;
    }
  }

  public getRadius(): number {
    return this.radius;
  }

  public reset(): void {
    this.position.y = 300;
    this.velocity = 0;
  }
}