CREATE TABLE "role" (
	"id" bigint PRIMARY KEY,
	"code" text NOT NULL CONSTRAINT "unique_code" UNIQUE,
	"name" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_role_mapping" (
	"user_id" bigint,
	"role_id" bigint,
	CONSTRAINT "user_role_mapping_pkey" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" bigint PRIMARY KEY,
	"username" text NOT NULL,
	"phone" text NOT NULL CONSTRAINT "unique_phone" UNIQUE,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"avatar" text,
	"registered_at" timestamp with time zone NOT NULL,
	"updated_by" text,
	"updated_by_id" bigint,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_role_mapping" ADD CONSTRAINT "user_role_mapping_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "user_role_mapping" ADD CONSTRAINT "user_role_mapping_role_id_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id");