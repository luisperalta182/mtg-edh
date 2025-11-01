import { c as createComponent, d as renderHead, e as renderComponent, r as renderTemplate } from '../chunks/astro/server_DqeAK1Mz.mjs';
import 'kleur/colors';
import 'html-escaper';
import { defineComponent, useSSRContext, ref, computed, onMounted, mergeProps } from 'vue';
import { b as fetchSets, a as getBestImageUrl, s as searchCards } from '../chunks/scryfall_CfG7KIJ9.mjs';
import { l as loadDecks, g as getDeck, b as useToast, u as upsertDeck, r as renameDeck, c as createDeck, _ as _export_sfc, T as ToastHost } from '../chunks/ToastHost_CAIsePl3.mjs';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
export { renderers } from '../renderers.mjs';

const pageSize = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CardSearch",
  setup(__props, { expose: __expose }) {
    __expose();
    const query = ref("");
    const sets = ref([]);
    const setCode = ref("");
    const page = ref(1);
    const loading = ref(false);
    const results = ref(null);
    const error = ref(null);
    const typeLine = ref("");
    const manaFilter = ref("");
    const colorIdentity = ref([]);
    const uiPage = ref(1);
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
    const currentDeckId = ref(null);
    const currentDeck = computed(() => currentDeckId.value ? getDeck(currentDeckId.value) : void 0);
    const toast = useToast();
    onMounted(async () => {
      try {
        const s = await fetchSets();
        const filtered = s.filter((x) => ["expansion", "core", "commander", "masters", "draft_innovation"].includes(x.set_type));
        filtered.sort((a, b) => (b.released_at || "").localeCompare(a.released_at || ""));
        sets.value = filtered;
      } catch {
      }
    });
    function buildQuery() {
      const parts = [];
      if (query.value.trim()) parts.push(query.value.trim());
      if (typeLine.value) parts.push(`t:${typeLine.value.toLowerCase()}`);
      if (manaFilter.value) parts.push(manaFilter.value);
      if (colorIdentity.value.length > 0) parts.push(`id<=${colorIdentity.value.join("")}`);
      return parts.join(" ");
    }
    async function runSearch(nextPage) {
      loading.value = true;
      error.value = null;
      try {
        const built = buildQuery();
        const data = await searchCards(built, nextPage ?? page.value, setCode.value || void 0);
        results.value = data;
        page.value = nextPage ?? page.value;
        uiPage.value = 1;
      } catch (e) {
        error.value = e?.message || "Failed to search";
      } finally {
        loading.value = false;
      }
    }
    function refreshDecks() {
      const latest = loadDecks();
      decks.value = latest;
      if (currentDeckId.value && !latest.find((d) => d.id === currentDeckId.value)) currentDeckId.value = null;
    }
    function onCreateDeck() {
      const name = window.prompt("Name your deck");
      if (!name) return;
      const deck = createDeck({ name, commanderCardId: "", colorIdentity: [], commanderImage: void 0 });
      upsertDeck(deck);
      refreshDecks();
      currentDeckId.value = deck.id;
    }
    function onRenameDeck() {
      if (!currentDeck.value) return;
      const name = window.prompt("Rename deck", currentDeck.value.name);
      if (!name) return;
      const updated = renameDeck(currentDeck.value.id, name);
      refreshDecks();
      if (updated) currentDeckId.value = updated.id;
    }
    function ensureDeckSelected() {
      if (currentDeckId.value) return currentDeckId.value;
      window.alert("Please create or select a deck first.");
      return null;
    }
    function addCardToDeck(card) {
      const id = ensureDeckSelected();
      if (!id) return;
      const deck = getDeck(id);
      if (!deck) return;
      const currentCount = deck.cards.reduce((sum, c) => sum + c.quantity, 0) + (deck.commanderCardId ? 1 : 0);
      if (currentCount >= 100) {
        toast.show("Deck Completed", "success");
        return;
      }
      const existing = deck.cards.find((c) => c.cardId === card.id);
      if (existing) existing.quantity += 1;
      else deck.cards.push({ cardId: card.id, quantity: 1 });
      upsertDeck(deck);
      refreshDecks();
      const newCount = deck.cards.reduce((sum, c) => sum + c.quantity, 0) + (deck.commanderCardId ? 1 : 0);
      if (newCount >= 100) {
        toast.show("Deck Completed", "success");
      } else {
        toast.show("Card Added", "success");
      }
    }
    function setCommander(card) {
      const id = ensureDeckSelected();
      if (!id) return;
      const deck = getDeck(id);
      if (!deck) return;
      if (deck.commanderCardId && deck.commanderCardId !== card.id) {
        alert("Commander Already Added");
        return;
      }
      const commanderImage = getBestImageUrl(card);
      const colorIdentity2 = card.color_identity || [];
      upsertDeck({ ...deck, commanderCardId: card.id, commanderImage, colorIdentity: colorIdentity2 });
      refreshDecks();
      toast.show("Commander Added", "success");
    }
    const __returned__ = { query, sets, setCode, page, loading, results, error, typeLine, manaFilter, colorIdentity, uiPage, pageSize, pagedData, uiTotalPages, decks, currentDeckId, currentDeck, toast, buildQuery, runSearch, refreshDecks, onCreateDeck, onRenameDeck, ensureDeckSelected, addCardToDeck, setCommander, get getBestImageUrl() {
      return getBestImageUrl;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "panel" }, _attrs))}><div class="row" style="${ssrRenderStyle({ "justify-content": "space-between", "align-items": "center" })}"><div class="row"><label class="muted">Deck:</label><select${ssrRenderAttr("value", $setup.currentDeckId ?? "")}><option value="">— Select a deck —</option><!--[-->`);
  ssrRenderList($setup.decks, (d) => {
    _push(`<option${ssrRenderAttr("value", d.id)}>${ssrInterpolate(d.name)}</option>`);
  });
  _push(`<!--]--></select><button>New deck</button><button class="ghost"${ssrIncludeBooleanAttr(!$setup.currentDeck) ? " disabled" : ""}>Rename</button></div>`);
  if ($setup.currentDeck) {
    _push(`<a${ssrRenderAttr("href", `/decks/${$setup.currentDeck.slug}`)}>Open deck →</a>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="spacer"></div><div class="row" style="${ssrRenderStyle({ "align-items": "flex-end" })}"><div style="${ssrRenderStyle({ "flex": "1", "min-width": "220px" })}"><label class="muted">Query</label><input class="input" placeholder="Free text or Scryfall query"${ssrRenderAttr("value", $setup.query)}></div><div><label class="muted">Expansion</label><select${ssrRenderAttr("value", $setup.setCode)}><option value="">All sets</option><!--[-->`);
  ssrRenderList($setup.sets, (s) => {
    _push(`<option${ssrRenderAttr("value", s.code)}>${ssrInterpolate(s.name)}</option>`);
  });
  _push(`<!--]--></select></div><div><label class="muted">Type</label><select${ssrRenderAttr("value", $setup.typeLine)}><option value="">Any</option><option>Creature</option><option>Instant</option><option>Sorcery</option><option>Artifact</option><option>Enchantment</option><option>Planeswalker</option><option>Land</option></select></div><div><label class="muted">Mana cost</label><select${ssrRenderAttr("value", $setup.manaFilter)}><option value="">Any</option><option value="cmc&lt;=1">≤ 1</option><option value="cmc&lt;=2">≤ 2</option><option value="cmc&lt;=3">≤ 3</option><option value="cmc&lt;=4">≤ 4</option><option value="cmc&lt;=5">≤ 5</option><option value="cmc&gt;=6">≥ 6</option></select></div><div><label class="muted">Color identity</label><div class="row"><label class="tag"><input type="checkbox" value="W"${ssrIncludeBooleanAttr($setup.colorIdentity.includes("W")) ? " checked" : ""}> W</label><label class="tag"><input type="checkbox" value="U"${ssrIncludeBooleanAttr($setup.colorIdentity.includes("U")) ? " checked" : ""}> U</label><label class="tag"><input type="checkbox" value="B"${ssrIncludeBooleanAttr($setup.colorIdentity.includes("B")) ? " checked" : ""}> B</label><label class="tag"><input type="checkbox" value="R"${ssrIncludeBooleanAttr($setup.colorIdentity.includes("R")) ? " checked" : ""}> R</label><label class="tag"><input type="checkbox" value="G"${ssrIncludeBooleanAttr($setup.colorIdentity.includes("G")) ? " checked" : ""}> G</label></div></div><button class="primary"${ssrIncludeBooleanAttr($setup.loading) ? " disabled" : ""}>Search</button></div>`);
  if ($setup.error) {
    _push(`<div class="spacer"></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($setup.error) {
    _push(`<div class="tag" style="${ssrRenderStyle({ "border-color": "#7f1d1d", "color": "#fecaca" })}">${ssrInterpolate($setup.error)}</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="spacer"></div>`);
  if ($setup.loading) {
    _push(`<div class="muted">Loading…</div>`);
  } else {
    _push(`<!---->`);
  }
  if ($setup.results) {
    _push(`<!--[--><div class="muted">Results: ${ssrInterpolate($setup.results.total_cards ?? $setup.results.data.length)}</div><div class="spacer"></div><div class="grid cards"><!--[-->`);
    ssrRenderList($setup.pagedData, (card) => {
      _push(`<div class="card"><img class="card-img"${ssrRenderAttr("src", $setup.getBestImageUrl(card) || "")}${ssrRenderAttr("alt", card.name)} loading="lazy"><div class="name">${ssrInterpolate(card.name)}</div><div class="row"><button${ssrIncludeBooleanAttr(!$setup.currentDeck) ? " disabled" : ""}>Add to deck</button><button class="ghost"${ssrIncludeBooleanAttr(!$setup.currentDeck) ? " disabled" : ""}>Use as commander</button></div></div>`);
    });
    _push(`<!--]--></div><div class="spacer"></div><div class="row" style="${ssrRenderStyle({ "align-items": "center" })}"><button${ssrIncludeBooleanAttr($setup.uiPage <= 1) ? " disabled" : ""}>← Prev</button><span class="tag">Page ${ssrInterpolate($setup.uiPage)} / ${ssrInterpolate($setup.uiTotalPages)}</span><button${ssrIncludeBooleanAttr($setup.uiPage >= $setup.uiTotalPages) ? " disabled" : ""}>Next →</button><div class="right row"><button${ssrIncludeBooleanAttr(!$setup.results.has_more) ? " disabled" : ""}>Load more results</button><span class="muted">(fetch next from Scryfall)</span></div></div><!--]-->`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CardSearch.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CardSearch = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Commander Builder</title><link rel="stylesheet" href="/styles.css">${renderHead()}</head> <body> <nav class="nav"> <a class="brand" href="/">Commander Builder</a> <a href="/decks">Saved Decks</a> </nav> <main class="container"> <h2>Card Finder</h2> <p class="muted">Search Scryfall with optional expansion filter. Select a deck to add cards.</p> ${renderComponent($$result, "CardSearch", CardSearch, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/CardSearch.vue", "client:component-export": "default" })} ${renderComponent($$result, "ToastHost", ToastHost, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/ToastHost.vue", "client:component-export": "default" })} <div class="footer">Card data & images © Scryfall & respective publishers.</div> </main> </body></html>`;
}, "/Users/Luis/Documents/mtg-pdp/src/pages/index.astro", void 0);

const $$file = "/Users/Luis/Documents/mtg-pdp/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
