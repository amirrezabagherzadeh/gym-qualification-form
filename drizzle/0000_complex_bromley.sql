CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'meeting_booked', 'unsuitable', 'closed');--> statement-breakpoint
CREATE TYPE "public"."rule_set_state" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"body" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_token" uuid NOT NULL,
	"relation" text NOT NULL,
	"full_name" text NOT NULL,
	"gym_name" text NOT NULL,
	"role" text NOT NULL,
	"members" text NOT NULL,
	"challenge" text NOT NULL,
	"phone" text NOT NULL,
	"timeline" text,
	"score" integer NOT NULL,
	"qualified" boolean NOT NULL,
	"scoring_rule_set_id" uuid NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"status_changed_by" text,
	"status_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"privacy_policy_version" text NOT NULL,
	"consent_accepted_at" timestamp with time zone NOT NULL,
	"retention_due_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoring_rule_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL,
	"state" "rule_set_state" DEFAULT 'draft' NOT NULL,
	"config" jsonb NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_by" text,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_scoring_rule_set_id_scoring_rule_sets_id_fk" FOREIGN KEY ("scoring_rule_set_id") REFERENCES "public"."scoring_rule_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_notes_lead_id_created_at_index" ON "lead_notes" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "leads_submission_token_unique" ON "leads" USING btree ("submission_token");--> statement-breakpoint
CREATE INDEX "leads_phone_index" ON "leads" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "leads_status_created_at_index" ON "leads" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "scoring_rule_sets_version_unique" ON "scoring_rule_sets" USING btree ("version");--> statement-breakpoint
CREATE INDEX "scoring_rule_sets_state_index" ON "scoring_rule_sets" USING btree ("state");
--> statement-breakpoint
CREATE UNIQUE INDEX "scoring_rule_sets_one_active" ON "scoring_rule_sets" USING btree ("state") WHERE "state" = 'active';
--> statement-breakpoint
INSERT INTO "scoring_rule_sets" ("version", "state", "config", "published_at") VALUES (
  1,
  'active',
  '{"points":{"relation":{"باشگاه دارم":20,"مدیر باشگاه هستم":20,"مربی هستم":0,"قصد راه‌اندازی باشگاه دارم":0},"role":{"مالک":30,"مدیر":30,"مربی":0,"مسئول فروش":0,"سایر":0},"members":{"زیر ۵۰":0,"۵۰–۱۵۰":25,"۱۵۰–۳۰۰":25,"۳۰۰–۵۰۰":25,"بالای ۵۰۰":25},"challenge":{"جذب عضو جدید":0,"تمدید اعضا":5,"ریزش اعضا":5,"برنامه تمرینی":5,"پیگیری اعضا":5,"مدیریت مربیان":0},"timeline":{"هرچه سریع‌تر":20,"تا یک ماه آینده":20,"۱ تا ۳ ماه آینده":20,"فعلاً فقط در حال بررسی هستم":0}},"minimumScore":75,"requiredAnswers":{"role":["مالک","مدیر"],"members":["۵۰–۱۵۰","۱۵۰–۳۰۰","۳۰۰–۵۰۰","بالای ۵۰۰"],"timeline":["هرچه سریع‌تر","تا یک ماه آینده","۱ تا ۳ ماه آینده"]}}'::jsonb,
  now()
);
