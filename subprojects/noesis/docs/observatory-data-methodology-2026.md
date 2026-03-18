# Observatory Data Methodology 2026

This file explains how the Noesis six-factor observatory should think about
data quality, proxy quality, and geographic aggregation.

## Principle

The observatory should be honest about what is:

- directly measured
- indirectly proxied
- inferred from multiple public signals

The current prototype is intentionally a composite regional system rather than a
claim of perfect real-time country-level truth.

## Factor Source Model

### Compute

Primary public source types:

- AWS Global Infrastructure
  - <https://aws.amazon.com/about-aws/global-infrastructure>
- Azure Global Infrastructure
  - <https://azure.microsoft.com/en-us/explore/global-infrastructure/>
- Google Cloud Locations
  - <https://cloud.google.com/about/locations>
- Alibaba Cloud Global Locations
  - <https://www.alibabacloud.com/en/global-locations>

Interpretation:

- region count
- announced expansion
- availability-zone density
- cloud / AI infrastructure presence

### Algorithms

Primary public source types:

- OpenAI Research
- Anthropic Research
- Google DeepMind
- Google Research
- Meta AI Research
- Microsoft Research
- OpenAlex
- OpenReview

Interpretation:

- model release density
- benchmark movement
- research-institution clustering
- method diffusion

### Data

Primary public source types:

- Hugging Face Hub
- LAION
- OpenAlex
- public dataset infrastructures and licensing surfaces

Interpretation:

- open data ecosystem density
- data platform concentration
- dataset creation and reuse infrastructure

### Storage

Primary public source types:

- AWS / Azure / Google Cloud / Alibaba public infrastructure pages
- public archive and storage-service expansion surfaces

Interpretation:

- storage-region density
- archive expansion
- data-center storage footprint

### Energy

Primary public source types:

- Electricity Maps
  - <https://app.electricitymaps.com>
- public power and grid announcements
- AI-infrastructure power agreements

Interpretation:

- regional power readiness
- carbon / electricity context
- energy-backed expansion potential

### AI Talent

Primary public source types:

- Stanford HAI AI Index
- OpenAlex institution and author graphs
- major lab and company research surfaces

Interpretation:

- research cluster density
- hiring concentration
- institutional and geographic talent gravity

## Geographic Aggregation

The current observatory prototype uses regional composites rather than
country-by-country truth because the factors do not all support the same data
cadence or precision.

Recommended path:

1. start with regional composite scores
2. separate direct metrics from proxy metrics
3. increase geographic granularity only where source quality supports it

## Quality Rule

Noesis should prefer a less granular but honest map over a highly detailed but
misleading one.
