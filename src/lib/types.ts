export type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G';

export interface ScryfallCardFace {
  name: string;
  type_line?: string;
  oracle_text?: string;
  image_uris?: Record<string, string>;
  mana_cost?: string;
}

export interface ScryfallCard {
  id: string;
  name: string;
  set: string;
  set_name: string;
  collector_number: string;
  type_line?: string;
  oracle_text?: string;
  mana_cost?: string;
  cmc?: number;
  image_uris?: Record<string, string>;
  card_faces?: ScryfallCardFace[];
  colors?: ManaColor[];
  color_identity?: ManaColor[];
  prices?: { usd?: string | null; usd_foil?: string | null; tix?: string | null };
}

export interface DeckCardEntry {
  cardId: string;
  quantity: number;
}

export interface SavedDeck {
  id: string;
  name: string;
  slug: string;
  commanderCardId: string;
  commanderImage?: string;
  colorIdentity: ManaColor[];
  cards: DeckCardEntry[];
  lastUpdatedIso: string;
}

export interface PaginatedCardsResponse {
  object: 'list';
  data: ScryfallCard[];
  has_more: boolean;
  next_page?: string;
  total_cards?: number;
}

export interface ScryfallSet {
  code: string;
  name: string;
  released_at?: string;
  set_type: string;
}

