import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { ScoringRuleConfig } from "@/lib/scoring";

export const leadStatus = pgEnum("lead_status", ["new", "contacted", "meeting_booked", "unsuitable", "closed"]);
export const ruleSetState = pgEnum("rule_set_state", ["draft", "active", "archived"]);

export const scoringRuleSets = pgTable("scoring_rule_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  version: integer("version").notNull(),
  state: ruleSetState("state").notNull().default("draft"),
  config: jsonb("config").$type<ScoringRuleConfig>().notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  publishedBy: text("published_by"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (table) => [
  uniqueIndex("scoring_rule_sets_version_unique").on(table.version),
  index("scoring_rule_sets_state_index").on(table.state),
]);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionToken: uuid("submission_token").notNull(),
  relation: text("relation").notNull(),
  fullName: text("full_name").notNull(),
  gymName: text("gym_name").notNull(),
  role: text("role").notNull(),
  members: text("members").notNull(),
  challenge: text("challenge").notNull(),
  phone: text("phone").notNull(),
  timeline: text("timeline"),
  score: integer("score").notNull(),
  qualified: boolean("qualified").notNull(),
  scoringRuleSetId: uuid("scoring_rule_set_id").notNull().references(() => scoringRuleSets.id),
  status: leadStatus("status").notNull().default("new"),
  statusChangedBy: text("status_changed_by"),
  statusChangedAt: timestamp("status_changed_at", { withTimezone: true }).defaultNow().notNull(),
  privacyPolicyVersion: text("privacy_policy_version").notNull(),
  consentAcceptedAt: timestamp("consent_accepted_at", { withTimezone: true }).notNull(),
  retentionDueAt: timestamp("retention_due_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("leads_submission_token_unique").on(table.submissionToken),
  index("leads_phone_index").on(table.phone),
  index("leads_status_created_at_index").on(table.status, table.createdAt),
]);

export const leadNotes = pgTable("lead_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("lead_notes_lead_id_created_at_index").on(table.leadId, table.createdAt)]);
