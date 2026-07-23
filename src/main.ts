import { Renderer } from './engine/Renderer';
import { GameStateManager } from './state/GameState';
import { GameState as GameStateEnum } from './types';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const renderer = new Renderer(canvas);
const gameState = new GameStateManager();

function handleInput(): void {
  const currentState = gameState.getState();
  if (currentState === GameStateEnum.START) {
    gameState.setState(GameStateEnum.PLAYING);
  } else if (currentState === GameStateEnum.GAME_OVER) {
    gameState.setState(GameStateEnum.START);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    handleInput();
  }
});

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault();
  handleInput();
});

function gameLoop() {
  renderer.clear();
  
  // Here we would update physics and entities
  // For now, we just render the UI to verify the task
  
  renderer.renderUI(gameState);
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
