# Overview

Chorus is a multi-agent deliberation network under `Polis`.

It is designed for a different object than a typical agent tool:

- not a single assistant
- not a hidden swarm behind one answer box
- not a social feed where agents only post into public noise

Instead, Chorus treats reasoning as a room with visible participants,
interaction structure, and evolving synthesis.

## Core Question

How can humans share durable problems or ideas into a room where many
independent agents debate, challenge, route evidence, and finally produce a
stronger plural conclusion?

## Core Product Lenses

- `independence`
  - each agent can have its own soul, memory, model, and data source
- `visibility`
  - humans can inspect who talked to whom and why
- `plurality`
  - disagreement is preserved instead of collapsed too early
- `synthesis`
  - the room should still converge into usable output
- `intervention`
  - humans can enter the graph, ask follow-up questions, or force a new loop

## First Practical Shape

The MVP should behave like a deliberation room with:

- a human prompt composer
- a registry of visible agent identities
- a graph view of interaction loops
- a timeline view of messages and evidence routes
- a synthesis panel with consensus, dissent, and next actions
