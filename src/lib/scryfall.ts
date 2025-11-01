import type { PaginatedCardsResponse, ScryfallCard, ScryfallSet } from './types';

const BASE = 'https://api.scryfall.com';

export async function fetchSets(): Promise<ScryfallSet[]> {
  const res = await fetch(`${BASE}/sets`);
  if (!res.ok) throw new Error(`Failed to fetch sets: ${res.status}`);
  const json = await res.json();
  return (json?.data || []) as ScryfallSet[];
}

export function buildSearchUrl(query: string, page = 1, setCode?: string): string {
  const qs = new URLSearchParams();
  qs.set('q', setCode ? `${query} set:${setCode}` : query);
  qs.set('page', String(page));
  qs.set('unique', 'prints');
  return `${BASE}/cards/search?${qs.toString()}`;
}

export async function searchCards(query: string, page = 1, setCode?: string): Promise<PaginatedCardsResponse> {
  const url = buildSearchUrl(query, page, setCode);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return (await res.json()) as PaginatedCardsResponse;
}

export async function fetchCardById(id: string): Promise<ScryfallCard> {
  const res = await fetch(`${BASE}/cards/${id}`);
  if (!res.ok) throw new Error(`Card fetch failed: ${res.status}`);
  return (await res.json()) as ScryfallCard;
}

export function getBestImageUrl(card: ScryfallCard): string | undefined {
  if (card.image_uris?.normal) return card.image_uris.normal;
  if (card.card_faces && card.card_faces[0]?.image_uris?.normal) return card.card_faces[0].image_uris.normal;
  return undefined;
}

export function getUsdPrice(card: ScryfallCard): number {
  const p = card.prices?.usd ?? card.prices?.usd_foil ?? null;
  const n = p ? Number(p) : 0;
  return Number.isFinite(n) ? n : 0;
}

