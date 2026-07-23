export class Storage {
    private static readonly HIGH_SCORE_KEY = 'fb_highscore';

    static getHighScore(): number {
        const score = localStorage.getItem(this.HIGH_SCORE_KEY);
        return score ? parseInt(score, 10) : 0;
    }

    static setHighScore(score: number): void {
        if (score > this.getHighScore()) {
            localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
        }
    }
}