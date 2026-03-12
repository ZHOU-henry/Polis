import { z } from "zod";

export const AgentListingSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  tags: z.array(z.string())
});

export type AgentListing = z.infer<typeof AgentListingSchema>;

export const sampleAgents: AgentListing[] = [
  {
    id: "athena",
    name: "Athena",
    summary: "Project-control intelligence focused on scope, sequencing, and execution clarity.",
    tags: ["planning", "strategy", "portfolio"]
  },
  {
    id: "hermes",
    name: "Hermes",
    summary: "Research and intelligence agent for source-backed market and technical analysis.",
    tags: ["research", "sources", "analysis"]
  },
  {
    id: "hephaestus",
    name: "Hephaestus",
    summary: "Engineering agent for implementation, scaffolding, and delivery mechanics.",
    tags: ["code", "delivery", "systems"]
  }
];
