import { c as createComponent, a as createAstro, d as renderHead, e as renderComponent, r as renderTemplate } from '../../chunks/astro/server_DqeAK1Mz.mjs';
import 'kleur/colors';
import 'html-escaper';
import { defineComponent, useSSRContext, ref, onMounted, watch, computed, mergeProps } from 'vue';
import { g as getDeck, a as getDeckBySlug, u as upsertDeck, _ as _export_sfc, T as ToastHost } from '../../chunks/ToastHost_CAIsePl3.mjs';
import { g as getUsdPrice, f as fetchCardById, a as getBestImageUrl } from '../../chunks/scryfall_CfG7KIJ9.mjs';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
export { renderers } from '../../renderers.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DeckInspector",
  props: {
    deckId: {},
    deckSlug: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const deck = ref(props.deckId ? getDeck(props.deckId) : props.deckSlug ? getDeckBySlug(props.deckSlug) : void 0);
    const cards = ref({});
    const loading = ref(false);
    function loadDeck() {
      if (props.deckId) deck.value = getDeck(props.deckId);
      else if (props.deckSlug) deck.value = getDeckBySlug(props.deckSlug);
    }
    async function loadCards() {
      const ids = deck.value?.cards.map((c) => c.cardId) ?? [];
      if (ids.length === 0) {
        cards.value = {};
        return;
      }
      loading.value = true;
      try {
        const entries = await Promise.all(ids.map(async (id) => [id, await fetchCardById(id)]));
        const obj = {};
        for (const [id, card] of entries) obj[id] = card;
        cards.value = obj;
      } finally {
        loading.value = false;
      }
    }
    onMounted(() => {
      loadDeck();
      loadCards();
    });
    watch(() => [props.deckId, props.deckSlug, deck.value?.cards.length], () => {
      loadDeck();
      loadCards();
    });
    const totalPrice = computed(() => {
      if (!deck.value) return 0;
      return deck.value.cards.reduce((sum, c) => {
        const card = cards.value[c.cardId];
        const price = card ? getUsdPrice(card) : 0;
        return sum + price * c.quantity;
      }, 0);
    });
    function changeQuantity(cardId, delta) {
      if (!deck.value) return;
      const updated = { ...deck.value, cards: deck.value.cards.map((c) => c.cardId === cardId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c).filter((c) => c.quantity > 0) };
      upsertDeck(updated);
      deck.value = updated;
    }
    const __returned__ = { props, deck, cards, loading, loadDeck, loadCards, totalPrice, changeQuantity, get getBestImageUrl() {
      return getBestImageUrl;
    }, get getUsdPrice() {
      return getUsdPrice;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "panel" }, _attrs))}>`);
  if (!$setup.deck) {
    _push(`<div class="muted">Deck not found.</div>`);
  } else {
    _push(`<!--[--><div class="row" style="${ssrRenderStyle({ "align-items": "center" })}"><img${ssrRenderAttr("src", $setup.deck.commanderImage || "")}${ssrRenderAttr("alt", $setup.deck.name)} style="${ssrRenderStyle({ "width": "180px", "border-radius": "12px", "border": "1px solid #232832" })}"><div><div class="name" style="${ssrRenderStyle({ "font-size": "20px" })}">${ssrInterpolate($setup.deck.name)}</div><div class="mana" style="${ssrRenderStyle({ "margin-top": "6px" })}"><!--[-->`);
    ssrRenderList($setup.deck.colorIdentity, (c) => {
      _push(`<span class="${ssrRenderClass([c, "p"])}">${ssrInterpolate(c)}</span>`);
    });
    _push(`<!--]--></div><div class="spacer"></div><div class="tag">Cards: ${ssrInterpolate($setup.deck.cards.reduce((a, c) => a + c.quantity, 0))}</div><div class="tag">Total price (USD): $${ssrInterpolate($setup.totalPrice.toFixed(2))}</div></div></div><div class="spacer"></div><div class="list">`);
    if ($setup.loading) {
      _push(`<div class="muted">Loading card details…</div>`);
    } else if ($setup.deck.cards.length === 0) {
      _push(`<div class="muted">No cards added yet.</div>`);
    } else {
      _push(`<!--[-->`);
      ssrRenderList($setup.deck.cards, (entry) => {
        _push(`<div class="row panel"><div class="row" style="${ssrRenderStyle({ "gap": "12px", "align-items": "center" })}"><img${ssrRenderAttr("src", $setup.cards[entry.cardId] && $setup.getBestImageUrl($setup.cards[entry.cardId]) || "")}${ssrRenderAttr("alt", $setup.cards[entry.cardId]?.name || "")} style="${ssrRenderStyle({ "width": "70px", "border-radius": "6px", "border": "1px solid #232832" })}"><div><div class="name">${ssrInterpolate($setup.cards[entry.cardId]?.name || "Loading…")}</div><div class="muted">$${ssrInterpolate(($setup.cards[entry.cardId] ? $setup.getUsdPrice($setup.cards[entry.cardId]) : 0).toFixed(2))} each</div></div></div><div class="row right"><button>-</button><span class="tag">${ssrInterpolate(entry.quantity)}</span><button>+</button></div></div>`);
      });
      _push(`<!--]-->`);
    }
    _push(`</div><!--]-->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/DeckInspector.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DeckInspector = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Deck • Commander Builder</title><link rel="stylesheet" href="/styles.css">${renderHead()}</head> <body> <nav class="nav"> <a class="brand" href="/">Commander Builder</a> <a href="/decks">Saved Decks</a> </nav> <main class="container"> <a href="/decks">← Back to decks</a> <div class="spacer"></div> <!-- Pass slug to client; component will resolve deckId from localStorage --> ${renderComponent($$result, "DeckInspector", DeckInspector, { "deckSlug": String(slug), "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/DeckInspector.vue", "client:component-export": "default" })} ${renderComponent($$result, "ToastHost", ToastHost, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/ToastHost.vue", "client:component-export": "default" })} </main> </body></html>`;
}, "/Users/Luis/Documents/mtg-pdp/src/pages/decks/[slug].astro", void 0);

const $$file = "/Users/Luis/Documents/mtg-pdp/src/pages/decks/[slug].astro";
const $$url = "/decks/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
