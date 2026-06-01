const BASE_URL = 'https://api.scryfall.com/cards/named?exact=';

//todo later fetch by collector number
async function fetchCardByName(name: string, set?: string) {
  let url = BASE_URL + encodeURIComponent(name);

  if (set) {
    url += '&set=' + encodeURIComponent(set);
  }

  const data = await fetch(url);

  if (!data.ok) {
    throw new Error(`Scryfall request failed (${data.status}) for "${name}"`);
  }

  const res = await data.json();

  return res;
}

async function fetchDecklist() {}

const dfcRes = await fetchCardByName('Wedding Announcement');
const res = await fetchCardByName('voice of victory');
const resVers = await fetchCardByName('forest', 'XLN');

console.log('dfc', dfcRes);
console.log('res', res);
console.log('resVers', resVers);
