export function parsePage(page) {
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