# Product Status and Direction

This document describes what The Word per Minute is trying to become, what currently works, and what should be prioritised next. It is a living product document rather than a record of individual releases.

Release history lives in [`CHANGELOG.md`](../CHANGELOG.md). Technical structure lives in [`architecture.md`](architecture.md).

## Product Vision

The Word per Minute is a scripture-first typing practice app. Typing is used as a way to slow down, pay attention to a passage, and return to it later through saved passages, practice history, and reflections.

The product should feel like a quiet reading and practice space rather than a competitive typing dashboard. Speed and accuracy remain useful feedback, but they should support engagement with the passage instead of becoming the entire purpose of the experience.

## Current Status

The current release is `0.1.0`, the first formally versioned public-alpha baseline.

The core experience is functional and deployed:

- Visitors can discover curated passages by broad theme.
- Users can read locally stored WEB Bible chapters and select verse ranges.
- Guests can save passages in their current browser.
- Signed-in users can sync saved passages through Supabase.
- Featured and saved passages can be practised through an inline, keyboard-focused typing surface.
- Practice provides live WPM, accuracy, and completion feedback.
- Signed-in practice attempts, progress summaries, and optional reflections are stored in Supabase.
- Saved passages can be managed in Library and reopened in their original Bible context.
- The interface supports light and dark themes and is primarily designed for desktop keyboard use.

The app is suitable for public-alpha use, but it is not yet considered beta-ready or a stable `1.0.0` product.

## Product Principles

### Scripture first

The passage should remain the visual and conceptual focus. Metrics, setup controls, account prompts, and completion actions should be present when useful without overpowering the scripture.

### Quiet, focused interaction

The interface should use restrained surfaces, warm neutral colours, a muted ember accent, and purposeful motion. It should avoid unnecessary dashboard density, visual noise, and competitive pressure.

### Useful metrics without fixation

WPM and accuracy should help users understand an attempt. Future preference controls may allow users to reduce or hide live metrics when they want a more reflective practice session.

### Guest access with meaningful accounts

The core experience should remain useful without an account. Accounts should provide clear value through cross-session saved passages, practice history, progress, and reflections.

### Desktop keyboard practice first

Desktop typing is the current priority. Responsive behaviour should remain usable, but mobile-specific practice optimisation is not a near-term product goal.

### Grow data ownership carefully

User-created data belongs in Supabase with explicit ownership rules. Bible text remains local until translation licensing, attribution, storage, and delivery have been designed properly.

## Established Behaviour

These decisions define current product behaviour and should not change accidentally during maintenance work:

- Accuracy counts mistakes made during an attempt, including mistakes later corrected. Deletion itself is neutral.
- WPM updates while an attempt is active and freezes at completion.
- Practice uses one continuous typing target rather than fixed two-verse batches.
- The passage itself is the typing surface; a visible textarea is not used.
- The practice viewport keeps a stable height so verse length does not move the surrounding page.
- Practice setup remains available through a collapsible section.
- Reflections are optional and open in a focused modal after completion.
- Saving from Bible with no verses selected intentionally saves the whole chapter.
- Saved passages can be reopened from Library in their original Bible context.
- Featured passage saves highlight their verse range, custom selections retain their exact verses, and whole-chapter saves open without individual highlights.
- Featured categories remain broad and navigational. Narrower topics can become tags if the catalogue grows.

## Current Limitations and Risks

### Account completeness

- Password recovery and the wider account lifecycle are not complete.
- Guest saved passages remain separate after sign-in; there is no import flow yet.
- Authentication email delivery and templates are configured outside the repository and still need production verification and operational documentation.

### Reliability

- Automated tests are not set up yet.
- Production release checks are manual.
- Failed practice-attempt saves do not yet have an idempotent retry design.
- Saved-passage removal has confirmation but no undo.

### Data and content

- Only the local public-domain WEB translation is available.
- Translation licensing and attribution must be resolved before additional Bible text is hosted.
- Guest practice attempts do not have a durable history comparable to signed-in accounts.

### Performance and polish

- The main production JavaScript chunk still exceeds Vite's default 500 kB warning threshold.
- Light and dark themes still need a final desktop visual and interaction QA pass.
- Some form-control styling remains repeated and may drift as the interface grows.

## Path to Beta

### Must have

- Complete password recovery and essential account lifecycle flows.
- Document user-data handling and provide basic privacy information.
- Add automated coverage for typing metrics, storage adapters, and the highest-risk signed-in flows.
- Establish and complete a repeatable production release checklist.
- Resolve high-impact desktop accessibility, focus, contrast, and interaction issues found during final QA.

### Should have

- Offer a deliberate one-time import of guest saved passages after sign-in.
- Add safe retry behaviour for failed practice-attempt persistence.
- Split major routes or heavy dependencies enough to remove the current bundle warning.
- Verify production authentication email delivery, recovery links, and templates.

### Could have

- Let users reduce or hide live practice metrics.
- Provide an undo period after saved-passage removal.
- Preserve a limited local practice history for guests.
- Introduce a shared form-control primitive if repeated styling begins to diverge.

### Deferred until prerequisites are clear

- Additional Bible translations and hosted scripture delivery.
- Mobile-first typing optimisation.
- A custom Node or Express backend.
- Social, competitive, or gamified typing features.

## Roadmap

### Now: documentation and baseline clarity

- Separate product status, architecture, data/security, and release history into trustworthy sources.
- Define the current `0.1.0` public-alpha baseline and the criteria for later releases.

### Next: account and reliability foundation

- Complete password recovery and account lifecycle behaviour.
- Design guest-to-account passage import.
- Add privacy information and high-risk automated coverage.
- Improve save-failure recovery and formalise release verification.

### Later: focused practice and content growth

- Explore optional metric visibility and further scripture-first practice refinements.
- Plan a licensed multi-translation model, including attribution and passage identity.
- Address route-level performance as the application and content catalogue grow.

## Open Product Questions

- What exact capabilities define the `1.0.0` release beyond beta readiness?
- Should reflections eventually be organised primarily around attempts, saved passages, or both?
- Which live metrics should users be able to hide, and should that preference sync to an account?
- How should guest data be presented and imported when a user creates an account?
- Which translations can be legally stored and delivered, and how should users switch between them?
