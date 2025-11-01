import { c as createComponent, d as renderHead, e as renderComponent, r as renderTemplate } from '../chunks/astro/server_DqeAK1Mz.mjs';
import 'kleur/colors';
import 'html-escaper';
import { defineComponent, useSSRContext, ref, onMounted, mergeProps } from 'vue';
import { l as loadDecks, d as deleteDeck, _ as _export_sfc, T as ToastHost } from '../chunks/ToastHost_CAIsePl3.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
export { renderers } from '../renderers.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DeckGrid",
  setup(__props, { expose: __expose }) {
    __expose();
    const decks = ref([]);
    function refresh() {
      decks.value = loadDecks();
    }
    onMounted(() => refresh());
    function onDelete(id) {
      if (!window.confirm("Delete this deck?")) return;
      deleteDeck(id);
      refresh();
    }
    const __returned__ = { decks, refresh, onDelete };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid cards" }, _attrs))}><!--[-->`);
  ssrRenderList($setup.decks, (d) => {
    _push(`<div class="card"><a${ssrRenderAttr("href", `/decks/${d.slug}`)}><img class="card-img"${ssrRenderAttr("src", d.commanderImage || "")}${ssrRenderAttr("alt", d.name)} loading="lazy"></a><div class="row" style="${ssrRenderStyle({ "justify-content": "space-between" })}"><div><div class="name">${ssrInterpolate(d.name)}</div><div class="mana"><!--[-->`);
    ssrRenderList(d.colorIdentity, (c) => {
      _push(`<span class="${ssrRenderClass([c, "p"])}">${ssrInterpolate(c)}</span>`);
    });
    _push(`<!--]--></div></div><button class="ghost">Delete</button></div></div>`);
  });
  _push(`<!--]-->`);
  if ($setup.decks.length === 0) {
    _push(`<div class="muted">No decks saved yet.</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/DeckGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DeckGrid = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Saved Decks • Commander Builder</title><link rel="stylesheet" href="/styles.css">${renderHead()}</head> <body> <nav class="nav"> <a class="brand" href="/">Commander Builder</a> <a href="/decks" aria-current="page">Saved Decks</a> </nav> <main class="container"> <h2>Saved Decks</h2> ${renderComponent($$result, "DeckGrid", DeckGrid, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/DeckGrid.vue", "client:component-export": "default" })} ${renderComponent($$result, "ToastHost", ToastHost, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/ToastHost.vue", "client:component-export": "default" })} <div class="footer">Local-only storage. Export/import not implemented yet.</div> </main> </body></html>`;
}, "/Users/Luis/Documents/mtg-pdp/src/pages/decks/index.astro", void 0);

const $$file = "/Users/Luis/Documents/mtg-pdp/src/pages/decks/index.astro";
const $$url = "/decks";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
