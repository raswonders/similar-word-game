"use strict";

import {
  updateInGameUI,
  updatePostGameUI,
  updatePageContent,
  updateScoreUI,
  updateLivesUI,
} from "./ui";

export class Game {
  constructor() {
    this.state = "pre-game";
    this.score = 0;
    this.lives = 3;
    updatePageContent("pre-game");
  }

  play() {
    this.changeState("in-game");
  }

  stop() {
    this.changeState("post-game");
  }

  changeState(state) {
    this.state = state;
    if (state === "in-game") updateInGameUI(this.lives, this.score);
    if (state === "post-game") updatePostGameUI(this.score);
    updatePageContent(state);
  }

  removeLife() {
    this.lives--;
    updateLivesUI(this.lives);
    if (this.lives <= 0) this.stop();
  }

  addScore(value) {
    this.score += value;
    updateScoreUI(this.score);
  }
}