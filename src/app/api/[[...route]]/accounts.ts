import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';
import { db } from '@/db/drizzle';
import { accounts, insertAccountSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';

const app = new Hono()
    .get('/', clerkMiddleware(), async c => {
        const auth = getAuth(c);

        if (!auth?.userId) {
            throw new HTTPException(401, {
                res: c.json({ error: 'Unauthorized' }, 401),
            });
        }

        const data = await db
            .select({ id: accounts.id, name: accounts.name })
            .from(accounts)
            .where(eq(accounts.userId, auth.userId));
        return c.json({ data });
    })
    .post(
        '/',
        clerkMiddleware(),
        zValidator('json', insertAccountSchema.pick({ name: true })),
        async c => {
            const auth = getAuth(c);
            const values = c.req.valid('json');

            if (!auth?.userId) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const [data] = await db
                .insert(accounts)
                .values({
                    id: createId(),
                    userId: auth.userId,
                    name: values.name,
                })
                .returning();

            return c.json({ data });
        }
    );

export { app as accountsRoutes };