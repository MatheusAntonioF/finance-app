import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { accountsRoutes } from './accounts';
import { HTTPException } from 'hono/http-exception';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.onError((error, c) => {
    if (error instanceof HTTPException) {
        return error.getResponse();
    }

    return c.json({ error: 'Internal error' }, 500);
});

const routes = app.route('/accounts', accountsRoutes);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
