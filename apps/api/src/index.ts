import Fastify from "fastify";
import {
  TaskRequestInputSchema
} from "@agora/shared/domain";
import { getAgentBySlug, listAgents, syncAgentDefinitions } from "./data/agents.js";
import { createTaskRequest, listTaskRequests } from "./data/task-requests.js";
import { prisma } from "./lib/prisma.js";
import { badRequest, notFound } from "./lib/respond.js";

const server = Fastify({
  logger: true
});

server.get("/health", async () => {
  return {
    status: "ok",
    service: "agora-api"
  };
});

server.get("/agents", async () => {
  return {
    items: await listAgents()
  };
});

server.get("/agents/:slug", async (request, reply) => {
  const { slug } = request.params as { slug: string };
  const agent = await getAgentBySlug(slug);

  if (!agent) {
    return notFound(reply, "Agent not found");
  }

  return {
    item: agent
  };
});

server.get("/task-requests", async () => {
  return {
    items: await listTaskRequests()
  };
});

server.post("/task-requests", async (request, reply) => {
  const parsed = TaskRequestInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid task request", parsed.error.flatten());
  }

  const record = await createTaskRequest(parsed.data);

  return reply.code(201).send({
    item: record
  });
});

const port = Number(process.env.PORT ?? 3001);

async function start() {
  await syncAgentDefinitions();

  try {
    await server.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    server.log.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void start();
