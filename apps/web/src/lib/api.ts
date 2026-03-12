import { agentDefinitions, findAgentBySlug } from "@agora/shared/domain";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_AGORA_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

export async function getAgentCatalog() {
  return agentDefinitions;
}

export async function getAgentDetail(slug: string) {
  return findAgentBySlug(slug);
}

export { apiBaseUrl };
