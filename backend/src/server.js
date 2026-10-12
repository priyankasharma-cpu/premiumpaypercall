import { createApp } from './app.js';
const port = Number(process.env.PORT) || 3001;
createApp().listen(port, '127.0.0.1', () => console.log(`Inquiry server listening on http://127.0.0.1:${port}`));
