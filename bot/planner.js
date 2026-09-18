// The trip planner: a Claude agent with tools that edit the shared plan. One call per incoming chat message.
import Anthropic from '@anthropic-ai/sdk';
import { betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { loadCatalogue, helpers } from './catalogue.js';

const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5';
const HISTORY = 16; // turns kept per chat

const str = (extra = {}) => ({ type: 'string', ...extra });

// Tools close over one working copy of the plan; the caller publishes it if anything changed.
export function buildTools(T, H, state) {
  const changed = { value: false };
  const touch = () => { changed.value = true; };
  const dayIds = T.days.map(d => d.id);
  const slotIds = T.slots.map(s => s.id);
  const dayOrFail = d => { if (!dayIds.includes(d)) throw new Error(`Unknown day ${d}. Days are ${dayIds.join(', ')}`); if (d === 'D1') throw new Error('D1 is the flight night; nothing can be planned on it.'); return d; };
  const placeOrFail = id => { const p = H.byId[id]; if (!p) throw new Error(`Unknown place id ${id}. Use find_places to look it up.`); return p; };
  const rowText = r => { const p = H.byId[r.p]; return `${r.s.padEnd(9)} ${p.id.padEnd(24)} ${p.n} [${p.cat}, ${p.area}]`; };
  const dayText = d => { const rows = state.plan[d.id] || []; const b = H.dayBase(state.route, d.id); const st = b ? H.stayFor(state, b) : null; return [`${d.id} · ${H.dayLabel(d)} · ${H.dayTitle(state.route, d)}${st ? ` · stay: ${st.n}${st.booked ? ' (booked)' : ''}` : ''}`, ...(rows.length ? [...rows].sort((a, b2) => slotIds.indexOf(a.s) - slotIds.indexOf(b2.s)).map(rowText) : ['  (nothing picked)'])].join('\n'); };

  const tools = [
    betaTool({
      name: 'get_plan', description: 'Read the current shared plan: route (base per night), stays, car, and the picked places for each day. Pass a day id to read one day.',
      inputSchema: { type: 'object', properties: { day: str({ description: 'Optional day id D2…D8' }) } },
      run: ({ day }) => {
        if (day) return dayText(T.days.find(d => d.id === day) || (() => { throw new Error(`Unknown day ${day}`); })());
        const route = H.blocks(state.route).map(b => `${T.bases[b.base].en} × ${b.nights} (${H.stayFor(state, b.base).n}${H.stayFor(state, b.base).booked ? ', booked' : ''})`).join(' → ');
        const car = T.cars.find(c => c.id === state.car) || T.cars[0];
        return [`Route: ${route}`, `Car: ${car.n} (${car.id})`, `Last published: ${state.updatedAt || 'never'}`, '', ...T.days.map(dayText)].join('\n\n');
      }
    }),
    betaTool({
      name: 'find_places', description: 'Search the catalogue of 130 places (restaurants, sights, museums, shopping, nightlife, beaches, spas). Returns ids to use with add_place. Filter by text, category, area, or the day (uses the areas the family is in that day).',
      inputSchema: { type: 'object', properties: { query: str({ description: 'Free text matched against name, description and tags' }), category: str({ enum: T.cats.map(c => c.id) }), area: str({ enum: Object.keys(T.areas) }), day: str({ description: 'Limit to areas reachable that day' }), limit: { type: 'integer', minimum: 1, maximum: 60 } } },
      run: ({ query, category, area, day, limit = 25 }) => {
        const q = (query || '').toLowerCase();
        const areas = day ? H.dayAreas(state.route, day) : null;
        const inPlan = Object.fromEntries(Object.entries(state.plan).flatMap(([d, rows]) => rows.map(r => [r.p, d])));
        const hit = T.places.filter(p => (!category || p.cat === category) && (!area || p.area === area) && (!areas || areas.includes(p.area)) && (!q || `${p.n} ${p.b} ${p.tags.join(' ')} ${p.area} ${p.cat}`.toLowerCase().includes(q)));
        if (!hit.length) return 'No matches. Try a shorter query, or another category/area.';
        return hit.slice(0, limit).map(p => `${p.id} · ${p.n} · ${p.cat} · ${T.areas[p.area].en} · usual slot ${p.slot}${p.dur ? ` · ${p.dur}` : ''}${p.book ? ` · ${p.book}` : ''}${inPlan[p.id] ? ` · already on ${inPlan[p.id]}` : ''}\n   ${p.b}`).join('\n');
      }
    }),
    betaTool({
      name: 'add_place', description: 'Add a catalogue place to a day. Slot defaults to the place\'s usual time of day. A place can be on several days but only once per day.',
      inputSchema: { type: 'object', properties: { place_id: str(), day: str({ description: 'D2…D8' }), slot: str({ enum: slotIds }) }, required: ['place_id', 'day'] },
      run: ({ place_id, day, slot }) => { const p = placeOrFail(place_id); dayOrFail(day); const rows = state.plan[day] = state.plan[day] || []; if (rows.some(r => r.p === p.id)) return `${p.n} is already on ${day}.`; const areas = H.dayAreas(state.route, day); rows.push({ p: p.id, s: slot || p.slot }); touch(); return `Added ${p.n} to ${day} (${slot || p.slot}).${areas.includes(p.area) ? '' : ` Note: ${p.n} is in ${T.areas[p.area].en}, which is not where the family is that day.`}`; }
    }),
    betaTool({
      name: 'remove_place', description: 'Remove a place from a day.',
      inputSchema: { type: 'object', properties: { place_id: str(), day: str() }, required: ['place_id', 'day'] },
      run: ({ place_id, day }) => { const p = placeOrFail(place_id); dayOrFail(day); const rows = state.plan[day] || []; const i = rows.findIndex(r => r.p === p.id); if (i < 0) return `${p.n} is not on ${day}.`; rows.splice(i, 1); touch(); return `Removed ${p.n} from ${day}.`; }
    }),
    betaTool({
      name: 'move_place', description: 'Move a place to another day and/or another time of day.',
      inputSchema: { type: 'object', properties: { place_id: str(), from_day: str(), to_day: str(), slot: str({ enum: slotIds }) }, required: ['place_id', 'from_day'] },
      run: ({ place_id, from_day, to_day, slot }) => { const p = placeOrFail(place_id); dayOrFail(from_day); const to = to_day ? dayOrFail(to_day) : from_day; const rows = state.plan[from_day] || []; const i = rows.findIndex(r => r.p === p.id); if (i < 0) return `${p.n} is not on ${from_day}.`; const [row] = rows.splice(i, 1); if (slot) row.s = slot; const dest = state.plan[to] = state.plan[to] || []; if (dest.some(r => r.p === p.id)) return `${p.n} was already on ${to}; removed the copy from ${from_day}.`; dest.push(row); touch(); return `Moved ${p.n} to ${to} (${row.s}).`; }
    }),
    betaTool({
      name: 'clear_day', description: 'Remove every picked place from a day (fixed rows such as flights and drives stay).',
      inputSchema: { type: 'object', properties: { day: str() }, required: ['day'] },
      run: ({ day }) => { dayOrFail(day); state.plan[day] = []; touch(); return `Cleared ${day}.`; }
    }),
    betaTool({
      name: 'set_route', description: 'Change which base the family sleeps in on each of the six nights (Sat 19 → Thu 24). Days whose base changes get that base\'s default plan; other days keep their picks. Bases with a booked stay must keep it.',
      inputSchema: { type: 'object', properties: { route: { type: 'array', items: str({ enum: H.BASES }), minItems: T.nights.length, maxItems: T.nights.length, description: `One base per night for ${T.nights.join(', ')}` } }, required: ['route'] },
      run: ({ route }) => { if (!H.validRoute(route)) throw new Error(`Route must be ${T.nights.length} bases from ${H.BASES.join(', ')}`); for (const [b] of Object.entries(T.bookedStays || {})) { if (!route.includes(b)) throw new Error(`${T.bases[b].en} has a booked stay and must stay on the route.`); } H.setRoute(state, route); touch(); return `Route is now ${H.blocks(route).map(b => `${T.bases[b.base].en} × ${b.nights}`).join(' → ')}. Days that changed base got their default plan.`; }
    }),
    betaTool({
      name: 'list_stays', description: 'List the stay options (with ratings and links) for a base, plus which one is chosen.',
      inputSchema: { type: 'object', properties: { base: str({ enum: H.BASES }), private_only: { type: 'boolean' } }, required: ['base'] },
      run: ({ base, private_only }) => H.poolOf(state, base).filter(o => !private_only || o.priv8 || o.suggested).map(o => `${o.id} · ${o.n} · ${[o.type, o.guests, o.rating].filter(Boolean).join(' · ')}${o.exp != null ? ` · exp ${o.exp}/10 priv ${o.priv}/10 ${o.tier || ''}` : ''}${o.booked ? ' · BOOKED' : state.stays[base] === o.id ? ' · chosen' : ''}${o.url ? ` · ${o.url}` : ''}`).join('\n')
    }),
    betaTool({
      name: 'set_stay', description: 'Choose the stay for a base. Not allowed where a stay is already booked.',
      inputSchema: { type: 'object', properties: { base: str({ enum: H.BASES }), stay_id: str() }, required: ['base', 'stay_id'] },
      run: ({ base, stay_id }) => { if (T.bookedStays && T.bookedStays[base]) throw new Error(`${T.bases[base].en} is booked (${H.stayFor(state, base).n}); it cannot be changed from the chat.`); const o = H.poolOf(state, base).find(x => x.id === stay_id); if (!o) throw new Error(`No stay ${stay_id} for ${base}; use list_stays.`); state.stays[base] = o.id; touch(); return `${T.bases[base].en} stay is now ${o.n}.`; }
    }),
    betaTool({
      name: 'suggest_stay', description: 'Add a stay someone shared in the group (name + listing link) to a base\'s options, optionally choosing it.',
      inputSchema: { type: 'object', properties: { base: str({ enum: H.BASES }), name: str(), url: str(), choose: { type: 'boolean' } }, required: ['base', 'name'] },
      run: ({ base, name, url, choose }) => { const id = `sug-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${Date.now().toString(36)}`; state.suggestions = state.suggestions || []; state.suggestions.push({ id, block: base, n: name, url: url || '', suggested: true }); if (choose && !(T.bookedStays && T.bookedStays[base])) state.stays[base] = id; touch(); return `Added "${name}" to the ${T.bases[base].en} options${choose ? ' and chose it' : ''}.`; }
    }),
    betaTool({
      name: 'list_cars', description: 'List the rental car options.', inputSchema: { type: 'object', properties: {} },
      run: () => T.cars.map(c => `${c.id} · ${c.n}${c.id === state.car ? ' · chosen' : ''}`).join('\n')
    }),
    betaTool({
      name: 'set_car', description: 'Choose the rental car.', inputSchema: { type: 'object', properties: { car_id: str() }, required: ['car_id'] },
      run: ({ car_id }) => { const c = T.cars.find(x => x.id === car_id); if (!c) throw new Error(`No car ${car_id}; use list_cars.`); state.car = c.id; touch(); return `Car is now ${c.n}.`; }
    })
  ];
  return { tools, changed };
}

export function systemPrompt(T, siteUrl) {
  const places = T.places.map(p => `${p.id}|${p.n}|${p.cat}|${p.area}|${p.slot}`).join('\n');
  return [
    { type: 'text', text: `You are the trip planner for one family's holiday in Tunisia, ${T.days[0].date} → ${T.days[T.days.length - 1].date} (${T.travelers} travellers, including the mother, who likes local clothing and easy walking). You live in the family's chat group. Your job: keep the shared plan on the family site up to date from what people say in the chat, and answer questions about it.

Facts that are fixed and must never be changed: the flights (out Sat 19 Sep, Turkish Airlines via Istanbul, landing Tunis 09:00; back Fri 25 Sep, Saudia via Jeddah, leaving Tunis 11:40) and any stay marked booked. Days are ${T.days.map(d => `${d.id}=${d.date}`).join(', ')}; D1 is the outbound flight night, D8 the departure morning. Nights ${T.nights.join('…')} each have a base: ${Object.entries(T.bases).map(([k, v]) => `${k} = ${v.en}`).join('; ')}.

How to behave:
- Read the plan with get_plan before changing it. Make the change with the tools; every change you make is published to the site automatically after your reply, so never claim a change you did not make with a tool.
- Be a good planner: keep days realistic (a drive day gets one or two stops, not five), respect closing days (tags say friday / closedMon), keep restaurants near where the family is, and say so briefly if a request would not work well. Offer one alternative, not a list.
- Reply like a person in a family chat: short, warm, plain. Two or three sentences plus, when you changed something, a compact list of what changed. No markdown headers or tables; WhatsApp only renders *bold* and _italic_. Reply in the language the message was written in (Arabic or English).
- End a reply that changed the plan with the site link ${siteUrl} so people can open it.
- If a message is not for you (chit-chat between family members, photos, reactions), reply with an empty string.` },
    { type: 'text', text: `Catalogue (id|name|category|area|usual slot):\n${places}`, cache_control: { type: 'ephemeral' } }
  ];
}

export function createPlanner({ store, siteUrl, client = new Anthropic(), model = MODEL, log = console }) {
  const chats = new Map(); // chatId → message history
  let cat = null, catAt = 0;
  const catalogue = async () => { if (cat && Date.now() - catAt < 10 * 60 * 1000) return cat; const T = await loadCatalogue(await store.readData()); cat = { T, H: helpers(T), system: systemPrompt(T, siteUrl) }; catAt = Date.now(); return cat; };

  async function handle({ chatId, from, text }) {
    if (!text || !text.trim()) return '';
    const { T, H, system } = await catalogue();
    const { plan: saved, sha } = await store.readPlan();
    const state = saved && saved.route ? { ...H.freshState(), ...saved } : H.freshState();
    Object.entries(T.bookedStays || {}).forEach(([b, id]) => { state.stays[b] = id; });
    const { tools, changed } = buildTools(T, H, state);
    const history = chats.get(chatId) || [];
    const user = { role: 'user', content: `${from ? `[${from}] ` : ''}${text.trim()}` };
    const messages = [...history, user];
    const final = await client.beta.messages.toolRunner({ model, max_tokens: 4000, thinking: { type: 'adaptive' }, system, tools, messages, max_iterations: 12 });
    const reply = final.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
    chats.set(chatId, [...messages, { role: 'assistant', content: reply || '(no reply)' }].slice(-HISTORY * 2));
    if (changed.value) {
      state.updatedAt = new Date().toISOString();
      state.log = [...(state.log || []), { at: state.updatedAt, by: from || chatId, said: text.trim().slice(0, 200) }].slice(-30);
      await store.writePlan(state, sha, `Plan update from the trip chat${from ? ` (${from})` : ''}`);
      log.info?.(`plan published ${state.updatedAt}`);
    }
    return reply;
  }
  return { handle };
}
