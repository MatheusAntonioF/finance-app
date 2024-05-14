import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { accountsRoutes } from './accounts';
import { categoriesRoutes } from './categories';

import { HTTPException } from 'hono/http-exception';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app.onError((error, c) => {
    if (error instanceof HTTPException) {
        return error.getResponse();
    }

    return c.json({ error: 'Internal error' }, 500);
});

const routes = app
    .route('/accounts', accountsRoutes)
    .route('/categories', categoriesRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
