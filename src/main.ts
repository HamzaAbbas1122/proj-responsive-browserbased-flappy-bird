import { Engine } from './core/Engine';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Engine();
    game.startLoop();
});