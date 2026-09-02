import assert from "node:assert/strict";
import test from "node:test";
import { isPlausibleCompletion, normalizeIranianPhone } from "../lib/form";
import { INITIAL_SCORING_RULES, parseScoringRules, scoreLead } from "../lib/scoring";

test("normalizes Iranian mobile numbers", () => {
  assert.equal(normalizeIranianPhone("0912 123 4567"), "+989121234567");
  assert.equal(normalizeIranianPhone("+989121234567"), "+989121234567");
  assert.equal(normalizeIranianPhone("۰۹۱۲۱۲۳۴۵۶۷"), "+989121234567");
  assert.equal(normalizeIranianPhone("02112345678"), null);
});

test("keeps the original qualification rules", () => {
  const qualifying = scoreLead({ relation: "باشگاه دارم", fullName: "علی رضایی", gymName: "اسپارتا", role: "مالک", members: "۱۵۰–۳۰۰", challenge: "پیگیری اعضا", phone: "+989121234567", timeline: "تا یک ماه آینده" }, INITIAL_SCORING_RULES);
  assert.deepEqual(qualifying, { score: 100, qualified: true });
  const nonQualifying = scoreLead({ relation: "باشگاه دارم", fullName: "علی رضایی", gymName: "اسپارتا", role: "مالک", members: "۱۵۰–۳۰۰", challenge: "پیگیری اعضا", phone: "+989121234567" }, INITIAL_SCORING_RULES);
  assert.equal(nonQualifying.qualified, false);
});

test("rejects impossible scoring configurations", () => {
  assert.throws(() => parseScoringRules({ ...INITIAL_SCORING_RULES, minimumScore: 101 }));
});

test("requires a plausible completion time", () => {
  const now = Date.now();
  assert.equal(isPlausibleCompletion(new Date(now - 3_000).toISOString(), now), true);
  assert.equal(isPlausibleCompletion(new Date(now - 500).toISOString(), now), false);
});
