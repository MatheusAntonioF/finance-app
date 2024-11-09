import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const accounts = pgTable('accounts', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
    transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable('transactions', {
    id: text('id').primaryKey(),
    /**
     * we are using amount as an integer because double and float in
     * javascript does not have a good precision in terms of calculation
     * we could use decimal or numeric but it doesn't have support for all
     * languages
     *
     * solution:
     * create this field as an integer and multiply it by 1000 to save it
     * in the database
     * and when showing it to the user divide it by 1000
     *
     * e.g. $10.50 * 1000 => 10500 - 10500 / 1000 => 10.5
     */
    amount: integer('amount').notNull(),
    payee: text('payee').notNull(),
    notes: text('notes'),
    date: timestamp('date', { mode: 'date' }).notNull(),
    accountId: text('account_id')
        .references(() => accounts.id, {
            onDelete: 'cascade',
        })
        .notNull(),
    categoryId: text('category_id').references(() => categories.id, {
        onDelete: 'set null',
    }),
    creditCardId: text('credit_card_id').references(() => creditCards.id, {
        onDelete: 'set null',
    }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    categories: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
    creditCards: one(creditCards, {
        fields: [transactions.creditCardId],
        references: [creditCards.id],
    }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
});

export const creditCards = pgTable('credit-cards', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    accountId: text('account_id').notNull(),
    dueDate: timestamp('date', { mode: 'date' }).notNull(),
    bestDayToBuy: timestamp('date', { mode: 'date' }).notNull(),
});

export const insertCreditCardSchema = createInsertSchema(creditCards, {
    dueDate: z.coerce.date(),
    bestDayToBuy: z.coerce.date(),
});
