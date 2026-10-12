import { z } from 'zod';
export const verticalOptions = ['Home Improvement', 'SSDI', 'Home Security', 'Multiple Verticals'];
export const capacityOptions = ['1–50 Calls', '51–100 Calls', '101–500 Calls', '500+ Calls'];
const text = (label, max = 120) => z.string().trim().min(2, `${label} must contain at least 2 characters.`).max(max, `${label} is too long.`).refine(v => !/[\u0000-\u001f<>]/.test(v), 'Please use plain text.');
export const inquirySchema = z.object({
  fullName: text('Full name'), email: z.email('Enter a valid business email address.').max(254),
  company: text('Company name'), phone: z.string().trim().regex(/^[+\d\s().-]+$/, 'Enter a valid phone number.').refine(v => { const n = v.replace(/\D/g, '').length; return n >= 10 && n <= 15; }, 'Use 10–15 digits, including your country code.'),
  vertical: z.enum(verticalOptions, { error: 'Select an interested vertical.' }),
  capacity: z.enum(capacityOptions, { error: 'Select your daily call capacity.' }),
  website: z.string().trim().max(500).refine(v => { if (!v) return true; try { return ['https:', 'http:'].includes(new URL(v).protocol); } catch { return false; } }, 'Enter a full URL, such as https://yourcompany.com.').optional().default(''),
  message: z.string().trim().max(3000, 'Keep your message under 3,000 characters.').refine(v => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f<>]/.test(v), 'Please use plain text.').optional().default(''),
  websiteConfirm: z.string().max(0, 'Unable to submit this inquiry.').optional().default(''),
});
