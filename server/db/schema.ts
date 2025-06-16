// server/db/schema.ts
import { pgTable, text, serial } from 'drizzle-orm/pg-core'

export const destinos = pgTable('destinos', {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    nome: text('nome').notNull(),
    descricao: text('descricao'),
  // outros campos podem ser adicionados aqui...
})

export type Destino = typeof destinos.$inferSelect
export type NovoDestino = typeof destinos.$inferInsert

export const schema = {
    destinos
}
