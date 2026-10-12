import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// Zod's prose comments mention a pure annotation token. Normalize documentation only;
// real /* @__PURE__ */ annotations remain intact so tree-shaking behaves normally.
const normalizeZodComments = {
  name: 'normalize-zod-doc-comments', enforce: 'pre',
  transform(code, id) {
    if (!/node_modules[\\/]zod[\\/]/.test(id)) return null;
    const normalized = code.replace(/\/\*\*[\s\S]*?\*\/|\/\/[^\n]*/g, comment => comment.replaceAll('@__PURE__', 'pure'));
    return normalized === code ? null : { code: normalized, map: null };
  },
};
export default defineConfig({ plugins: [normalizeZodComments, react(), tailwindcss()], server: { proxy: { '/api': 'http://127.0.0.1:3001' } } });
