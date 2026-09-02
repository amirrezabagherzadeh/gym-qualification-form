<div align="center">

# Gym Qualification Form

<p>A focused lead-qualification experience for gym operators—designed to turn a short conversation into a prioritized, actionable sales opportunity.</p>

<p>
  <a href="https://gym.amirrezabz.com"><img alt="Live product" src="https://img.shields.io/badge/Live_Product-Vercel-166534?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=next.js&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="PostgreSQL with Neon" src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white">
</p>

</div>

<br>

## Product at a glance

Gym Qualification Form is a Persian, right-to-left intake experience for fitness businesses. It replaces a long generic contact form with a concise, step-by-step flow that collects the context needed to assess intent, score the lead, and route it into a secure sales workflow.

<table>
  <tr>
    <td align="center" width="33%"><b>For prospects</b><br><br>A calm, mobile-first flow with one clear decision at a time.<br><sub>Low effort · clear progress · immediate confirmation</sub></td>
    <td align="center" width="33%"><b>For sales teams</b><br><br>Prioritized leads with context, qualification outcome, and follow-up status.<br><sub>Less triage · faster response · better focus</sub></td>
    <td align="center" width="33%"><b>For operators</b><br><br>Versioned scoring rules that can evolve without a product deployment.<br><sub>Auditable decisions · controlled iteration</sub></td>
  </tr>
</table>

## Experience map

<table>
  <tr>
    <td align="center">01<br><b>Orient</b><br><sub>Understand the purpose and time commitment</sub></td>
    <td align="center">→</td>
    <td align="center">02<br><b>Answer</b><br><sub>Complete eight focused prompts</sub></td>
    <td align="center">→</td>
    <td align="center">03<br><b>Evaluate</b><br><sub>Validate, deduplicate, and score the response</sub></td>
    <td align="center">→</td>
    <td align="center">04<br><b>Act</b><br><sub>Review and progress the lead in the admin workspace</sub></td>
  </tr>
</table>

<br>

## UI/UX rationale

### Public qualification flow

The public form is designed around a single principle: **make the next action obvious**. Instead of exposing every question at once, it presents one prompt per screen. This keeps the user’s attention on the decision in front of them and makes a meaningful qualification sequence feel lightweight.

<table>
  <tr>
    <td width="58%">
      <b>Visual direction</b><br><br>
      The interface combines a warm, low-contrast background with a crisp off-white content card. Deep forest green anchors primary actions and progress, while soft lime and terracotta accents communicate positive states and optionality. Persian Kalameh typography, generous spacing, and a true RTL layout make the experience feel native rather than translated.
    </td>
    <td width="42%">
      <pre><code>QUALIFICATION

Assess the fit for your gym's
intelligent system

━━━━━━●━━━━━━  Question 3 of 8

What is your biggest challenge?

┌──────────────────────────┐
│  Attracting new members ○ │
├──────────────────────────┤
│  Gym operations         ○ │
└──────────────────────────┘</code></pre>
    </td>
  </tr>
</table>

<table>
  <tr><th>Design decision</th><th>Why it matters</th><th>Outcome</th></tr>
  <tr><td>One question per view</td><td>Reduces cognitive load and visual scanning.</td><td>The flow feels short, focused, and approachable.</td></tr>
  <tr><td>Persistent progress feedback</td><td>Users can see their position and remaining effort.</td><td>Greater confidence to continue through the form.</td></tr>
  <tr><td>Large selectable options</td><td>Supports quick, comfortable touch interaction.</td><td>Fast completion on mobile without precision tapping.</td></tr>
  <tr><td>Advance after a selection</td><td>Removes a redundant confirmation step for choice fields.</td><td>A more natural, conversational pace.</td></tr>
  <tr><td>Clear required and optional states</td><td>Sets expectations before the user attempts to continue.</td><td>Fewer validation surprises and less friction.</td></tr>
  <tr><td>Focused completion state</td><td>Provides a definite end to the interaction.</td><td>The prospect knows their request was received.</td></tr>
</table>

### Admin workspace

The admin experience is optimized for operational clarity rather than visual novelty. A fixed, minimal navigation rail keeps the two core jobs—**leads** and **scoring rules**—available at all times. The lead list is intentionally table-based: it makes comparison, filtering, and rapid scanning easier for a sales workflow than a card feed.

<table>
  <tr>
    <td align="center" width="25%">🧭<br><b>Clear hierarchy</b><br><sub>A single navigation rail for the operational areas</sub></td>
    <td align="center" width="25%">🔎<br><b>Fast retrieval</b><br><sub>Search, status, result, role, date, and sorting controls</sub></td>
    <td align="center" width="25%">🏷️<br><b>Visible progress</b><br><sub>Lead status moves from new to closed or unsuitable</sub></td>
    <td align="center" width="25%">⬇️<br><b>Portable data</b><br><sub>Filtered CSV and Excel exports for downstream work</sub></td>
  </tr>
</table>

## Information architecture

<table>
  <tr><th>Area</th><th>Primary user need</th><th>Key capabilities</th></tr>
  <tr><td><code>/</code></td><td>Request an assessment</td><td>Eight-step form, progress feedback, input validation, confirmation state</td></tr>
  <tr><td><code>/privacy</code></td><td>Understand data handling</td><td>Dedicated privacy information</td></tr>
  <tr><td><code>/admin/leads</code></td><td>Prioritize and progress opportunities</td><td>Search, filters, score, qualification result, status, detail views, exports</td></tr>
  <tr><td><code>/admin/leads/[id]</code></td><td>Prepare a meaningful follow-up</td><td>Full answer set, score, status management, notes, related context</td></tr>
  <tr><td><code>/admin/rules</code></td><td>Improve qualification quality</td><td>Draft, edit, publish, and review scoring-rule versions</td></tr>
</table>

## Responsive behavior

The public flow is mobile-first, because qualification often begins on a phone. The primary card scales within a constrained reading width; action buttons become full width on small screens; inputs and choices maintain comfortable touch targets.

The admin workspace adapts differently. On desktop, its sidebar and data table support high-density review. Below the tablet breakpoint, the layout becomes single-column, navigation becomes horizontally accessible, filters stack, and table content remains scrollable instead of sacrificing important operational data.

## Scoring workflow

Scoring is deliberately separated from the form interface. A manager creates a draft from the active rule set, updates option weights and the qualification threshold, then publishes a new version. Each submitted lead records the rule-set version that evaluated it, preserving context for future analysis.

<pre><code>Active rules ──→ validate answers ──→ calculate score + qualification ──→ actionable lead
     │
     └──→ create draft ──→ adjust weights / threshold ──→ publish next version</code></pre>

## System architecture

<table>
  <tr>
    <td align="center">👤<br><b>Prospect</b><br><sub>Next.js form</sub></td>
    <td align="center">→</td>
    <td align="center">🛡️<br><b>API layer</b><br><sub>Zod · BotID · request limits</sub></td>
    <td align="center">→</td>
    <td align="center">🧮<br><b>Scoring engine</b><br><sub>Active rule set</sub></td>
    <td align="center">→</td>
    <td align="center">🗄️<br><b>Data layer</b><br><sub>Neon Postgres · Drizzle</sub></td>
    <td align="center">→</td>
    <td align="center">🧑‍💼<br><b>Admin</b><br><sub>Clerk-protected workspace</sub></td>
  </tr>
</table>

<ul>
  <li><b>Next.js 16 and React 19:</b> the application interface and server route handlers.</li>
  <li><b>Neon Postgres and Drizzle ORM:</b> leads, notes, and versioned scoring rules.</li>
  <li><b>Clerk:</b> authentication and role-based access to the admin workspace.</li>
  <li><b>Vercel BotID:</b> bot detection for requests handled on Vercel.</li>
  <li><b>Vercel Cron:</b> daily retention processing for closed and unsuitable leads.</li>
</ul>

## Trust, privacy, and resilience

<table>
  <tr><th>Control</th><th>Purpose</th></tr>
  <tr><td>Zod validation and Iranian mobile normalization</td><td>Store consistent, valid data before it enters the workflow.</td></tr>
  <tr><td>Unique submission token</td><td>Provide idempotent submissions; repeated sends do not create duplicate records.</td></tr>
  <tr><td>Per-phone rate limit</td><td>Allow at most three submissions per phone number in 24 hours.</td></tr>
  <tr><td>Honeypot, plausible-completion check, and BotID</td><td>Reduce automated and suspicious form activity.</td></tr>
  <tr><td>Privacy-policy version and consent timestamp</td><td>Retain the policy context associated with every stored lead.</td></tr>
  <tr><td>Versioned scoring rules</td><td>Make qualification decisions traceable and explainable over time.</td></tr>
</table>

## Local development

<ol>
  <li>Install Node.js 24 and the Vercel CLI.</li>
  <li>Pull the connected project’s environment variables:
    <pre><code>vercel env pull .env.local --yes</code></pre>
  </li>
  <li>Set <code>NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL</code> and <code>CRON_SECRET</code>. If there is a scheduling destination, also set <code>NEXT_PUBLIC_BOOKING_URL</code>.</li>
  <li>Run the initial database migration:
    <pre><code>npm run db:migrate:local</code></pre>
  </li>
  <li>Start the development server:
    <pre><code>npm run dev</code></pre>
  </li>
</ol>

## Quality checks

<pre><code>npm run lint
npm run typecheck
npm test
npm run build</code></pre>

Before a production launch, verify the production Neon connection, Clerk production settings, the initial admin account, privacy contact email, custom domain, and <code>CRON_SECRET</code>. Preview and development deployments should use a database that is separate from real customer data.

<hr>

<p align="center"><sub>Designed to transform early conversations into clear, prioritized sales opportunities.</sub></p>
