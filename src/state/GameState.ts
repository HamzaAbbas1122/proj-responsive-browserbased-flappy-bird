import { GameState as GameStateEnum } from '../types';

export class GameStateManager {
  private state: GameStateEnum = GameStateEnum.START;
  private score: number = 0;

  public getState(): GameStateEnum {
    return this.state;
  }

  public setState(state: GameStateEnum): void {
    this.state = state;
    if (state === GameStateEnum.START) {
      this.score = 0;
    }
  }

  public getScore(): number {
    return this.score;
  }

  public incrementScore(): void {
    this.score++;
  }

  public resetScore(): void {
    this.score = 0;
  }
}
