<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { fetchSets, searchCards, getBestImageUrl } from '@lib/scryfall';
import { createDeck, getDeck, loadDecks, upsertDeck, renameDeck } from '@lib/deckStore';
import { useToast } from '@lib/toast';
import type { PaginatedCardsResponse, ScryfallCard, ScryfallSet } from '@lib/types';

const query = ref<string>('');
const sets = ref<ScryfallSet[]>([]);
const setCode = ref<string>('');
const page = ref<number>(1);
const loading = ref<boolean>(false);
const results = ref<PaginatedCardsResponse | null>(null);
const error = ref<string | null>(null);

// New filters
const typeLine = ref<string>('');
const manaFilter = ref<string>(''); // e.g., '', 'cmc<=1', 'cmc<=2', 'cmc>=6'
const colorIdentity = ref<string[]>([]); // values among ['W','U','B','R','G']

// Client-side pagination (20 per page)
const uiPage = ref<number>(1);
const pageSize = 20;
const pagedData = computed(() => {
  const data = results.value?.data ?? [];
  const start = (uiPage.value - 1) * pageSize;
  return data.slice(start, start + pageSize);
});
const uiTotalPages = computed(() => {
  const data = results.value?.data ?? [];
  return Math.max(1, Math.ceil(data.length / pageSize));
});

const decks = ref(loadDecks());
const currentDeckId = ref<string | null>(null);
const currentDeck = computed(() => (currentDeckId.value ? getDeck(currentDeckId.value) : undefined));
const toast = useToast();

onMounted(async () => {
  try {
    const s = await fetchSets();
    const filtered = s.filter((x) => ['expansion', 'core', 'commander', 'masters', 'draft_innovation'].includes(x.set_type));
    filtered.sort((a, b) => (b.released_at || '').localeCompare(a.released_at || ''));
    sets.value = filtered;
  } catch {}
});

function buildQuery(): string {
  const parts: string[] = [];
  if (query.value.trim()) parts.push(query.value.trim());
  if (typeLine.value) parts.push(`t:${typeLine.value.toLowerCase()}`);
  if (manaFilter.value) parts.push(manaFilter.value);
  if (colorIdentity.value.length > 0) parts.push(`id<=${colorIdentity.value.join('')}`);
  return parts.join(' ');
}

async function runSearch(nextPage?: number) {
  loading.value = true;
  error.value = null;
  try {
    const built = buildQuery();
    const data = await searchCards(built, nextPage ?? page.value, setCode.value || undefined);
    results.value = data;
    page.value = nextPage ?? page.value;
    uiPage.value = 1; // reset client-side page
  } catch (e: any) {
    error.value = e?.message || 'Failed to search';
  } finally {
    loading.value = false;
  }
}

function refreshDecks() {
  const latest = loadDecks();
  decks.value = latest;
  if (currentDeckId.value && !latest.find(d => d.id === currentDeckId.value)) currentDeckId.value = null;
}

function onCreateDeck() {
  const name = window.prompt('Name your deck');
  if (!name) return;
  const deck = createDeck({ name, commanderCardId: '', colorIdentity: [], commanderImage: undefined });
  upsertDeck(deck);
  refreshDecks();
  currentDeckId.value = deck.id;
}

function onRenameDeck() {
  if (!currentDeck.value) return;
  const name = window.prompt('Rename deck', currentDeck.value.name);
  if (!name) return;
  const updated = renameDeck(currentDeck.value.id, name);
  refreshDecks();
  if (updated) currentDeckId.value = updated.id;
}

function ensureDeckSelected(): string | null {
  if (currentDeckId.value) return currentDeckId.value;
  window.alert('Please create or select a deck first.');
  return null;
}

function addCardToDeck(card: ScryfallCard) {
  const id = ensureDeckSelected();
  if (!id) return;
  const deck = getDeck(id);
  if (!deck) return;
  const currentCount = deck.cards.reduce((sum, c) => sum + c.quantity, 0) + (deck.commanderCardId ? 1 : 0);
  if (currentCount >= 100) {
    toast.show('Deck Completed', 'success');
    return;
  }
  const existing = deck.cards.find(c => c.cardId === card.id);
  if (existing) existing.quantity += 1; else deck.cards.push({ cardId: card.id, quantity: 1 });
  upsertDeck(deck);
  refreshDecks();
  const newCount = deck.cards.reduce((sum, c) => sum + c.quantity, 0) + (deck.commanderCardId ? 1 : 0);
  if (newCount >= 100) {
    toast.show('Deck Completed', 'success');
  } else {
    toast.show('Card Added', 'success');
  }
}

function setCommander(card: ScryfallCard) {
  const id = ensureDeckSelected();
  if (!id) return;
  const deck = getDeck(id);
  if (!deck) return;
  if (deck.commanderCardId && deck.commanderCardId !== card.id) {
    alert('Commander Already Added');
    return;
  }
  const commanderImage = getBestImageUrl(card);
  const colorIdentity = card.color_identity || [];
  upsertDeck({ ...deck, commanderCardId: card.id, commanderImage, colorIdentity });
  refreshDecks();
  toast.show('Commander Added', 'success');
}
</script>

<template>
  <div class="panel">
    <div class="row" style="justify-content: space-between; align-items: center;">
      <div class="row">
        <label class="muted">Deck:</label>
        <select :value="currentDeckId ?? ''" @change="(e:any)=> currentDeckId = e.target.value || null">
          <option value="">— Select a deck —</option>
          <option v-for="d in decks" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
        <button @click="onCreateDeck">New deck</button>
        <button class="ghost" :disabled="!currentDeck" @click="onRenameDeck">Rename</button>
      </div>
      <a v-if="currentDeck" :href="`/decks/${currentDeck!.slug}`">Open deck →</a>
    </div>

    <div class="spacer"></div>

    <div class="row" style="align-items: flex-end;">
      <div style="flex: 1; min-width: 220px;">
        <label class="muted">Query</label>
        <input class="input" placeholder="Free text or Scryfall query" :value="query" @input="(e:any)=> query = e.target.value" />
      </div>
      <div>
        <label class="muted">Expansion</label>
        <select :value="setCode" @change="(e:any)=> setCode = e.target.value">
          <option value="">All sets</option>
          <option v-for="s in sets" :key="s.code" :value="s.code">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label class="muted">Type</label>
        <select :value="typeLine" @change="(e:any)=> typeLine = e.target.value">
          <option value="">Any</option>
          <option>Creature</option>
          <option>Instant</option>
          <option>Sorcery</option>
          <option>Artifact</option>
          <option>Enchantment</option>
          <option>Planeswalker</option>
          <option>Land</option>
        </select>
      </div>
      <div>
        <label class="muted">Mana cost</label>
        <select :value="manaFilter" @change="(e:any)=> manaFilter = e.target.value">
          <option value="">Any</option>
          <option value="cmc<=1">≤ 1</option>
          <option value="cmc<=2">≤ 2</option>
          <option value="cmc<=3">≤ 3</option>
          <option value="cmc<=4">≤ 4</option>
          <option value="cmc<=5">≤ 5</option>
          <option value="cmc>=6">≥ 6</option>
        </select>
      </div>
      <div>
        <label class="muted">Color identity</label>
        <div class="row">
          <label class="tag"><input type="checkbox" value="W" :checked="colorIdentity.includes('W')" @change="(e:any)=> { const v='W'; e.target.checked ? colorIdentity.push(v) : colorIdentity.splice(colorIdentity.indexOf(v),1) }" /> W</label>
          <label class="tag"><input type="checkbox" value="U" :checked="colorIdentity.includes('U')" @change="(e:any)=> { const v='U'; e.target.checked ? colorIdentity.push(v) : colorIdentity.splice(colorIdentity.indexOf(v),1) }" /> U</label>
          <label class="tag"><input type="checkbox" value="B" :checked="colorIdentity.includes('B')" @change="(e:any)=> { const v='B'; e.target.checked ? colorIdentity.push(v) : colorIdentity.splice(colorIdentity.indexOf(v),1) }" /> B</label>
          <label class="tag"><input type="checkbox" value="R" :checked="colorIdentity.includes('R')" @change="(e:any)=> { const v='R'; e.target.checked ? colorIdentity.push(v) : colorIdentity.splice(colorIdentity.indexOf(v),1) }" /> R</label>
          <label class="tag"><input type="checkbox" value="G" :checked="colorIdentity.includes('G')" @change="(e:any)=> { const v='G'; e.target.checked ? colorIdentity.push(v) : colorIdentity.splice(colorIdentity.indexOf(v),1) }" /> G</label>
        </div>
      </div>
      <button class="primary" :disabled="loading" @click="() => runSearch(1)">Search</button>
    </div>

    <div v-if="error" class="spacer"></div>
    <div v-if="error" class="tag" style="border-color:#7f1d1d;color:#fecaca">{{ error }}</div>

    <div class="spacer"></div>

    <div v-if="loading" class="muted">Loading…</div>
    <template v-if="results">
      <div class="muted">Results: {{ results.total_cards ?? results.data.length }}</div>
      <div class="spacer"></div>
      <div class="grid cards">
        <div class="card" v-for="card in pagedData" :key="card.id">
          <img class="card-img" :src="getBestImageUrl(card) || ''" :alt="card.name" loading="lazy" />
          <div class="name">{{ card.name }}</div>
          <div class="row">
            <button :disabled="!currentDeck" @click="() => addCardToDeck(card)">Add to deck</button>
            <button class="ghost" :disabled="!currentDeck" @click="() => setCommander(card)">Use as commander</button>
          </div>
        </div>
      </div>

      <div class="spacer"></div>
      <div class="row" style="align-items:center;">
        <button :disabled="uiPage<=1" @click="() => uiPage = Math.max(1, uiPage-1)">← Prev</button>
        <span class="tag">Page {{ uiPage }} / {{ uiTotalPages }}</span>
        <button :disabled="uiPage>=uiTotalPages" @click="() => uiPage = Math.min(uiTotalPages, uiPage+1)">Next →</button>
        <div class="right row">
          <button :disabled="!results.has_more" @click="() => results!.has_more && runSearch(page + 1)">Load more results</button>
          <span class="muted">(fetch next from Scryfall)</span>
        </div>
      </div>
    </template>
  </div>
  
</template>


