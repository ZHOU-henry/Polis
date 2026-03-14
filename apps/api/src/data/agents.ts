import { agentDefinitions } from "@agora/shared/domain";
import { prisma } from "../lib/prisma.js";
import { serializeAgentDefinition } from "../lib/serialize.js";

export async function listAgents() {
  const rows = await prisma.agentDefinition.findMany({
    include: {
      provider: true
    },
    orderBy: {
      name: "asc"
    }
  });

  return rows.map(serializeAgentDefinition);
}

export async function getAgentBySlug(slug: string) {
  const row = await prisma.agentDefinition.findUnique({
    where: { slug },
    include: {
      provider: true
    }
  });

  return row ? serializeAgentDefinition(row) : null;
}

export async function getAgentById(id: string) {
  const row = await prisma.agentDefinition.findUnique({
    where: { id },
    include: {
      provider: true
    }
  });

  return row ? serializeAgentDefinition(row) : null;
}

export async function syncAgentDefinitions() {
  for (const agent of agentDefinitions) {
    const agentData = {
      id: agent.id,
      slug: agent.slug,
      name: agent.name,
      summary: agent.summary,
      description: agent.description,
      providerId: agent.providerId,
      provenanceStatus: agent.provenanceStatus,
      provenanceSummary: agent.provenanceSummary,
      tags: agent.tags,
      constraints: agent.constraints,
      trustSignals: agent.trustSignals,
      status: agent.status
    };

    await prisma.agentDefinition.upsert({
      where: { id: agent.id },
      update: agentData,
      create: agentData
    });
  }
}
