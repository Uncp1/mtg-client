import type { CardData } from '@mtg/game-core';
import { transform, type ScryfallCard } from './transform';

const BASE_URL = 'https://api.scryfall.com/cards/named?exact=';
const COLLECTION_URL = 'https://api.scryfall.com/cards/collection';

//todo later fetch by collector number
export async function fetchCardByName(name: string, set?: string) {
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

/** api collection endpoint accepts at most 75 identifiers per request */
const COLLECTION_CHUNK_SIZE = 75;

type ScryfallIdentifier = { name: string } | { id: string };

interface CollectionResult {
  data: ScryfallCard[];
  not_found: { name: string }[];
}

async function fetchCollection(identifiers: ScryfallIdentifier[]): Promise<CollectionResult> {
  const data: ScryfallCard[] = [];
  const notFound: { name: string }[] = [];

  for (let i = 0; i < identifiers.length; i += COLLECTION_CHUNK_SIZE) {
    const chunk = identifiers.slice(i, i + COLLECTION_CHUNK_SIZE);

    const resp = await fetch(COLLECTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifiers: chunk }),
    });

    if (!resp.ok) {
      throw new Error(`Scryfall collection request failed (${resp.status})`);
    }

    const res = (await resp.json()) as CollectionResult;

    data.push(...res.data);
    notFound.push(...res.not_found);
  }

  return { data, not_found: notFound };
}

async function fetchDecklist(
  names: string[],
): Promise<{ found: CardData[]; tokens: CardData[]; notFound: { name: string }[] }> {
  const { data, not_found } = await fetchCollection(names.map((name) => ({ name })));

  // todo позже добавить meld, пока не очень актуально
  const tokenIds = new Set<string>();
  for (const card of data) {
    for (const part of card.all_parts ?? []) {
      if (part.component === 'token') tokenIds.add(part.id);
    }
  }

  const tokens = tokenIds.size
    ? (await fetchCollection([...tokenIds].map((id) => ({ id })))).data
    : [];

  return {
    found: data.map(transform),
    tokens: tokens.map(transform),
    notFound: not_found,
  };
}

export default fetchDecklist;

const dfcRes = await fetchCardByName('Wedding Announcement');
const res = await fetchCardByName('Bear Cub');
const resVers = await fetchCardByName('forest', 'XLN');

console.log('dfc', dfcRes);
console.log('res', res);
console.log('resVers', resVers);
