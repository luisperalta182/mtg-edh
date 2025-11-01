<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { getDeck, upsertDeck } from '@lib/deckStore';
import { fetchCardById, getBestImageUrl, getUsdPrice } from '@lib/scryfall';
import type { SavedDeck, ScryfallCard } from '@lib/types';

const props = defineProps<{ deckId?: string; deckSlug?: string }>();

import { getDeckBySlug } from '@lib/deckStore';
const deck = ref<SavedDeck | undefined>(props.deckId ? getDeck(props.deckId) : (props.deckSlug ? getDeckBySlug(props.deckSlug) : undefined));
const cards = ref<Record<string, ScryfallCard>>({});
const loading = ref<boolean>(false);

function loadDeck() {
  if (props.deckId) deck.value = getDeck(props.deckId);
  else if (props.deckSlug) deck.value = getDeckBySlug(props.deckSlug);
}

async function loadCards() {
  const ids = deck.value?.cards.map(c => c.cardId) ?? [];
  if (ids.length === 0) { cards.value = {}; return; }
  loading.value = true;
  try {
    const entries = await Promise.all(ids.map(async id => [id, await fetchCardById(id)] as const));
    const obj: Record<string, ScryfallCard> = {};
    for (const [id, card] of entries) obj[id] = card;
    cards.value = obj;
  } finally {
    loading.value = false;
  }
}

onMounted(() => { loadDeck(); loadCards(); });
watch(() => [props.deckId, props.deckSlug, deck.value?.cards.length], () => { loadDeck(); loadCards(); });

const totalPrice = computed(() => {
  if (!deck.value) return 0;
  return deck.value.cards.reduce((sum, c) => {
    const card = cards.value[c.cardId];
    const price = card ? getUsdPrice(card) : 0;
    return sum + price * c.quantity;
  }, 0);
});

function changeQuantity(cardId: string, delta: number) {
  if (!deck.value) return;
  const updated: SavedDeck = { ...deck.value, cards: deck.value.cards.map(c => c.cardId === cardId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c).filter(c => c.quantity > 0) };
  upsertDeck(updated);
  deck.value = updated;
}
</script>

<template>
  <div class="panel">
    <div v-if="!deck" class="muted">Deck not found.</div>
    <template v-else>
      <div class="row" style="align-items: center;">
        <img :src="deck!.commanderImage || ''" :alt="deck!.name" style="width: 180px; border-radius: 12px; border: 1px solid #232832;" />
        <div>
          <div class="name" style="font-size: 20px;">{{ deck!.name }}</div>
          <div class="mana" style="margin-top: 6px;">
            <span v-for="c in deck!.colorIdentity" class="p" :class="c">{{ c }}</span>
          </div>
          <div class="spacer"></div>
          <div class="tag">Cards: {{ deck!.cards.reduce((a, c) => a + c.quantity, 0) }}</div>
          <div class="tag">Total price (USD): ${{ totalPrice.toFixed(2) }}</div>
        </div>
      </div>

      <div class="spacer"></div>
      <div class="list">
        <div v-if="loading" class="muted">Loading card details…</div>
        <div v-else-if="deck!.cards.length === 0" class="muted">No cards added yet.</div>
        <template v-else>
          <div class="row panel" v-for="entry in deck!.cards" :key="entry.cardId">
            <div class="row" style="gap: 12px; align-items: center;">
              <img :src="(cards[entry.cardId] && getBestImageUrl(cards[entry.cardId])) || ''" :alt="cards[entry.cardId]?.name || ''" style="width: 70px; border-radius: 6px; border: 1px solid #232832;" />
              <div>
                <div class="name">{{ cards[entry.cardId]?.name || 'Loading…' }}</div>
                <div class="muted">${{ (cards[entry.cardId] ? getUsdPrice(cards[entry.cardId]) : 0).toFixed(2) }} each</div>
              </div>
            </div>
            <div class="row right">
              <button @click="() => changeQuantity(entry.cardId, -1)">-</button>
              <span class="tag">{{ entry.quantity }}</span>
              <button @click="() => changeQuantity(entry.cardId, +1)">+</button>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>


