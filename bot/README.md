# Trip-planner bot

A small Node service that lives in the family chat, understands messages like *"add El Jem on Wednesday afternoon"*, *"we'll sleep in Hammamet three nights instead"* or *"what's the plan for Sunday?"*, edits the shared plan with Claude, and publishes it to the site. Every phone that opens https://majidkhalid.github.io/test1/tunis-trip/ picks the change up within seconds (the site pulls `plan.json` on load and whenever it comes back to the foreground, and shows "Plan updated by the trip bot").

```
chat message ──▶ bot (Claude + tools) ──▶ commit tunis-trip/plan.json ──▶ GitHub Pages ──▶ every phone
```

The bot uses the same `data.js` as the site, so it knows the 130 places, the stay options, the cars, the route model and the fixed facts (flights, the booked Carthage home). It cannot change what is booked.

## Channels

| Channel | Works in a group? | Setup effort | Notes |
|---|---|---|---|
| **Telegram bot** | Yes | 10 min | Create a bot with @BotFather, add it to the family group, disable *Group Privacy* in BotFather so it sees every message (or leave it on and address it with `/plan …`). Recommended. |
| **WhatsApp Cloud API** (Meta) | No, 1:1 only | 1–2 h | The official API cannot join or read WhatsApp groups. The bot gets its own number; family members message it directly, and everything it changes is still visible to everyone on the site. Needs a Meta developer account, a business app, and a phone number for the bot. |
| **WhatsApp bridge** (unofficial, e.g. a WhatsApp Web client) | Yes | varies | Against WhatsApp's terms, can get the number banned. Not included here; such a bridge can call `POST /chat` on this service. |

## Run it

Node 20 or newer.

```bash
cd bot
npm install
cp .env.example .env   # fill in the values
npm start              # listens on :8787
```

Put it anywhere that keeps a Node process running with a public HTTPS address: Railway, Render, Fly.io, a small VPS. Free tiers are fine for a family group.

### Environment variables

| Variable | Required | What it is |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Claude API key (console.anthropic.com). |
| `GITHUB_TOKEN` | yes | Fine-grained personal access token with **Contents: read and write** on `MajidKhalid/test1` only. The bot commits `tunis-trip/plan.json` with it. Without it the bot falls back to writing the local checkout (development only). |
| `GITHUB_REPO`, `GITHUB_BRANCH` | no | Default `MajidKhalid/test1`, `main`. |
| `SITE_URL` | no | Link the bot appends after a change. |
| `TELEGRAM_BOT_TOKEN` | for Telegram | From @BotFather. Register the webhook once: `curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<your-host>/webhook/telegram"`. |
| `TELEGRAM_ALLOWED_CHATS` | no | Comma-separated chat ids the bot answers in. |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WHATSAPP_VERIFY_TOKEN` | for WhatsApp | From the Meta app's WhatsApp settings. Webhook URL: `https://<your-host>/webhook/whatsapp`, subscribe to `messages`. |
| `WHATSAPP_ALLOWED_NUMBERS` | no | Comma-separated numbers (no `+`) the bot answers. |
| `CHAT_SECRET` | no | Shared secret for `POST /chat`. |
| `CLAUDE_MODEL` | no | Default `claude-opus-5`. |

### Endpoints

- `GET /health`
- `POST /webhook/telegram` — Telegram updates.
- `GET|POST /webhook/whatsapp` — Meta verification and message webhooks.
- `POST /chat` `{ "chat": "family", "from": "Majid", "text": "…" }` → `{ "reply": "…" }` — for bridges and for trying it out:

```bash
curl -s localhost:8787/chat -H 'content-type: application/json' -H "x-chat-secret: $CHAT_SECRET" \
  -d '{"chat":"test","from":"Majid","text":"What is the plan for Sunday?"}'
```

## What it can do

Read the plan (`get_plan`), search the catalogue (`find_places`), add / remove / move places between days and times of day, clear a day, change the route (which base each night; days whose base changes get that base's default plan, the rest keep their picks), list and choose stays, add a stay someone shared in the group (name + link), choose the car. Booked stays and the flights are locked.

Messages in one chat are handled one at a time, webhook retries are de-duplicated, and each publish is one commit to `tunis-trip/plan.json` (the file carries a short log of who asked for what).

## Tests

```bash
npm test
```

The tests exercise the tools and the route logic against the real `data.js` without calling Claude.
