# Source Ingestion Spec

## Goal

Define the first version of how Peras should ingest source data.

## Source Classes

### 1. Academic Metadata APIs

Examples:

- arXiv
- OpenAlex
- Semantic Scholar
- Crossref

Ingest:

- title
- authors
- abstract
- publication date
- subject/category
- citation metadata where available

Frequency:

- daily

### 2. Conference / Review Surfaces

Examples:

- OpenReview
- NeurIPS
- ICML
- ICLR
- CVPR
- ACL
- COLT
- CCC

Ingest:

- accepted papers
- topic clusters
- review-stage movement where visible

Frequency:

- daily around active conference windows
- weekly otherwise

### 3. Open Technical Build Surface

Examples:

- GitHub repository search

Ingest:

- repo creation
- stars / forks / updated-at
- language
- topic tags
- license

Frequency:

- daily

### 4. Lab / Company Research Surfaces

Examples:

- OpenAI Research
- Anthropic Research
- DeepMind
- FAIR
- Google Research
- Microsoft Research

Ingest:

- research releases
- product-adjacent technical notes
- official framing shifts

Frequency:

- daily or weekly depending on source cadence

### 5. Market / Institutional Sources

Examples:

- SEC EDGAR
- Stanford HAI AI Index
- OECD
- ILO
- NBER

Ingest:

- policy and market reports
- company disclosures
- economic framing documents

Frequency:

- weekly / monthly depending on source cadence

## Normalized Entity Types

Peras should normalize into:

- `paper`
- `conference_event`
- `repo`
- `research_release`
- `market_signal`
- `thesis_update`

## Quality Gates

- keep raw source URL
- track source class
- preserve timestamp
- keep parser notes
- reject sources without defendable provenance
