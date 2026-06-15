import type { CardData } from '@mtg/game-core';
import { transform, type ScryfallCard } from './transform';

const BASE_URL = 'https://api.scryfall.com/cards/named?exact=';
const COLLECTION_URL = 'https://api.scryfall.com/cards/collection';

// todo сейчас бесполезен, но я оставил для потенциальных запросов сервером, возможно нужно будет снести
const DEFAULT_HEADERS: Record<string, string> = {
  Accept: 'application/json;q=0.9,*/*;q=0.8',
  'User-Agent': 'mtg-client/0.1',
};

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;
const REQUEST_DELAY_MS = 100;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** fetch + required headers + retry on transient failures with backoff (honors `Retry-After`). */
async function scryfallFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = { ...DEFAULT_HEADERS, ...init?.headers };

  for (let attempt = 0; ; attempt++) {
    const resp = await fetch(url, { ...init, headers });

    if (
      resp.ok ||
      !RETRYABLE_STATUSES.has(resp.status) ||
      attempt >= MAX_RETRIES
    ) {
      return resp;
    }

    const retryAfter = Number(resp.headers?.get?.('Retry-After'));
    const backoff =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : BASE_BACKOFF_MS * 2 ** attempt;

    await sleep(backoff);
  }
}

//todo later fetch by collector number
export async function fetchCardByName(name: string, set?: string) {
  let url = BASE_URL + encodeURIComponent(name);

  if (set) {
    url += '&set=' + encodeURIComponent(set);
  }

  const data = await scryfallFetch(url);

  if (!data.ok) {
    throw new Error(`Scryfall request failed (${data.status}) for "${name}"`);
  }

  return data.json();
}

/** api collection endpoint accepts at most 75 identifiers per request */
const COLLECTION_CHUNK_SIZE = 75;

type ScryfallIdentifier = { name: string } | { id: string };

interface CollectionResult {
  data: ScryfallCard[];
  not_found: { name: string }[];
}

async function fetchCollection(
  identifiers: ScryfallIdentifier[],
): Promise<CollectionResult> {
  const data: ScryfallCard[] = [];
  const notFound: { name: string }[] = [];

  for (let i = 0; i < identifiers.length; i += COLLECTION_CHUNK_SIZE) {
    // space out chunked requests so we stay well under Scryfall's rate limit
    if (i > 0) await sleep(REQUEST_DELAY_MS);

    const chunk = identifiers.slice(i, i + COLLECTION_CHUNK_SIZE);

    const resp = await scryfallFetch(COLLECTION_URL, {
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

async function fetchDecklist(names: string[]): Promise<{
  found: CardData[];
  tokens: CardData[];
  notFound: { name: string }[];
}> {
  const { data, not_found } = await fetchCollection(
    names.map((name) => ({ name })),
  );

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
