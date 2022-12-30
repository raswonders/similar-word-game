let retriesLeft = 5;

export function fetchSynonymsPage(word) {
  const thesaurusUrl = "https://www.wordreference.com/synonyms/" + word;

  return fetch(thesaurusUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      } else {
        retriesLeft = 5;
        return response.text();
      }
    })
    .catch(error => {
      console.error(error);
      console.debug(`${retriesLeft} retries left`)
      if (retriesLeft-- > 0) {
        console.debug(`trying again...`)
        return fetchSynonymsPage(page);
      } else {
        throw new Error('Unable to get word data from the Thesaurus server');
      }
    })
}