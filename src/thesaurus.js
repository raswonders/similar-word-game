import { parsePage } from "./parser"; 

export function getSynonyms(word) {
    const url = "https://www.wordreference.com/synonyms/" + word;

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.text())
            .then(function (res) {
                let wordObj = parsePage(res);
                if (wordObj) resolve(wordObj);
                else reject("word has no synonyms");
            })
            .catch(err => {
                console.log(`error ${err}`);
            });
    });
}