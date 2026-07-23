import { Renderer } from './engine/Renderer';
import { GameStateManager } from './state/GameState';
import { GameState as GameStateEnum } from './types';
import { Bird } from './entities/Bird';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const renderer = new Renderer(canvas);
const gameState = new GameStateManager();
const bird = new Bird();

let lastTime = 0;

function handleInput(): void {
  const currentState = gameState.getState();
  
  if (currentState === GameStateEnum.START) {
    gameState.setState(GameStateEnum.PLAYING);
  } else if (currentState === GameStateEnum.PLAYING) {
    bird.jump();
  } else if (currentState === GameStateEnum.GAME_OVER) {
    bird.reset();
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

function gameLoop(timestamp: number) {
  const deltaTime = lastTime === 0 ? 1 : (timestamp - lastTime) / 16.67; // Normalize to ~60fps
  lastTime = timestamp;

  renderer.clear();
  
  if (gameState.getState() === GameStateEnum.PLAYING) {
    bird.update(deltaTime);
    
    // Render Bird
    renderer.drawRect(
      bird.position.x - bird.getRadius(),
      bird.position.y - bird.getRadius(),
      bird.getRadius() * 2,
      bird.getRadius() * 2,
      'yellow'
    );
  } else if (gameState.getState() === GameStateEnum.START) {
    // Render Bird in idle position
    renderer.drawRect(
      bird.position.x - bird.getRadius(),
      bird.position.y - bird.getRadius(),
      bird.getRadius() * 2,
      bird.getRadius() * 2,
      'yellow'
    );
  }

  renderer.renderUI(gameState);
  
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);