"use strict";

class NoThesaurusEntry extends Error { };
class NoSynonymsFound extends Error { };
const parser = new DOMParser();

function parsePage(html) {
  const doc = parser.parseFromString(page, "text/html");
  if (hasNoEntry(doc)) throw new NoThesaurusEntry('No thesaurus page for given word');
  else return doc;
}

export function parseSynonyms(html) {
  let doc = parsePage(html);
  let synonyms = [];
  let divs = doc.querySelectorAll("div");
  for (let div of divs) {
    if (div.textContent === "Synonyms:") {
      let divSynonyms = div.nextElementSibling;
      synonyms.concat(Array.from(divSynonyms.querySelectorAll("span")).map(
        span => span.textContent
      ));
    }
  }

  if (synonyms.length === 0) throw new NoSynonymsFound('No synonyms found for given word');
  return synonyms;
}

function hasNoEntry(document) {
  return Boolean(document.querySelector("#noEntryFound"));
}