import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { inquirySchema } from '../../shared/inquirySchema.js';
export function createApp({ storageDir = path.resolve(process.env.LEAD_STORAGE_DIR || './data'), webhookUrl = process.env.LEAD_WEBHOOK_URL, webhookToken = process.env.LEAD_WEBHOOK_TOKEN, production = process.env.NODE_ENV === 'production' } = {}) {
 const app = express(); app.disable('x-powered-by');
 if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1);
 app.use(helmet({ contentSecurityPolicy: production ? { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], fontSrc: ["'self'", 'https://fonts.gstatic.com'], imgSrc: ["'self'", 'data:'], connectSrc: ["'self'"], upgradeInsecureRequests: [] } } : false }));
 app.use(express.json({ limit: '16kb' }));
 app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
 const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'Too many inquiries. Please try again in 15 minutes.' } });
 app.post('/api/advertiser-inquiries', limiter, async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ message: 'Please check your inquiry fields.', errors: parsed.error.flatten().fieldErrors });
  const key = req.get('Idempotency-Key'); if (!key || !/^[0-9a-f-]{36}$/i.test(key)) return res.status(400).json({ message: 'A valid submission key is required.' });
  const { websiteConfirm, ...data } = parsed.data;
  const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  const file = path.join(storageDir, `${key}.json`); const id = randomUUID(); const record = { id, receivedAt: new Date().toISOString(), fingerprint, ...data };
  try {
   await mkdir(storageDir, { recursive: true, mode: 0o700 });
   try { await writeFile(file, JSON.stringify(record, null, 2), { flag: 'wx', mode: 0o600, flush: true }); }
   catch (error) { if (error.code !== 'EEXIST') throw error; const prior = JSON.parse(await readFile(file, 'utf8')); if (prior.fingerprint !== fingerprint) return res.status(409).json({ message: 'This submission key was already used. Please refresh and try again.' }); return res.status(200).json({ accepted: true, id: prior.id }); }
   if (webhookUrl) {
    try { if (new URL(webhookUrl).protocol !== 'https:') throw new Error('HTTPS required'); const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': id, ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}) }, body: JSON.stringify(record), signal: AbortSignal.timeout(8000) }); if (!response.ok) throw new Error('Webhook rejected'); }
    catch { await writeFile(path.join(storageDir, `${key}.pending.json`), JSON.stringify({ id, createdAt: record.receivedAt, recordFile: `${key}.json` }), { mode: 0o600, flush: true }); console.error('CRM delivery pending for saved inquiry', id); }
   }
   return res.status(201).json({ accepted: true, id });
  } catch { console.error('Inquiry storage error; inspect server storage permissions.'); return res.status(503).json({ message: 'Your inquiry could not be accepted at this time. Please retry shortly.' }); }
 });
 if (production) { const dist = path.resolve('../frontend/dist'); app.use(express.static(dist)); app.get('/{*route}', (req, res) => res.sendFile(path.join(dist, 'index.html'))); }
 app.use((error, req, res, next) => { res.status(error.status === 413 ? 413 : 400).json({ message: 'The request could not be processed. Please check your input.' }); });
 return app;
}
