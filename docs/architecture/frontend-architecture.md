# Frontend Architecture

This document explains how the public web application is structured today. It focuses on boundaries, not a file-by-file dump.

## Primary goal

The frontend should feel editorial, technically credible, and easy to extend without becoming a generic content site.

That leads to a few practical goals:

- keep route ownership clear
- separate marketing surfaces from content-detail surfaces
- preserve a clean integration boundary with the API
- make the assistant feel integrated rather than bolted on
- keep shared UI patterns small and reusable without over-abstracting

## App structure

The frontend lives in `apps/web` and is built with the Next.js App Router.

At a high level it has four kinds of surfaces:

### 1. Marketing routes

These are the public narrative pages:

- home
- about
- projects index
- speaking
- contact

They establish positioning, explain the engineering focus, and route users into deeper content.

### 2. Content routes

These render CMS-backed detail pages:

- project detail
- case study detail
- blog post detail
- architecture note detail
- assistant page

These routes are the main bridge between structured content and long-form technical reading.

### 3. Shared content components

Public list and detail components provide a stable rendering shell for CMS content.

That means:

- list pages can stay consistent across content types
- detail views can render markdown bodies with minimal type-specific branching
- backend-backed content can replace placeholder data without changing the page shells

### 4. Assistant surfaces

The assistant is mounted in multiple places but shares one interaction model:

- dedicated `/assistant` page
- homepage assistant section
- floating launcher and drawer
- contextual CTA blocks on detail pages

The important choice here is shared state. The same conversation can move across these entry points instead of acting like separate widgets.

## Content model integration

The frontend assumes that identity and branding are static, while editorial content is dynamic.

### Static config owns

- name
- contact details
- social links
- hero framing
- availability messaging
- core SEO defaults
- navigation

### CMS content owns

- projects
- case studies
- articles
- architecture notes
- experiments

This separation is deliberate. Identity should not depend on database content. Public engineering work should.

## UI philosophy

The visual system aims for calm, high-trust presentation.

The direction is closer to a developer platform than a personal homepage:

- restrained typography
- strong spacing
- dark surfaces with subtle contrast shifts
- very limited motion
- no decorative gradients competing with the content

That matters because the platform is asking users to read architecture notes and technical material. The UI should support that behavior, not distract from it.

## Route ownership and composition

The route tree is designed so each page decides what content it owns while shared components handle rendering concerns.

Examples:

- `PageShell` and `Section` establish layout rhythm
- public content lists handle collections consistently
- public detail views handle markdown body rendering and metadata presentation
- feature folders keep page-specific UI close to the owning surface

This avoids a common frontend problem where page logic, data fetching, and component composition get scattered across unrelated directories.

## Same-origin API coordination

The frontend does not talk directly to every backend concern from the browser.

Instead it uses the same-origin pattern where appropriate:

- browser talks to the web app
- selected Next.js route handlers proxy requests to FastAPI
- backend URLs and timeout concerns stay out of the browser layer

This is especially useful for the assistant, where the frontend should not need to know anything about the retrieval provider or upstream API layout.

## Assistant UX architecture

The assistant is treated as a product capability, not a hidden page.

Important choices:

- floating launcher for global discoverability
- drawer for lightweight, cross-page access
- dedicated page for deeper interaction
- contextual prompts on relevant detail pages
- one shared state container behind all of them

That combination supports multiple user modes:

- a recruiter who wants one quick answer
- an engineer who wants to inspect technical details
- a reader moving from a case study into a follow-up question

## i18n posture

The app already has locale scaffolding and dictionaries.

That means the platform is structurally ready for multilingual content, but the content strategy should remain careful. For engineering-heavy pages, translation quality matters more than raw locale count.

## Current constraints

A few frontend limitations are intentional:

- no overbuilt design-system package yet
- no heavy client-state architecture beyond what the product currently needs
- assistant streaming UI deferred
- some public pages were initially stronger in structure than in content depth

Those constraints are acceptable because the app is still optimizing for clarity and maintainability.

## Why this architecture works for the portfolio

The frontend feels credible when it behaves like a well-scoped product:

- static identity where identity should be fixed
- CMS-backed editorial content where content should evolve
- markdown-driven technical depth where long-form explanation matters
- assistant UX integrated into the public experience
- enough structure to scale without turning into framework theater
