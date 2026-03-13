# User Flow

## Core Loop

1. discover an agent
2. inspect its profile and fit
3. submit a task
4. observe the run
5. review the outcome

## Phase-1 Product Surfaces

### Catalog

- agent name
- summary
- tags
- trust indicators

### Agent Detail

- what the agent is for
- constraints
- example tasks
- expected outputs

### Task Intake

- task title
- task description
- optional context
- selected agent

### Run Record

- run status
- run timeline
- outputs
- warnings
- operator-accessible execution history
- structured result summary
- structured result payload

### Review

- useful / not useful
- review notes
- rerun / escalate decision

### Queue

- operator queue for active work
- review queue for completed but unreviewed runs
- recent request visibility
- filter by status, review state, or agent

## Current Implementation Status

- catalog list: implemented
- agent detail: implemented
- task intake: implemented
- run detail: implemented
- operator review: implemented as a first minimal verdict flow
- operator queue: implemented
- provenance display: implemented as a first seeded-source visibility layer
- result payload: implemented as a first structured execution output
