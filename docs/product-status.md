# Product Status and Direction

This document owns the product vision, current maturity, durable user expectations, release gates, and delivery direction for The Word per Minute. It is a living product guide rather than a record of individual releases or implementation details.

Release history lives in [`CHANGELOG.md`](../CHANGELOG.md). Technical structure lives in [`architecture.md`](architecture.md). Data ownership and lifecycle details live in [`data-and-security.md`](data-and-security.md).

## Product Vision

The Word per Minute is a scripture-first typing practice app. Typing is used as a way to slow down, pay attention to a passage, and return to it later through saved passages, practice history, and reflections.

The product should feel like a quiet reading and practice space rather than a competitive typing dashboard. Speed and accuracy remain useful feedback, but they should support engagement with the passage instead of becoming the entire purpose of the experience.

## Current Phase

The project is currently in public alpha and is available at [thewordperminute.com](https://thewordperminute.com/).

Public alpha means the core experience is functional and open for real use, but important account, privacy, reliability, and release-safety work remains. Features and data contracts may still change before beta, and the product should not yet be treated as a stable `1.0.0` release.

The exact current release and previous changes are tracked in [`CHANGELOG.md`](../CHANGELOG.md).

## Current Capabilities

- Discover curated passages through broad scripture themes.
- Read locally bundled World English Bible chapters and select verse ranges.
- Practise featured or saved passages through one continuous, keyboard-focused typing surface.
- Receive live WPM, accuracy, progress, and completion feedback.
- Save passages in the current browser as a guest.
- Sync saved passages through a signed-in Supabase account.
- Manage saved passages in Library and reopen them in their original Bible context.
- Store signed-in practice attempts and optional reflections, and calculate account progress summaries.
- Review paginated account practice history and all-time progress.
- Use the interface in light or dark mode on a desktop-focused responsive layout.

## Product Principles

### Scripture first

The passage should remain the visual and conceptual focus. Metrics, setup controls, account prompts, and completion actions should be present when useful without overpowering the scripture.

### Quiet, focused interaction

The interface should use restrained surfaces, warm neutral colours, a muted ember accent, and purposeful motion. It should avoid unnecessary dashboard density, visual noise, and competitive pressure.

### Useful metrics without fixation

WPM and accuracy should help users understand an attempt. Users may eventually be able to reduce or hide live metrics when they want a more reflective practice session.

### Guest access with meaningful accounts

The core reading and practice experience should remain useful without an account. Accounts should provide clear value through cross-session saved passages, practice history, progress, and reflections.

### Desktop keyboard practice first

Desktop typing is the current priority. Responsive behaviour should remain usable, but mobile-specific practice optimisation is not a near-term product goal.

### Grow data ownership carefully

Account-owned user data belongs in Supabase with explicit ownership rules and understandable lifecycle controls. Guest data may remain browser-local. Bible text remains local until translation licensing, attribution, identity, storage, and delivery have been designed properly.

## Product Contracts

These decisions affect user expectations, metric meaning, or persisted passage identity. They should not change accidentally during visual or maintenance work:

- Accuracy counts mistakes made during an attempt, including mistakes later corrected. Deletion itself is neutral.
- WPM updates while an attempt is active and freezes at completion.
- Reflections are optional and remain attached to their completed practice attempt.
- Saving from Bible with no verses selected intentionally saves the whole chapter.
- Saved passages retain enough translation, book, chapter, and verse identity to reopen in their original Bible context.
- Featured passage saves preserve their full verse range, custom selections preserve their exact verses, and whole-chapter saves reopen without individual highlights.
- Featured categories remain broad and navigational. Narrower distinctions can become tags if the catalogue grows.
- Guest saved passages and signed-in cloud passages remain separate unless the user explicitly chooses a future import action.

Current visual treatments—such as the fixed-height typing viewport, collapsible setup panel, and reflection dialog—may evolve as long as these product contracts and the scripture-first experience are preserved.

## Beta Definition

Beta begins when the core product is reliable enough for regular public use and the project can explain how account data is handled. The following outcomes define that threshold.

### Must have

- Provide a working password-recovery flow and complete the essential account lifecycle.
- Verify signup, email confirmation, sign-in, sign-out, and password recovery in production.
- Publish basic privacy information covering stored account data, retention, and user controls.
- Provide a clear account-deletion process, preferably self-service, with confirmed cascading data deletion.
- Add automated coverage for typing metrics, storage adapters, and the highest-risk signed-in flows.
- Establish and complete a repeatable production release checklist.
- Resolve high-impact desktop accessibility, keyboard focus, contrast, pending-state, and interaction issues found during final QA.

### Should have

- Offer a deliberate one-time import of guest saved passages after sign-in.
- Add safe retry or recovery behaviour for failed practice-attempt persistence.
- Review and reduce the initial application bundle before further feature growth.
- Provide account-data export, or document why it is deferred beyond beta.

### Could have

- Let users reduce or hide live practice metrics.
- Provide an undo period after saved-passage removal.
- Preserve a limited local practice history for guests.

## Deferred Work

These areas may fit the future product but require prerequisites or stronger evidence before implementation:

- Additional Bible translations and hosted scripture delivery after licensing and attribution research.
- Mobile-specific typing optimisation after the desktop experience is stable.
- Broader reflection organisation around passages as well as individual attempts.

## Current Non-goals

These do not fit the present product direction:

- Replacing Supabase with a custom Node or Express backend without a demonstrated need.
- Social feeds or public community passage collections.
- Competitive rankings, leaderboards, or pressure-driven typing comparisons.
- Gamification that makes speed or streaks more important than engagement with scripture.

## Delivery Roadmap

### Now: account trust

- Close the account-lifecycle, privacy, deletion, and production-authentication gaps in the beta definition.
- Decide what account-data controls must be self-service before beta.

### Next: reliability baseline

- Add focused automated coverage and a repeatable release checklist.
- Improve failed cloud-save recovery.
- Complete desktop accessibility and interaction QA.

### Then: beta candidate

- Implement or explicitly defer the remaining Should Have outcomes.
- Review bundle performance and production behaviour.
- Audit every beta gate and cut a verified beta release.

### After beta

- Explore optional metric visibility and further scripture-first practice refinements.
- Revisit how reflections should connect to attempts and saved passages.
- Plan licensed multi-translation storage and delivery.

## Open Product Questions

- What additional capabilities and quality standards should define `1.0.0` beyond beta readiness?
- Should reflections eventually be organised primarily around attempts, saved passages, or both?
- Which live metrics should users be able to hide, and should that preference sync to an account?
- How should guest passage import present duplicates and conflicts to a newly signed-in user?
- Should account-data export be required for beta or for `1.0.0`?
- Which translations can be legally stored and delivered, and how should users switch between them?
