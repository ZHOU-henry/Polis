import Fastify from "fastify";
import {
  agentDefinitions,
  findAgentBySlug,
  TaskRequestInputSchema
} from "@agora/shared/domain";
import { createTaskRequest, listTaskRequests } from "./data/task-requests.js";
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
    items: agentDefinitions
  };
});

server.get("/agents/:slug", async (request, reply) => {
  const { slug } = request.params as { slug: string };
  const agent = findAgentBySlug(slug);

  if (!agent) {
    return notFound(reply, "Agent not found");
  }

  return {
    item: agent
  };
});

server.get("/task-requests", async () => {
  return {
    items: listTaskRequests()
  };
});

server.post("/task-requests", async (request, reply) => {
  const parsed = TaskRequestInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid task request", parsed.error.flatten());
  }

  const record = createTaskRequest(parsed.data);

  return reply.code(201).send({
    item: record
  });
});

const port = Number(process.env.PORT ?? 3001);

server.listen({ port, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
