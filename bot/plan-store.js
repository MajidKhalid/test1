// The shared plan is one JSON file in the site's repository: tunis-trip/plan.json.
// GitHub Pages serves it next to the site; the site pulls it on load and whenever it comes back to the foreground.
import { readFile, writeFile } from 'node:fs/promises';

const API = 'https://api.github.com';

export class GitHubStore {
  constructor({ token, repo, branch = 'main', planPath = 'tunis-trip/plan.json', dataPath = 'tunis-trip/data.js' }) {
    if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPO are required');
    Object.assign(this, { token, repo, branch, planPath, dataPath });
  }
  headers(extra = {}) { return { authorization: `Bearer ${this.token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'tunisia-trip-bot', ...extra }; }
  async file(path) {
    const r = await fetch(`${API}/repos/${this.repo}/contents/${path}?ref=${encodeURIComponent(this.branch)}`, { headers: this.headers() });
    if (r.status === 404) return { text: null, sha: null };
    if (!r.ok) throw new Error(`GitHub read ${path}: ${r.status} ${await r.text()}`);
    const j = await r.json();
    return { text: Buffer.from(j.content, 'base64').toString('utf8'), sha: j.sha };
  }
  async readData() { const { text } = await this.file(this.dataPath); if (!text) throw new Error(`${this.dataPath} not found in ${this.repo}@${this.branch}`); return text; }
  async readPlan() { const { text, sha } = await this.file(this.planPath); return { plan: text ? JSON.parse(text) : null, sha }; }
  async writePlan(plan, sha, message) {
    const body = { message, branch: this.branch, content: Buffer.from(JSON.stringify(plan, null, 2) + '\n').toString('base64') };
    if (sha) body.sha = sha;
    const r = await fetch(`${API}/repos/${this.repo}/contents/${this.planPath}`, { method: 'PUT', headers: this.headers({ 'content-type': 'application/json' }), body: JSON.stringify(body) });
    if (r.status === 409 || r.status === 422) { // someone else wrote in between: re-read and retry once
      const { sha: fresh } = await this.file(this.planPath);
      if (fresh && fresh !== sha) return this.writePlan(plan, fresh, message);
    }
    if (!r.ok) throw new Error(`GitHub write ${this.planPath}: ${r.status} ${await r.text()}`);
    const j = await r.json();
    return j.content.sha;
  }
}

// Local files, for development and tests: reads/writes the checkout directly.
export class FileStore {
  constructor({ planPath, dataPath }) { Object.assign(this, { planPath, dataPath }); }
  async readData() { return readFile(this.dataPath, 'utf8'); }
  async readPlan() { try { return { plan: JSON.parse(await readFile(this.planPath, 'utf8')), sha: null }; } catch (e) { if (e.code === 'ENOENT') return { plan: null, sha: null }; throw e; } }
  async writePlan(plan) { await writeFile(this.planPath, JSON.stringify(plan, null, 2) + '\n'); return null; }
}
