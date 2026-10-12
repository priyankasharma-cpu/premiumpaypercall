import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createApp } from './app.js';
const data = { fullName: 'Test Buyer', email: 'buyer@example.com', company: 'Test Company', phone: '+1 (555) 000-0000', vertical: 'SSDI', capacity: '51–100 Calls', website: '', message: '', websiteConfirm: '' };
test('Lead endpoint validates, persists, deduplicates, and rejects changed payloads', async () => {
 const storageDir = await mkdtemp(path.join(tmpdir(), 'pppc-test-')); const server = createApp({ storageDir, production: false }).listen(0); await new Promise(r => server.once('listening', r)); const url = `http://127.0.0.1:${server.address().port}/api/advertiser-inquiries`; const key = randomUUID();
 const send = (body, id = key) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': id }, body: JSON.stringify(body) });
 try { assert.equal((await send({ ...data, email: 'bad' })).status, 400); assert.equal((await send({ ...data, website: 'javascript:alert(1)' })).status, 400); assert.equal((await send({ ...data, websiteConfirm: 'spam' })).status, 400); const accepted = await send(data); assert.equal(accepted.status, 201); const first = await accepted.json(); assert.equal(first.accepted, true); const duplicate = await send(data); assert.equal(duplicate.status, 200); assert.equal((await duplicate.json()).id, first.id); assert.equal((await readdir(storageDir)).length, 1); assert.equal((await send({ ...data, company: 'Changed Company' })).status, 409); } finally { await new Promise(r => server.close(r)); await rm(storageDir, { recursive: true, force: true }); }
});
test('Unwritable storage never acknowledges success', async () => { const app = createApp({ storageDir: path.join(import.meta.dirname, 'app.js', 'impossible'), production: false }); const server = app.listen(0); await new Promise(r => server.once('listening', r)); try { const response = await fetch(`http://127.0.0.1:${server.address().port}/api/advertiser-inquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': randomUUID() }, body: JSON.stringify(data) }); assert.equal(response.status, 503); assert.notEqual((await response.json()).accepted, true); } finally { await new Promise(r => server.close(r)); } });
