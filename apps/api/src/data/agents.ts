import { agentDefinitions } from "@agora/shared/domain";
import { prisma } from "../lib/prisma.js";

export async function listAgents() {
  return prisma.agentDefinition.findMany({
    orderBy: {
      name: "asc"
    }
  });
}

export async function getAgentBySlug(slug: string) {
  return prisma.agentDefinition.findUnique({
    where: { slug }
  });
}

export async function syncAgentDefinitions() {
  for (const agent of agentDefinitions) {
    await prisma.agentDefinition.upsert({
      where: { id: agent.id },
      update: agent,
      create: agent
    });
  }
}
