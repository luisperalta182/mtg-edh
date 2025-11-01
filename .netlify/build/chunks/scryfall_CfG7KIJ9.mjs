const BASE = "https://api.scryfall.com";
async function fetchSets() {
  const res = await fetch(`${BASE}/sets`);
  if (!res.ok) throw new Error(`Failed to fetch sets: ${res.status}`);
  const json = await res.json();
  return json?.data || [];
}
function buildSearchUrl(query, page = 1, setCode) {
  const qs = new URLSearchParams();
  qs.set("q", setCode ? `${query} set:${setCode}` : query);
  qs.set("page", String(page));
  qs.set("unique", "prints");
  return `${BASE}/cards/search?${qs.toString()}`;
}
async function searchCards(query, page = 1, setCode) {
  const url = buildSearchUrl(query, page, setCode);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return await res.json();
}
async function fetchCardById(id) {
  const res = await fetch(`${BASE}/cards/${id}`);
  if (!res.ok) throw new Error(`Card fetch failed: ${res.status}`);
  return await res.json();
}
function getBestImageUrl(card) {
  if (card.image_uris?.normal) return card.image_uris.normal;
  if (card.card_faces && card.card_faces[0]?.image_uris?.normal) return card.card_faces[0].image_uris.normal;
  return void 0;
}
function getUsdPrice(card) {
  const p = card.prices?.usd ?? card.prices?.usd_foil ?? null;
  const n = p ? Number(p) : 0;
  return Number.isFinite(n) ? n : 0;
}

export { getBestImageUrl as a, fetchSets as b, fetchCardById as f, getUsdPrice as g, searchCards as s };
