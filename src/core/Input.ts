import { JUMP_FORCE } from '../constants';

export type InputCallback = () => void;

export class Input {
    private static jumpCallback: InputCallback | null = null;

    /**
     * Initializes event listeners for keyboard and touch inputs.
     * @param onJump Callback function to execute when a jump is triggered.
     */
    static init(onJump: InputCallback): void {
        this.jumpCallback = onJump;

        // Keyboard Input: Space and ArrowUp
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space' || event.code === 'ArrowUp') {
                event.preventDefault();
                this.triggerJump();
            }
        });

        // Touch Input: Screen taps
        window.addEventListener('touchstart', (event) => {
            event.preventDefault();
            this.triggerJump();
        }, { passive: false });

        // Mouse Input: Left click (for desktop testing/playability)
        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                this.triggerJump();
            }
        });
    }

    /**
     * Executes the registered jump callback if it exists.
     */
    private static triggerJump(): void {
        if (this.jumpCallback) {
            this.jumpCallback();
        }
    }

    /**
     * Clears the jump callback to prevent input during game-over or menu states.
     */
    static disable(): void {
        this.jumpCallback = null;
    }

    /**
     * Re-enables the jump callback with a new handler.
     */
    static enable(onJump: InputCallback): void {
        this.jumpCallback = onJump;
    }
}