import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadCatalogue, helpers } from '../catalogue.js';
import { buildTools, systemPrompt } from '../planner.js';

const T = await loadCatalogue(await readFile(new URL('../../tunis-trip/data.js', import.meta.url), 'utf8'));
const H = helpers(T);
const run = (tools, name, input) => tools.find(t => t.name === name).run(input);

test('fresh state follows the site defaults and forces booked stays', () => {
  const s = H.freshState();
  assert.deepEqual(s.route, [...T.defaultRoute]);
  assert.equal(s.stays.carthage, 'intact-home');
  assert.ok(s.plan.D2.some(r => r.p === 'sidi-bou-said'));
  assert.ok(s.plan.D4.some(r => r.p === 'great-mosque'));
  assert.deepEqual(s.plan.D1, []); assert.deepEqual(s.plan.D8, []);
});

test('tools add, move, remove and report changes', async () => {
  const state = H.freshState(); const { tools, changed } = buildTools(T, H, state);
  assert.match(await run(tools, 'get_plan', {}), /Route: Carthage · Sidi Bou Said × 2/);
  assert.equal(changed.value, false);
  assert.match(await run(tools, 'find_places', { query: 'brik', category: 'food' }), /\w+ · .*Food/i);
  assert.match(await run(tools, 'add_place', { place_id: 'dougga', day: 'D3' }), /Added Dougga/);
  assert.ok(state.plan.D3.some(r => r.p === 'dougga' && r.s === H.byId.dougga.slot));
  assert.match(await run(tools, 'add_place', { place_id: 'dougga', day: 'D3' }), /already/);
  assert.match(await run(tools, 'move_place', { place_id: 'dougga', from_day: 'D3', to_day: 'D5', slot: 'afternoon' }), /Moved/);
  assert.ok(!state.plan.D3.some(r => r.p === 'dougga')); assert.ok(state.plan.D5.some(r => r.p === 'dougga' && r.s === 'afternoon'));
  assert.match(await run(tools, 'remove_place', { place_id: 'dougga', day: 'D5' }), /Removed/);
  await assert.rejects(async () => run(tools, 'add_place', { place_id: 'nope', day: 'D3' }), /Unknown place/);
  await assert.rejects(async () => run(tools, 'add_place', { place_id: 'dougga', day: 'D1' }), /flight night/);
  assert.equal(changed.value, true);
});

test('route changes regenerate only the days whose base changed and keep the booked base', async () => {
  const state = H.freshState(); const { tools } = buildTools(T, H, state);
  await run(tools, 'add_place', { place_id: 'dougga', day: 'D3' });
  const d5 = JSON.stringify(state.plan.D5);
  await run(tools, 'set_route', { route: ['carthage', 'carthage', 'sousse', 'sousse', 'sousse', 'hammamet'] });
  assert.ok(state.plan.D3.some(r => r.p === 'dougga'), 'unchanged Carthage day keeps its pick');
  assert.equal(JSON.stringify(state.plan.D5), d5, 'unchanged Sousse day keeps its plan');
  assert.ok(state.plan.D7.some(r => r.p === 'eljem-amphitheatre'), 'the moved Sousse → Hammamet day gets the El Jem transition plan');
  assert.ok(!state.plan.D6.some(r => r.p === 'eljem-amphitheatre'), 'the day that is now a plain Sousse day lost the drive plan');
  await assert.rejects(async () => run(tools, 'set_route', { route: ['tunis', 'tunis', 'sousse', 'sousse', 'hammamet', 'hammamet'] }), /booked/);
  await assert.rejects(async () => run(tools, 'set_route', { route: ['carthage', 'mars', 'sousse', 'sousse', 'hammamet', 'hammamet'] }), /Route must be/);
});

test('stays: booked base is locked, other bases can change, suggestions are added', async () => {
  const state = H.freshState(); const { tools } = buildTools(T, H, state);
  await assert.rejects(async () => run(tools, 'set_stay', { base: 'carthage', stay_id: 'dar-mima' }), /booked/);
  assert.match(await run(tools, 'list_stays', { base: 'sousse', private_only: true }), /central-private-medina/);
  assert.match(await run(tools, 'set_stay', { base: 'sousse', stay_id: 'central-dar-baaziz' }), /Dar Baaziz/);
  assert.equal(state.stays.sousse, 'central-dar-baaziz');
  assert.match(await run(tools, 'suggest_stay', { base: 'hammamet', name: 'Villa from auntie', url: 'https://example.com/v', choose: true }), /chose it/);
  assert.equal(state.suggestions.length, 1); assert.equal(state.stays.hammamet, state.suggestions[0].id);
  assert.match(await run(tools, 'set_car', { car_id: 'volvo-xc90' }), /Volvo/);
});

test('system prompt carries the catalogue and the fixed facts', () => {
  const sys = systemPrompt(T, 'https://example.test/');
  assert.equal(sys.length, 2);
  assert.match(sys[0].text, /Turkish Airlines/); assert.match(sys[0].text, /https:\/\/example\.test\//);
  assert.match(sys[1].text, /great-mosque\|Great Mosque of Kairouan\|sights/);
  assert.equal(sys[1].cache_control.type, 'ephemeral');
});
