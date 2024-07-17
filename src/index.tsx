import { Hono } from 'hono';
import { githubtrending } from './routes/github/trending';
const app = new Hono();

app.get('/rss/github/trending', ...githubtrending);

app.get('*', (c) => c.text(Date.now().toString()));

export default app;
