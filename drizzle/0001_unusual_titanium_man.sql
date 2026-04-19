CREATE TABLE "note_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid NOT NULL,
	"shared_with_user_id" text NOT NULL,
	"permission" text DEFAULT 'read' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "note_shares" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text DEFAULT (auth.user_id()) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "note_shares" ADD CONSTRAINT "note_shares_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "note_shares" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "note_shares"."shared_with_user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "note_shares" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((EXISTS (SELECT 1 FROM notes WHERE notes.id = "note_shares"."note_id" AND notes.owner_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "note_shares" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS (SELECT 1 FROM notes WHERE notes.id = "note_shares"."note_id" AND notes.owner_id = auth.uid()))) WITH CHECK ((EXISTS (SELECT 1 FROM notes WHERE notes.id = "note_shares"."note_id" AND notes.owner_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "note_shares" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((EXISTS (SELECT 1 FROM notes WHERE notes.id = "note_shares"."note_id" AND notes.owner_id = auth.uid())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "notes"."owner_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "notes"."owner_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "notes"."owner_id")) WITH CHECK ((select auth.user_id() = "notes"."owner_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "notes"."owner_id"));