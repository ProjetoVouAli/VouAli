import { relations } from 'drizzle-orm';
import { pgTable, varchar, text, serial, timestamp, decimal, integer, boolean, PgTable, foreignKey } from 'drizzle-orm/pg-core'



export const destinations = pgTable('destinations', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  summary: text('summary').notNull(),
  neighborhood: text('neighborhood').notNull(),
  city: text('city').notNull(),
  state: text('state').default('RJ').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const destinationsRelations = relations(destinations, ({ many }) => ({
  categoriesRelations: many(destinationsCategoriesRelation),
  images: many(destinationsImages), 
}));

export const destinationsImages = pgTable('destinations_images', {
  id: serial('id').primaryKey(),
  url: varchar({length: 200}).notNull(),
  destinationId: integer('destination_id').notNull().references(() => destinations.id)
})

export const destinationsCategoriesRelation = pgTable('destinations_categories_relation', {
  id: serial('id').primaryKey(),
  destinationId: integer('destination_id').notNull().references(() => destinations.id),
  destinationCategoryId: integer('destination_category_id').notNull().references(() => destinationsCategories.id),
});

export const destinationsCategories = pgTable('destinations_categories',{
	id: serial('id').primaryKey(),
	name: varchar({length: 20}).notNull(),
});

export const destinationsCategoriesRelationRelations = relations(destinationsCategoriesRelation, ({ one }) => ({
  destination: one(destinations, {
    fields: [destinationsCategoriesRelation.destinationId],
    references: [destinations.id],
  }),
  category: one(destinationsCategories, {
    fields: [destinationsCategoriesRelation.destinationCategoryId],
    references: [destinationsCategories.id],
  }),
}));

export const destinationsCategoriesRelations = relations(destinationsCategories, ({ many }) => ({
  destinationRelations: many(destinationsCategoriesRelation),
}));

export const destinationsImagesRelations = relations(destinationsImages, ({ one }) => ({
  destination: one(destinations, {
    fields: [destinationsImages.destinationId],
    references: [destinations.id],
  }),
}));

export type DestinationSelect = typeof destinations.$inferSelect
export type DestinationInsert = typeof destinations.$inferInsert            

export type DestinationsImagesSelect = typeof destinationsImages.$inferSelect;