// server/db/schema.ts
import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core'

export const destinos = pgTable('destinos', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  resumo: text('resumo'),
  imagem: text('imagem'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Destino = typeof destinos.$inferSelect
export type NovoDestino = typeof destinos.$inferInsert


