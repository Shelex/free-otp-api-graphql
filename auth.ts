import { FastifyReply, FastifyRequest } from "fastify";

export const verySecretApiKey = "super-duper-secret-key";

export const auth = (
    request: FastifyRequest,
    reply: FastifyReply,
    done: () => void
) => {
    //@ts-expect-error
    if (request.body.operationName === "Authorize") {
        done();
        return;
    }

    const apiKey = request.headers["authorization"];
    const validHeader = `Bearer ${verySecretApiKey}`;

    if (apiKey !== validHeader) {
        reply.code(401).send({ error: "Unauthorized" });
        return;
    }

    done();
};
