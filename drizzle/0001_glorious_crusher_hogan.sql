CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid DEFAULT auth.uid() NOT NULL,
	"content" text,
	"is_shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_notes_owner" ON "notes" USING btree ("owner_id" uuid_ops);--> statement-breakpoint
CREATE POLICY "notes_select" ON "notes" AS PERMISSIVE FOR SELECT TO public USING ((auth.uid() = owner_id) OR (is_shared = true));--> statement-breakpoint
CREATE POLICY "notes_insert" ON "notes" AS PERMISSIVE FOR INSERT TO public WITH CHECK (auth.uid() = owner_id);--> statement-breakpoint
CREATE POLICY "notes_update" ON "notes" AS PERMISSIVE FOR UPDATE TO public USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);--> statement-breakpoint
CREATE POLICY "notes_delete" ON "notes" AS PERMISSIVE FOR DELETE TO public USING (auth.uid() = owner_id);