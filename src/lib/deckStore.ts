import type { ManaColor, SavedDeck } from './types';

const STORAGE_KEY = 'mtg_commander_decks_v1';

function getNowIso(): string {
  return new Date().toISOString();
}

export function loadDecks(): SavedDeck[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedDeck[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveDecks(decks: SavedDeck[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function ensureUniqueSlug(base: string, existing: SavedDeck[]): string {
  let slug = base || 'deck';
  let i = 1;
  const taken = new Set(existing.map(d => d.slug));
  while (taken.has(slug)) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

export function createDeck(params: { name: string; commanderCardId: string; commanderImage?: string; colorIdentity: ManaColor[]; }): SavedDeck {
  const existing = loadDecks();
  const base = slugifyName(params.name);
  const slug = ensureUniqueSlug(base, existing);
  return {
    id: crypto.randomUUID(),
    name: params.name,
    slug,
    commanderCardId: params.commanderCardId,
    commanderImage: params.commanderImage,
    colorIdentity: params.colorIdentity,
    cards: [],
    lastUpdatedIso: getNowIso(),
  };
}

export function upsertDeck(deck: SavedDeck): void {
  const decks = loadDecks();
  const idx = decks.findIndex(d => d.id === deck.id);
  if (idx >= 0) decks[idx] = { ...deck, lastUpdatedIso: getNowIso() };
  else decks.unshift({ ...deck, lastUpdatedIso: getNowIso() });
  saveDecks(decks);
}

export function deleteDeck(deckId: string): void {
  const decks = loadDecks().filter(d => d.id !== deckId);
  saveDecks(decks);
}

export function getDeck(deckId: string): SavedDeck | undefined {
  return loadDecks().find(d => d.id === deckId);
}

export function getDeckBySlug(slug: string): SavedDeck | undefined {
  return loadDecks().find(d => d.slug === slug);
}

export function renameDeck(deckId: string, newName: string): SavedDeck | undefined {
  const decks = loadDecks();
  const idx = decks.findIndex(d => d.id === deckId);
  if (idx < 0) return undefined;
  const base = slugifyName(newName);
  const slug = ensureUniqueSlug(base, decks.filter((_, i) => i !== idx));
  const updated: SavedDeck = { ...decks[idx], name: newName, slug, lastUpdatedIso: getNowIso() };
  decks[idx] = updated;
  saveDecks(decks);
  return updated;
}

