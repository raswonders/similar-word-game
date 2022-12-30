"use strict";

import { getTask } from "./task";

let state = localStorage.getItem('state') || 'pre-game';

let pageContentElemList = document.querySelectorAll('div.page-content')

class Game {
  constructor() {
    this.state = 'pre-game'
    this.score = 0;
    this.lives = 3;
    this.updateQuestionUI();
    this.refreshUI();
  }

  play() {
    this.changeState('in-game')
  }

  stop() {
    document.querySelector('.score-total').textContent = game.score;
    this.changeState('post-game');
  }

  changeState(state) {
    this.state = state;
    this.refreshUI();
  }

  removeLife() {
    if (this.lives >= 1) {
      this.lives--;
      this.updateLivesUI();
    }

    if (this.lives === 0) this.stop();
  }

  addScore(value) {
    this.score += value;
    this.updateScoreUI();
  }

  refreshUI() {
    this.updateLivesUI();
    this.updateScoreUI();
    for (let page of pageContentElemList) {
      if (page.classList.contains(this.state)) {
        page.classList.remove('hidden');
      } else {
        page.classList.add('hidden');
      }
    }
  }

  updateLivesUI() {
    let elem = document.querySelector(".health-bar");
    let livesHTML = "";
    for (let i = 0; i < this.lives; i++) {
      livesHTML += `<li><i class="health-bar-item fa-solid fa-heart"></i></li>\n`;
    }
    for (let i = 0; i < 3 - this.lives; i++) {
      livesHTML += `<li><i class="health-bar-item fa-solid fa-heart-crack"></i></li>\n`;
    }
    elem.innerHTML = livesHTML;
  }

  updateScoreUI() {
    const scoreElem = document.querySelector(".score-number");
    scoreElem.textContent = this.score;
  }

  updateQuestionUI() {
    getTask()
      .then(task => {
        answersElem.innerHTML = getAnswersHTML(task);
        guessWordElem.textContent = task.question;
        this.task = task;
      })
  }
}

const guessWordElem = document.querySelector(".guess-word");
const answersElem = document.querySelector(".answers");
let game = new Game();

document.querySelector('.play-now').addEventListener('click', function (e) {
  e.preventDefault();
  game.play()
})

document.querySelector('.play-again').addEventListener('click', function (e) {
  e.preventDefault();
  game = new Game();
  game.play()
})


answersElem.addEventListener("click", function (e) {
  let answerVal = e.target.textContent;
  if (game.task.isCorrect(answerVal)) {
    celebrate(answerVal);
    game.addScore(10);
    game.updateQuestionUI();
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
  console.log("removing health");
  game.removeLife();
}

function getAnswersHTML(task) {
  let resultHTML = "";
  let optionsCopy = task.options.slice();
  while (optionsCopy.length) {
    let word = optionsCopy.pop();
    resultHTML += `<li class="answer-item"><a class="answer-link" href="#">${word}</a></li>\n`;
  }
  return resultHTML;
}