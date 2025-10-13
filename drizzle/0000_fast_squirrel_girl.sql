CREATE TABLE "destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"summary" text NOT NULL,
	"image" text NOT NULL,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"state" text DEFAULT 'RJ' NOT NULL,
	"category_id" integer,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"price" numeric(10, 2),
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "destinations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "destinations_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "destinations_categories_relation" (
	"id" serial PRIMARY KEY NOT NULL,
	"destination_id" integer,
	"destination_category_id" integer
);
--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_category_id_destinations_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."destinations_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destinations_categories_relation" ADD CONSTRAINT "destinations_categories_relation_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destinations_categories_relation" ADD CONSTRAINT "destinations_categories_relation_destination_category_id_destinations_categories_id_fk" FOREIGN KEY ("destination_category_id") REFERENCES "public"."destinations_categories"("id") ON DELETE no action ON UPDATE no action;