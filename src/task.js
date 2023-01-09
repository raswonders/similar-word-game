"use strict";

import { getRandomWord, getRandomWords } from "./wordlist";
import { fetchSynonymsPage } from './thesaurus';
import { parseSynonyms, NoSynonymsFound, NoThesaurusEntry } from './parser';

class Task {
  constructor(question, answer) {
    this.question = question; 
    this.answer = answer;
    this.options = [answer];
    this.options = this.options.concat(getRandomWords(3));
    this.options.sort(() => 0.5 - Math.random());
  }

  isCorrect(chosen) {
    if (chosen === this.answer) return true;
    return false;
  }
} 

export let currentTask;
const RETRY_DELAY = 2000;

export function getTask() {
  let word = getRandomWord();
  return fetchSynonymsPage(word)
    .then(page => parseSynonyms(page))
    .then(synonyms => {
      currentTask = new Task(word, synonyms[0]);
      return currentTask;
    })
    .catch(err => {
      if (err instanceof NoSynonymsFound || err instanceof NoThesaurusEntry) {
        console.error(err.name, err.message)
        return getTaskWithDelay(RETRY_DELAY);
      } else throw err;
    })
}

function getTaskWithDelay(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getTask()), delay)
  })
}