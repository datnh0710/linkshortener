import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
    originalUrl: varchar('original_url', { length: 2048 }).notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    clicks: integer('clicks').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type NewLink = typeof links.$inferInsert;
export type LinkSelect = typeof links.$inferSelect;
