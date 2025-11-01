<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { loadDecks, deleteDeck } from '@lib/deckStore';
import type { SavedDeck } from '@lib/types';

const decks = ref<SavedDeck[]>([]);

function refresh() { decks.value = loadDecks(); }

onMounted(() => refresh());

function onDelete(id: string) {
  if (!window.confirm('Delete this deck?')) return;
  deleteDeck(id);
  refresh();
}
</script>

<template>
  <div class="grid cards">
    <template v-for="d in decks" :key="d.id">
      <div class="card">
        <a :href="`/decks/${d.slug}`">
          <img class="card-img" :src="d.commanderImage || ''" :alt="d.name" loading="lazy" />
        </a>
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="name">{{ d.name }}</div>
            <div class="mana">
              <span v-for="c in d.colorIdentity" class="p" :class="c">{{ c }}</span>
            </div>
          </div>
          <button class="ghost" @click="() => onDelete(d.id)">Delete</button>
        </div>
      </div>
    </template>
    <div v-if="decks.length === 0" class="muted">No decks saved yet.</div>
  </div>
</template>


