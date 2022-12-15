"use strict";

let retries = 5;

let answer = {
  value: "",
  isCorrect(ans) {
    return this.value === ans; 
  },
}

const guessWordElem = document.querySelector(".guess-word");
const answersElem = document.querySelector(".answers");

answersElem.addEventListener('click', function(e) {
  let answerVal = e.target.textContent;
  if (answer.isCorrect(answerVal)) {
    celebrate(answerVal);
    improveScore();
    nextQuestion();
  } else {
    pointOutAnswer();
    removeHealth();
  }
});

nextQuestion();

function isCorrect(ans) {
  return true
}

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

function removeHealth() {
  console.log("TODO removeHealth")
}

function nextQuestion() {
  getGuessWord()
    .then(guessWord => {
      retries = 5;
      answer.value = guessWord.synonymsPrimary[0];

      let answersHTML = getAnswersHTML(guessWord);
      guessWordElem.textContent = guessWord.word;
      answersElem.innerHTML = answersHTML;
    })
    .catch(err => {
      console.error(`error ${err}`);
      if (retries-- > 0) main();
    });
}

function getAnswersHTML(guessWord) {
  let options = [guessWord.synonymsPrimary[0]];
  while (options.length < 4) {
    let word = wordlist.get();
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

function getGuessWord() {
  const randomWord = wordlist.get();
  return getSynonyms(randomWord);
}

function getSynonyms(word) {
  const url = "https://www.wordreference.com/synonyms/" + word;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.text())
      .then(function(res) {
        let wordObj = parsePage(res);
        if (wordObj) resolve(wordObj);
        else reject("word has no synonyms");
      })
      .catch(err => {
        console.log(`error ${err}`);
      });
  });
}

function parsePage(page) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(page, "text/html");

  if (hasNoEntry(doc)) return null;

  let word = doc.querySelector(".headerWord").textContent;
  let synonymsAll = [];
  let synonymsPrimary = [];
  let isPrimary = true;

  let divs = doc.querySelectorAll("div");
  for (let div of divs) {
    if (div.textContent === "Synonyms:") {
      let sibling = div.nextElementSibling;
      let synonyms = Array.from(sibling.querySelectorAll("span")).map(
        item => item.textContent
      );

      if (isPrimary) {
        synonymsPrimary = synonyms;
        isPrimary = false;
      }

      synonymsAll = synonymsAll.concat(synonyms);
    }
  }

  if (synonymsAll.length === 0) return null;

  return { word, synonymsPrimary, synonymsAll };
}

function hasNoEntry(document) {
  return Boolean(document.querySelector("#noEntryFound"));
}
