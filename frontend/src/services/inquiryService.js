export async function submitInquiry(data, key) {
 const response = await fetch(import.meta.env.VITE_LEAD_API_URL || '/api/advertiser-inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
 let result; try { result = await response.json(); } catch { throw new Error('The inquiry service is unavailable. Please try again later.'); }
 if (!response.ok || result.accepted !== true || !result.id) throw new Error(result.message || 'Your inquiry could not be accepted. Please try again.');
 return result;
}
