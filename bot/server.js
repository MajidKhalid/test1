// HTTP entry point: Telegram webhook, WhatsApp Cloud API webhook, and a generic /chat endpoint for bridges and tests.
import http from 'node:http';
import { createPlanner } from './planner.js';
import { GitHubStore, FileStore } from './plan-store.js';

const env = process.env;
const PORT = Number(env.PORT || 8787);
const SITE = env.SITE_URL || 'https://majidkhalid.github.io/test1/tunis-trip/';

const store = env.GITHUB_TOKEN
  ? new GitHubStore({ token: env.GITHUB_TOKEN, repo: env.GITHUB_REPO || 'MajidKhalid/test1', branch: env.GITHUB_BRANCH || 'main', planPath: env.PLAN_PATH || 'tunis-trip/plan.json', dataPath: env.DATA_PATH || 'tunis-trip/data.js' })
  : new FileStore({ planPath: env.PLAN_PATH || '../tunis-trip/plan.json', dataPath: env.DATA_PATH || '../tunis-trip/data.js' });
const planner = createPlanner({ store, siteUrl: SITE });

// One message at a time per chat, so two quick messages cannot both edit the plan from the same starting point.
const queues = new Map();
const enqueue = (chatId, job) => { const prev = queues.get(chatId) || Promise.resolve(); const next = prev.then(job, job).catch(e => console.error('handler failed', e)); queues.set(chatId, next); return next; };
const seen = new Set(); // message ids already handled (webhooks retry)
const dedupe = id => { if (!id) return false; if (seen.has(id)) return true; seen.add(id); if (seen.size > 5000) seen.delete(seen.values().next().value); return false; };
const allowed = (list, id) => { const l = (list || '').split(',').map(s => s.trim()).filter(Boolean); return !l.length || l.includes(String(id)); };

async function readJson(req) { let body = ''; for await (const chunk of req) body += chunk; return body ? JSON.parse(body) : {}; }
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); };

// ---- Telegram ----
async function telegramSend(chatId, text, replyTo) {
  if (!text) return;
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, reply_to_message_id: replyTo, disable_web_page_preview: false }) });
  if (!r.ok) console.error('telegram send failed', r.status, await r.text());
}
async function onTelegram(update) {
  const m = update.message || update.edited_message; if (!m || !m.text) return;
  if (dedupe(`tg:${m.chat.id}:${m.message_id}`)) return;
  if (!allowed(env.TELEGRAM_ALLOWED_CHATS, m.chat.id)) return;
  const from = [m.from?.first_name, m.from?.last_name].filter(Boolean).join(' ');
  const text = m.text.replace(/^\/(plan|start|help)(@\w+)?\s*/i, (s, cmd) => cmd.toLowerCase() === 'plan' ? '' : 'Hello. What can you do? ');
  enqueue(`tg:${m.chat.id}`, async () => { const reply = await planner.handle({ chatId: `tg:${m.chat.id}`, from, text }); await telegramSend(m.chat.id, reply, m.message_id); });
}

// ---- WhatsApp Cloud API ----
async function whatsappSend(to, text) {
  if (!text) return;
  const r = await fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_ID}/messages`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${env.WHATSAPP_TOKEN}` }, body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text, preview_url: true } }) });
  if (!r.ok) console.error('whatsapp send failed', r.status, await r.text());
}
async function onWhatsApp(payload) {
  for (const entry of payload.entry || []) for (const ch of entry.changes || []) {
    const v = ch.value || {}; const names = Object.fromEntries((v.contacts || []).map(c => [c.wa_id, c.profile?.name]));
    for (const m of v.messages || []) {
      if (m.type !== 'text' || !m.text?.body) continue;
      if (dedupe(`wa:${m.id}`)) continue;
      if (!allowed(env.WHATSAPP_ALLOWED_NUMBERS, m.from)) continue;
      enqueue(`wa:${m.from}`, async () => { const reply = await planner.handle({ chatId: `wa:${m.from}`, from: names[m.from] || m.from, text: m.text.body }); await whatsappSend(m.from, reply); });
    }
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true, store: store.constructor.name });
    if (req.method === 'GET' && url.pathname === '/webhook/whatsapp') {
      if (url.searchParams.get('hub.mode') === 'subscribe' && url.searchParams.get('hub.verify_token') === env.WHATSAPP_VERIFY_TOKEN) return send(res, 200, url.searchParams.get('hub.challenge') || '', 'text/plain');
      return send(res, 403, 'bad verify token', 'text/plain');
    }
    if (req.method === 'POST' && url.pathname === '/webhook/whatsapp') { const body = await readJson(req); send(res, 200, { ok: true }); return onWhatsApp(body); }
    if (req.method === 'POST' && url.pathname === '/webhook/telegram') {
      if (env.TELEGRAM_WEBHOOK_SECRET && req.headers['x-telegram-bot-api-secret-token'] !== env.TELEGRAM_WEBHOOK_SECRET) return send(res, 403, 'forbidden', 'text/plain');
      const body = await readJson(req); send(res, 200, { ok: true }); return onTelegram(body);
    }
    if (req.method === 'POST' && url.pathname === '/chat') {
      if (env.CHAT_SECRET && req.headers['x-chat-secret'] !== env.CHAT_SECRET) return send(res, 403, { error: 'forbidden' });
      const { chat = 'default', from = '', text = '' } = await readJson(req);
      const reply = await enqueue(`chat:${chat}`, () => planner.handle({ chatId: `chat:${chat}`, from, text }));
      return send(res, 200, { reply });
    }
    send(res, 404, { error: 'not found' });
  } catch (e) { console.error(e); if (!res.headersSent) send(res, 500, { error: String(e.message || e) }); }
});
server.listen(PORT, () => console.log(`trip bot listening on :${PORT} (${store.constructor.name})`));
