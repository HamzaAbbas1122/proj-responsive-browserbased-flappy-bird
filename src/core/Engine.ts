import { Input } from './Input';
import { Bird } from '../entities/Bird';
import { Pipe } from '../entities/Pipe';
import { Physics } from './Physics';
import { BIRD_RADIUS, PIPE_WIDTH } from '../constants';
import { HUD } from '../ui/HUD';
import { Menu } from '../ui/Menu';
import { Storage } from '../utils/Storage';

export class Engine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private bird: Bird;
    private pipes: Pipe[] = [];
    private pipePool: Pipe[] = [];
    private score: number = 0;
    private isGameOver: boolean = false;
    private isGameStarted: boolean = false;
    private hud: HUD;
    private menu: Menu;
    
    private readonly CANVAS_WIDTH = 320;
    private readonly CANVAS_HEIGHT = 480;
    private readonly PIPE_SPAWN_RATE = 100; // frames between pipes
    private frameCount: number = 0;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;

        this.bird = new Bird(this.CANVAS_HEIGHT);
        this.hud = new HUD();
        this.menu = new Menu(() => this.resetGame());

        Input.init(() => this.handleJump());
    }

    private handleJump(): void {
        if (this.isGameOver) return;
        if (!this.isGameStarted) {
            this.isGameStarted = true;
        }
        this.bird.jump();
    }

    private resetGame(): void {
        this.bird.reset();
        
        // Return all pipes to pool
        this.pipes.forEach(p => p.recycle());
        this.pipes = [];
        
        this.score = 0;
        this.isGameOver = false;
        this.isGameStarted = false;
        this.frameCount = 0;
        this.menu.hide();
        
        // Re-enable input
        Input.enable(() => this.handleJump());
    }

    private spawnPipe(): void {
        // Object Pooling: Try to get an inactive pipe from the pool first
        let pipe = this.pipePool.find(p => !p.isActive());
        
        if (!pipe) {
            pipe = new Pipe(this.CANVAS_HEIGHT);
            this.pipePool.push(pipe);
        }
        
        pipe.spawn(this.CANVAS_WIDTH);
        this.pipes.push(pipe);
    }

    update(): void {
        if (!this.isGameStarted || this.isGameOver) return;

        this.frameCount++;
        this.bird.update();

        if (this.frameCount % this.PIPE_SPAWN_RATE === 0) {
            this.spawnPipe();
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.update();

            // Collision Detection
            const birdState = this.bird.getState();
            const rects = pipe.getCollisionRects();
            for (const rect of rects) {
                if (Physics.checkCollision(birdState.x, birdState.y, BIRD_RADIUS, rect)) {
                    this.gameOver();
                }
            }

            // Score tracking
            if (pipe.checkPassed(birdState.x)) {
                this.score++;
            }

            // Recycling: Mark as inactive and remove from active list
            if (pipe.getX() + PIPE_WIDTH < 0) {
                pipe.recycle();
                // To maintain the pool, we remove it from the active list
                // but the object remains in this.pipePool
                this.pipes.splice(i, 1);
            }
        }

        // Floor/Ceiling collision
        const birdStateFinal = this.bird.getState();
        if (birdStateFinal.y <= 0 || birdStateFinal.y >= this.CANVAS_HEIGHT) {
            this.gameOver();
        }
    }

    private gameOver(): void {
        this.isGameOver = true;
        Storage.setHighScore(this.score);
        this.menu.show(this.score, Storage.getHighScore());
        
        // Disable jump input during game over
        Input.disable();
    }

    render(): void {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        // Background
        this.ctx.fillStyle = '#70c5ce';
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.pipes.forEach(pipe => pipe.draw(this.ctx));
        this.bird.draw(this.ctx);
        
        this.hud.draw(this.ctx, this.score);

        if (!this.isGameStarted && !this.isGameOver) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press Space or Tap to Start', this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT / 2);
        }
    }

    startLoop(): void {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}