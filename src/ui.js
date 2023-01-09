import { getTask } from "./task";

const pageContentElements = document.querySelectorAll("div.page-content");
if (pageContentElements.length === 0)
  throw new Error("No content page elements found");
const healthElement = document.querySelector(".health-bar");
if (!healthElement) throw new Error("Health-bar element not found");
const scoreElement = document.querySelector(".score-number");
if (!scoreElement) throw new Error("Score element not found");
export const answersElement = document.querySelector(".answers");
if (!answersElement) throw new Error("Answers element not found");
const guessWordElement = document.querySelector(".guess-word");
if (!guessWordElement) throw new Error("Answers element not found");
const questionElement = document.querySelector('.word-section');
if (!questionElement) throw new Error("Question element not found");
const loaderElement = document.querySelector('.loader-wrap');
if (!loaderElement) throw new Error("Loader element not found");


export function updatePageContent(state) {
  for (let page of pageContentElements) {
    if (page.classList.contains(state)) {
      page.classList.remove("hidden");
    } else {
      page.classList.add("hidden");
    }
  }
}

export function updatePostGameUI(score) {
  document.querySelector(".score-total").textContent = score;
}

export function updateInGameUI(lives, score) {
  updateLivesUI(lives);
  updateScoreUI(score);
  updateQuestionUI();
}

export function updateLivesUI(lives) {
  let HtmlString = "";
  for (let i = 0; i < lives; i++) {
    HtmlString += `<li><i class="health-bar-item fa-solid fa-heart"></i></li>\n`;
  }
  for (let i = 0; i < 3 - lives; i++) {
    HtmlString += `<li><i class="health-bar-item fa-solid fa-heart-crack"></i></li>\n`;
  }
  healthElement.innerHTML = HtmlString;
}

export function updateScoreUI(score) {
  scoreElement.textContent = score;
}

export function updateQuestionUI() {
  showLoader();
  return getTask().then(task => {
    answersElement.innerHTML = getAnswersHTML(task);
    guessWordElement.textContent = task.question;
    showQuestion();
  });
}

function showLoader() {
  questionElement.classList.add('hidden');
  loaderElement.classList.remove('hidden');
}

function showQuestion() {
  loaderElement.classList.add('hidden');
  questionElement.classList.remove('hidden');
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