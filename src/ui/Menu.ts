export class Menu {
    private isVisible: boolean = false;
    private score: number = 0;
    private highScore: number = 0;
    private restartCallback: () => void;
    private menuElement!: HTMLDivElement;
    private scoreText!: HTMLParagraphElement;

    constructor(restartCallback: () => void) {
        this.restartCallback = restartCallback;
        this.initDOM();
    }

    private initDOM(): void {
        // Create the main menu container
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'game-menu';
        this.menuElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 30px 50px;
            border-radius: 20px;
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: none;
            flex-direction: column;
            gap: 20px;
            border: 5px solid #f8d020;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            z-index: 100;
            min-width: 200px;
        `;

        // Game Over Title
        const title = document.createElement('h1');
        title.innerText = 'GAME OVER';
        title.style.cssText = `
            margin: 0;
            font-size: 32px;
            color: #f8d020;
            text-shadow: 2px 2px #000;
        `;

        // Score Display
        const scoreText = document.createElement('p');
        this.scoreText = scoreText;
        this.scoreText.style.cssText = `
            margin: 0;
            font-size: 20px;
            font-weight: bold;
        `;

        // Restart Button
        const btn = document.createElement('button');
        btn.innerText = 'RESTART';
        btn.style.cssText = `
            padding: 12px 24px;
            font-size: 20px;
            cursor: pointer;
            background: #f8d020;
            color: #000;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            transition: transform 0.1s, background 0.2s;
            box-shadow: 0 4px #c4a010;
        `;

        // Button Hover/Active effects
        btn.onmouseover = () => btn.style.background = '#ffe066';
        btn.onmouseout = () => btn.style.background = '#f8d020';
        btn.onmousedown = () => {
            btn.style.transform = 'translateY(2px)';
            btn.style.boxShadow = '0 2px #c4a010';
        };
        btn.onmouseup = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px #c4a010';
        };

        btn.onclick = () => this.restart();

        this.menuElement.appendChild(title);
        this.menuElement.appendChild(scoreText);
        this.menuElement.appendChild(btn);
        document.body.appendChild(this.menuElement);
    }

    /**
     * Displays the game over menu with the final score and high score.
     * @param score The score achieved in the current game.
     * @param highScore The all-time high score retrieved from storage.
     */
    show(score: number, highScore: number): void {
        this.isVisible = true;
        this.score = score;
        this.highScore = highScore;
        this.scoreText.innerText = `Score: ${score} | Best: ${highScore}`;
        this.menuElement.style.display = 'flex';
    }

    /**
     * Hides the game over menu.
     */
    hide(): void {
        this.isVisible = false;
        this.menuElement.style.display = 'none';
    }

    /**
     * Triggers the restart logic and hides the menu.
     */
    private restart(): void {
        this.hide();
        this.restartCallback();
    }
}