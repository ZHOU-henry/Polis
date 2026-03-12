import {
  agentDefinitions,
  AgentDefinitionSchema,
  findAgentBySlug
} from "@agora/shared/domain";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_AGORA_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

async function tryFetchJson(path: string) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getAgentCatalog() {
  const payload = (await tryFetchJson("/agents")) as
    | { items?: unknown[] }
    | null;

  if (!payload?.items) {
    return agentDefinitions;
  }

  const parsed = payload.items
    .map((item) => AgentDefinitionSchema.safeParse(item))
    .filter((result) => result.success)
    .map((result) => result.data);

  return parsed.length > 0 ? parsed : agentDefinitions;
}

export async function getAgentDetail(slug: string) {
  const payload = (await tryFetchJson(`/agents/${slug}`)) as
    | { item?: unknown }
    | null;

  if (!payload?.item) {
    return findAgentBySlug(slug);
  }

  const parsed = AgentDefinitionSchema.safeParse(payload.item);
  return parsed.success ? parsed.data : findAgentBySlug(slug);
}

export { apiBaseUrl };
