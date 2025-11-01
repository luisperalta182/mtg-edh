import { reactive, defineComponent, useSSRContext, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
/* empty css                          */

const STORAGE_KEY = "mtg_commander_decks_v1";
function getNowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function loadDecks() {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}
function saveDecks(decks) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}
function slugifyName(name) {
  return name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
function ensureUniqueSlug(base, existing) {
  let slug = base || "deck";
  let i = 1;
  const taken = new Set(existing.map((d) => d.slug));
  while (taken.has(slug)) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}
function createDeck(params) {
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
    lastUpdatedIso: getNowIso()
  };
}
function upsertDeck(deck) {
  const decks = loadDecks();
  const idx = decks.findIndex((d) => d.id === deck.id);
  if (idx >= 0) decks[idx] = { ...deck, lastUpdatedIso: getNowIso() };
  else decks.unshift({ ...deck, lastUpdatedIso: getNowIso() });
  saveDecks(decks);
}
function deleteDeck(deckId) {
  const decks = loadDecks().filter((d) => d.id !== deckId);
  saveDecks(decks);
}
function getDeck(deckId) {
  return loadDecks().find((d) => d.id === deckId);
}
function getDeckBySlug(slug) {
  return loadDecks().find((d) => d.slug === slug);
}
function renameDeck(deckId, newName) {
  const decks = loadDecks();
  const idx = decks.findIndex((d) => d.id === deckId);
  if (idx < 0) return void 0;
  const base = slugifyName(newName);
  const slug = ensureUniqueSlug(base, decks.filter((_, i) => i !== idx));
  const updated = { ...decks[idx], name: newName, slug, lastUpdatedIso: getNowIso() };
  decks[idx] = updated;
  saveDecks(decks);
  return updated;
}

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const state = reactive({ items: [] });
function useToast() {
  function show(message, kind = "info", timeoutMs = 2500) {
    const id = crypto.randomUUID();
    state.items.push({ id, message, kind });
    window.setTimeout(() => dismiss(id), timeoutMs);
  }
  function dismiss(id) {
    const idx = state.items.findIndex((t) => t.id === id);
    if (idx >= 0) state.items.splice(idx, 1);
  }
  return { state, show, dismiss };
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ToastHost",
  setup(__props, { expose: __expose }) {
    __expose();
    const { state, dismiss } = useToast();
    const __returned__ = { state, dismiss };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "toast-container" }, _attrs))}><!--[-->`);
  ssrRenderList($setup.state.items, (t) => {
    _push(`<div class="toast"${ssrRenderAttr("data-kind", t.kind)}>${ssrInterpolate(t.message)}</div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ToastHost.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ToastHost = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { ToastHost as T, _export_sfc as _, getDeckBySlug as a, useToast as b, createDeck as c, deleteDeck as d, getDeck as g, loadDecks as l, renameDeck as r, upsertDeck as u };
