let retriesLeft = 5;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function fetchSynonymsPage(word) {
  const REMOTE_PROXY = "https://www.wordreference.com/synonyms/" + word;
  const LOCAL_PROXY = "http://localhost:8010/proxy/synonyms/" + word;
  let url = LOCAL_PROXY;

  if (IS_PRODUCTION) url = REMOTE_PROXY;

  return fetch(url)
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
        return fetchSynonymsPage(word);
      } else {
        throw new Error('Unable to get word data from the Thesaurus server');
      }
    })
}