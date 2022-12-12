"use strict";

let retries = 5;
const guessWordElem = document.querySelector(".guess-word");
const synonymsElem = document.querySelector(".synonyms");

main();

function main() {
  getGuessWord()
    .then(guessWord => {
      retries = 5;

      let synonymsHTML = getSynonymsHTML(guessWord);
      guessWordElem.textContent = guessWord.word;
      synonymsElem.innerHTML = synonymsHTML;
    })
    .catch(err => {
      console.error(`error ${err}`);
      if (retries-- > 0) main();
    });
}

function getSynonymsHTML(guessWord) {
  let options = [guessWord.synonymsPrimary[0]];
  while (options.length < 4) {
    let word = wordlist.get();
    if (!guessWord.synonymsAll.includes(word)) options.push(word);
  }
  options.sort(() => 0.5 - Math.random);

  let resultHTML = "";
  while (options.length) {
    let word = options.pop();
    resultHTML += `<li class="synonym-item"><a class="synonym-link" href="#">${word}</a></li>\n`;
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
