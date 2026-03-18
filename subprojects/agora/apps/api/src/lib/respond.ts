import type { FastifyReply } from "fastify";

export function notFound(reply: FastifyReply, message: string) {
  return reply.code(404).send({
    error: message
  });
}

export function badRequest(reply: FastifyReply, message: string, details?: unknown) {
  return reply.code(400).send({
    error: message,
    details
  });
}

export function conflict(reply: FastifyReply, message: string, details?: unknown) {
  return reply.code(409).send({
    error: message,
    details
  });
}
