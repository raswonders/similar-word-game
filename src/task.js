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
    this.options.sort(() => 0.5 - Math.random);
  }
} 

let currentTask;

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
        return getTask();
      } else throw err;
    })
}