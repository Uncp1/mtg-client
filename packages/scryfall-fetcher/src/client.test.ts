import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import fetchDecklist, { fetchCardByName } from './client';
import { llanowarElves, legionsLanding, vampireToken } from './cards.fixtures';

type FetchResult = Pick<Response, 'ok' | 'status' | 'json'>;

const jsonOk = (body: unknown): FetchResult => ({
  ok: true,
  status: 200,
  json: async () => body,
});
const jsonErr = (status: number): FetchResult => ({
  ok: false,
  status,
  json: async () => ({}),
});

const fetchMock =
  vi.fn<(url: string, init?: { body: string }) => Promise<FetchResult>>();

const identifiersOfCall = (n: number) =>
  JSON.parse(fetchMock.mock.calls[n][1]!.body).identifiers;

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('fetchCardByName', () => {
  it('hits the exact-named endpoint and returns the parsed json', async () => {
    fetchMock.mockResolvedValue(jsonOk({ name: 'Llanowar Elves' }));

    const res = await fetchCardByName('Llanowar Elves');

    expect(res).toEqual({ name: 'Llanowar Elves' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.scryfall.com/cards/named?exact=Llanowar%20Elves',
    );
  });

  it('appends the set as a query param when provided', async () => {
    fetchMock.mockResolvedValue(jsonOk({ name: 'Opt' }));

    await fetchCardByName('Opt', 'eld');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.scryfall.com/cards/named?exact=Opt&set=eld',
    );
  });

  it('throws with the status and card name when the response is not ok', async () => {
    fetchMock.mockResolvedValue(jsonErr(404));

    await expect(fetchCardByName('Made Up Card')).rejects.toThrow(
      'Scryfall request failed (404) for "Made Up Card"',
    );
  });
});

describe('fetchDecklist', () => {
  it('returns transformed cards and surfaces not_found, without a token request', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonOk({ data: [llanowarElves], not_found: [{ name: 'Fake Card' }] }),
    );

    const result = await fetchDecklist(['Llanowar Elves', 'Fake Card']);

    expect(result.found.map((c) => c.id)).toEqual([llanowarElves.id]);
    expect(result.notFound).toEqual([{ name: 'Fake Card' }]);
    expect(result.tokens).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('makes a second request for tokens referenced in all_parts', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonOk({ data: [legionsLanding], not_found: [] }))
      .mockResolvedValueOnce(jsonOk({ data: [vampireToken], not_found: [] }));

    const result = await fetchDecklist(["Legion's Landing"]);

    expect(result.found.map((c) => c.id)).toEqual([legionsLanding.id]);
    expect(result.tokens.map((c) => c.id)).toEqual([vampireToken.id]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(identifiersOfCall(1)).toEqual([{ id: vampireToken.id }]);
  });

  it('chunks identifiers into batches of at most 75', async () => {
    fetchMock.mockResolvedValue(jsonOk({ data: [], not_found: [] }));

    const names = Array.from({ length: 76 }, (_, i) => `Card ${i}`);
    await fetchDecklist(names);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(identifiersOfCall(0)).toHaveLength(75);
    expect(identifiersOfCall(1)).toHaveLength(1);
    expect(identifiersOfCall(0)[0]).toEqual({ name: 'Card 0' });
    expect(identifiersOfCall(1)[0]).toEqual({ name: 'Card 75' });
  });

  it('throws when the collection request fails', async () => {
    fetchMock.mockResolvedValue(jsonErr(500));

    await expect(fetchDecklist(['Whatever'])).rejects.toThrow(
      'Scryfall collection request failed (500)',
    );
  });
});
