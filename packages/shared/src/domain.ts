import { z } from "zod";

export const AgentStatusSchema = z.enum(["draft", "active"]);

export const AgentDefinitionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  constraints: z.array(z.string()),
  trustSignals: z.array(z.string()),
  status: AgentStatusSchema
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

export const TaskRequestStatusSchema = z.enum([
  "submitted",
  "accepted",
  "running",
  "completed",
  "failed"
]);

export const TaskRequestInputSchema = z.object({
  agentId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  contextNote: z.string().max(1000).optional().default("")
});

export type TaskRequestInput = z.infer<typeof TaskRequestInputSchema>;

export const TaskRequestRecordSchema = TaskRequestInputSchema.extend({
  id: z.string(),
  status: TaskRequestStatusSchema,
  createdAt: z.string()
});

export type TaskRequestRecord = z.infer<typeof TaskRequestRecordSchema>;

export const agentDefinitions: AgentDefinition[] = [
  {
    id: "athena",
    slug: "athena",
    name: "Athena",
    summary: "Project-control intelligence focused on scope, sequencing, and execution clarity.",
    description:
      "Athena helps operators choose direction, structure work, and keep an agent program aligned to real milestones rather than narrative drift.",
    tags: ["planning", "strategy", "portfolio"],
    constraints: [
      "Best when the task needs prioritization and decomposition",
      "Not the right surface for raw implementation work"
    ],
    trustSignals: [
      "Clear role boundary",
      "Structured planning output",
      "Issue-first operating model"
    ],
    status: "active"
  },
  {
    id: "hermes",
    slug: "hermes",
    name: "Hermes",
    summary: "Research and intelligence agent for source-backed market and technical analysis.",
    description:
      "Hermes helps operators validate market, product, and technical claims using reliable sources and explicit uncertainty notes.",
    tags: ["research", "sources", "analysis"],
    constraints: [
      "Best when source quality matters",
      "Not a replacement for direct implementation"
    ],
    trustSignals: [
      "Source-backed output",
      "Explicit dates and links",
      "Inference separated from fact"
    ],
    status: "active"
  },
  {
    id: "hephaestus",
    slug: "hephaestus",
    name: "Hephaestus",
    summary: "Engineering agent for implementation, scaffolding, and delivery mechanics.",
    description:
      "Hephaestus turns validated plans into working code, repeatable tooling, and maintainable system structure.",
    tags: ["code", "delivery", "systems"],
    constraints: [
      "Best when scope and architecture are clear enough to build",
      "Should not self-approve risky work without audit"
    ],
    trustSignals: [
      "Typechecked code paths",
      "Reproducible repo structure",
      "Explicit implementation boundaries"
    ],
    status: "active"
  }
];

export function findAgentBySlug(slug: string) {
  return agentDefinitions.find((agent) => agent.slug === slug) ?? null;
}
