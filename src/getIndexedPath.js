const { fetcher } = require('../fetcher.js');

const fetchWithRetry = async (resource) => {
    const result = await fetcher(resource);

    if (result.status === 500) {
        return fetcher(resource);
    }

    return result;
};

const indexedPath = new Set();
const pathnamesToBeIndexed = new Set();

const getAllUniqPathnames = (html) => {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
    const uniqPathnames = [...new Set([...html.matchAll(linkRegex)].map((match) => match[2]))];
    return uniqPathnames
}

const getIndexedPath = async (domainName) => {
  pathnamesToBeIndexed.add(domainName)

  const updateIndexedPath = async(path) => {
    const absoluteURL = new URL(path, domainName);
    const result = await fetchWithRetry(absoluteURL.href);

    if (result.status === 200) {
      const html = await result.text();
      const uniqPathnames = getAllUniqPathnames(html);
      uniqPathnames.forEach((item) => pathnamesToBeIndexed.add(item));
      indexedPath.add(absoluteURL.href);
    }
  } 

  for (const path of pathnamesToBeIndexed) {
   await updateIndexedPath(path)
  }

    return [...indexedPath]
}

module.exports = {getIndexedPath}
