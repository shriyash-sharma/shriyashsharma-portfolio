# Engineering Philosophy

This document captures the working principles behind the platform. It is not a manifesto. It is a record of the preferences that show up repeatedly in the code and architecture.

## Build for maintainability before maximal flexibility

The platform consistently favors structures that stay understandable after the first release.

That usually means:

- typed boundaries over implicit coupling
- simple runtime topology over premature distribution
- explicit repository and content seams over hidden convenience layers
- operational clarity over feature theater

## Use the smallest abstraction that keeps the system honest

The codebase avoids unnecessary framework layering where the behavior is already clear.

Examples include:

- direct provider abstractions for embeddings and LLMs instead of a large orchestration stack
- a single content model with typed collections instead of early table explosion
- Next.js route handlers as a narrow proxy layer instead of an invented gateway service

This is not anti-abstraction. It is a preference for abstractions that pay rent quickly.

## Treat frontend work as systems work

Frontend engineering here is not framed as styling attached to a backend product. It is treated as architecture work in its own right.

That includes:

- route ownership
- reusable component boundaries
- state clarity
- backend contract handling
- content presentation quality
- product trust through predictable UI behavior

## AI should be grounded or it should not ship

The assistant is useful only if it can be trusted.

That leads to a few non-negotiable constraints:

- retrieve from known sources
- keep prompts scoped
- cite sources clearly
- fail safely when retrieval is weak
- avoid personality-heavy behavior that obscures accuracy

The platform is intentionally more interested in credible AI behavior than in broad conversational performance.

## Editorial quality is part of system quality

A portfolio that wants to showcase engineering depth cannot treat writing as decorative copy.

Case studies, architecture docs, ADRs, and articles all affect:

- recruiter trust
- assistant answer quality
- onboarding clarity
- the perceived coherence of the platform

That is why content architecture and retrieval architecture are linked in this repository.

## Prefer evolutionary change over dramatic rewrites

The architecture favors steps that can be validated and extended.

That shows up in patterns like:

- seed content before inventing more CMS surface area
- manual ingestion before worker-based orchestration
- provider abstractions before vendor-specific lock-in
- same-origin proxying before more elaborate gateway behavior

The platform should be able to evolve in public without pretending every decision was final from day one.

## Make tradeoffs visible

Many engineering systems become hard to trust because they hide their constraints.

This platform tries to do the opposite:

- ADRs explain structural decisions
- limitation docs explain what is intentionally deferred
- architecture notes describe why the system works the way it does

That honesty improves maintainability and makes the platform more credible as a reflection of real engineering judgment.
