CREATE TABLE "destinations_images" (
	"url" varchar(200) NOT NULL,
	"destination_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "destinations" DROP CONSTRAINT "destinations_category_id_destinations_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "destinations_categories" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "destinations_categories_relation" ALTER COLUMN "destination_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "destinations_categories_relation" ALTER COLUMN "destination_category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "destinations_images" ADD CONSTRAINT "destinations_images_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destinations" DROP COLUMN "category_id";