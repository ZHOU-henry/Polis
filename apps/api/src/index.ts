import Fastify from "fastify";
import { sampleAgents } from "@agora/shared/domain";

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
    items: sampleAgents
  };
});

const port = Number(process.env.PORT ?? 3001);

server.listen({ port, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
