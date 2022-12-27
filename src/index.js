"use strict";

import { getRandomWord } from "./wordlist";
import { getSynonyms } from "./thesaurus";

let retries = 5;
let state = localStorage.getItem('state') || 'pre-game';

let pageContentElemList = document.querySelectorAll('div.page-content')

class Game {
  constructor() {
    this.state = 'pre-game'
    this.score = 0;
    this.lives = 3;
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

  refreshUI() {
    for (let page of pageContentElemList) {
      if (page.classList.contains(this.state)) {
        page.classList.remove('hidden');
      } else {
        page.classList.add('hidden');
      }
    }
    this.updateLivesUI();
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
}

let answer = {
  value: "",
  isCorrect(ans) {
    return this.value === ans;
  }
};

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
  if (answer.isCorrect(answerVal)) {
    celebrate(answerVal);
    improveScore();
    nextQuestion();
  } else {
    pointOutAnswer();
    removeLife();
  }
});

nextQuestion();

function celebrate(choice) {
  console.log(`${choice} is correct!`);
}

function improveScore() {
  const scoreElem = document.querySelector(".score-number");
  let newScore = Number(scoreElem.textContent) + 10;
  scoreElem.textContent = newScore;
}

function pointOutAnswer() {
  console.log("TODO pointOutAnswer");
}

function removeLife() {
  console.log("removing health");
  game.removeLife();
}

function nextQuestion() {
  getSynonyms(getRandomWord())
    .then(guessWord => {
      retries = 5;
      answer.value = guessWord.synonymsPrimary[0];

      let answersHTML = getAnswersHTML(guessWord);
      guessWordElem.textContent = guessWord.word;
      answersElem.innerHTML = answersHTML;
    })
    .catch(err => {
      console.error(`error ${err}`);
      if (retries-- > 0) nextQuestion();
    });
}

function getAnswersHTML(guessWord) {
  let options = [guessWord.synonymsPrimary[0]];
  while (options.length < 4) {
    let word = getRandomWord();
    if (!guessWord.synonymsAll.includes(word)) options.push(word);
  }
  options.sort(() => 0.5 - Math.random);

  let resultHTML = "";
  while (options.length) {
    let word = options.pop();
    resultHTML += `<li class="answer-item"><a class="answer-link" href="#">${word}</a></li>\n`;
  }

  return resultHTML;
}