# Thesis Card Schema

## Purpose

The thesis card is the atomic unit of judgment in Peras.

It should be concise enough to scan and rigorous enough to defend.

## Required Fields

- `thesis_id`
- `title`
- `direction`
- `summary`
- `why_now`
- `frontier_signal`
- `commercial_signal`
- `historical_pattern`
- `upside_case`
- `bottlenecks`
- `counterarguments`
- `confidence_level`
- `last_updated`

## Evidence Fields

- `primary_sources`
- `source_class_mix`
- `signal_quality_notes`
- `evidence_vs_inference_split`

## Ranking Fields

- `frontier_movement_score`
- `build_momentum_score`
- `commercial_pull_score`
- `time_to_product_score`
- `value_asymmetry_score`
- `durability_score`
- `fragility_penalty`

## Portfolio Fields

- `founder_relevance`
- `investor_relevance`
- `industrial_relevance`
- `watch_status`

## Update Rule

Every thesis card should preserve change history instead of silently changing
its claims over time.
