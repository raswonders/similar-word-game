"use strict";

import { Game } from "./state";
import { answersElement } from "./ui";
import { currentTask } from "./task";
import { updateQuestionUI } from "./ui";

let game = new Game();

document.querySelector(".play-now").addEventListener("click", function(e) {
  e.preventDefault();
  game.play();
});

document.querySelector(".play-again").addEventListener("click", function(e) {
  e.preventDefault();
  game = new Game();
  game.play();
});

answersElement.addEventListener("click", function(e) {
  let answerVal = e.target.textContent;
  if (currentTask.isCorrect(answerVal)) {
    celebrate(answerVal);
    game.addScore(10);
    updateQuestionUI();
  } else {
    pointOutAnswer();
    removeLife();
  }
});

function celebrate(choice) {
  console.log(`${choice} is correct!`);
}

function pointOutAnswer() {
  console.log("TODO pointOutAnswer");
}

function removeLife() {
  console.debug("removing health");
  game.removeLife();
}