// Loads the site's data.js (window.TRIP) so the bot shares the exact same catalogue, route model and templates as the site.
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

export async function loadCatalogue(source) {
  const src = typeof source === 'string' && !source.includes('\n') ? await readFile(source, 'utf8') : source;
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx, { filename: 'data.js' });
  const T = ctx.window.TRIP;
  if (!T || !Array.isArray(T.places)) throw new Error('data.js did not define window.TRIP');
  return T;
}

// Pure helpers ported from tunis-trip/app.js so that the bot's edits produce exactly what the site would produce.
export function helpers(T) {
  const byId = Object.fromEntries(T.places.map(p => [p.id, p]));
  const BASES = Object.keys(T.bases);
  const validRoute = r => Array.isArray(r) && r.length === T.nights.length && r.every(b => BASES.includes(b));
  const rowsFrom = list => list.map(x => { const [p, s] = x.split('@'); return { p, s: s || byId[p].slot }; });
  const tuples = route => { let n = -1, prev = null; return route.map(b => { if (b !== prev) { const tk = prev && T.transitions[`${prev}>${b}`] ? `${prev}>${b}` : null; prev = b; if (tk) { n = -1; return tk; } n = 0; return `${b}:0`; } n++; return `${b}:${n}`; }); };
  const templateRows = key => { if (key.includes('>')) return rowsFrom(T.transitions[key].plan); const [b, n] = key.split(':'); const tpl = T.templates[b]; return rowsFrom(tpl[Number(n) % tpl.length]); };
  const defaultPlan = route => { const plan = {}; T.days.forEach(d => plan[d.id] = []); tuples(route).forEach((k, i) => plan[T.nights[i]] = templateRows(k)); return plan; };
  const dayIndex = id => T.days.findIndex(d => d.id === id);
  const dayBase = (route, id) => { const i = dayIndex(id); return i === 0 ? null : i === T.days.length - 1 ? route[T.nights.length - 1] : route[i - 1]; };
  const prevBase = (route, id) => { const i = dayIndex(id); return i >= 2 && i <= T.nights.length ? route[i - 2] : null; };
  const dayAreas = (route, id) => { const b = dayBase(route, id), p = prevBase(route, id); const out = new Set(); if (b) T.bases[b].areas.forEach(a => out.add(a)); if (p && p !== b) { T.bases[p].areas.forEach(a => out.add(a)); out.add('road'); } return [...out]; };
  const poolOf = (state, b) => [...T.stayPools[b], ...(state.suggestions || []).filter(x => x.block === b)];
  const stayFor = (state, b) => { const pool = poolOf(state, b); return pool.find(o => o.id === state.stays[b]) || pool[0]; };
  const dayLabel = d => new Date(d.date + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  const dayTitle = (route, d) => { const i = dayIndex(d.id), b = dayBase(route, d.id), p = prevBase(route, d.id); if (i === 0) return d.ten; if (i === 1) return `Arrive · first day in ${T.bases[b].en}`; if (i === T.days.length - 1) return `${T.bases[b].en} → airport → Jeddah → Riyadh`; if (p && p !== b) { const tr = T.transitions[`${p}>${b}`]; return `${T.bases[p].en} → ${T.bases[b].en}${tr ? ` ${tr.en}` : ''}`; } return T.bases[b].en; };
  const blocks = route => { const out = []; route.forEach((b, i) => { const last = out[out.length - 1]; if (last && last.base === b && last.end === i - 1) { last.end = i; last.nights++; } else out.push({ base: b, start: i, end: i, nights: 1 }); }); return out; };
  const setRoute = (state, route) => { const before = tuples(state.route), after = tuples(route); after.forEach((k, i) => { if (k !== before[i]) state.plan[T.nights[i]] = templateRows(k); }); state.route = route; Object.entries(T.bookedStays || {}).forEach(([b, id]) => { state.stays[b] = id; }); };
  const freshState = () => { const route = [...T.defaultRoute]; const stays = {}; BASES.forEach(b => stays[b] = T.stayPools[b][0].id); Object.entries(T.bookedStays || {}).forEach(([b, id]) => { stays[b] = id; }); return { updatedAt: null, route, plan: defaultPlan(route), stays, car: T.cars[0].id, suggestions: [], log: [] }; };
  return { byId, BASES, validRoute, tuples, templateRows, defaultPlan, dayIndex, dayBase, prevBase, dayAreas, poolOf, stayFor, dayLabel, dayTitle, blocks, setRoute, freshState };
}
