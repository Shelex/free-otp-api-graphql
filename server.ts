import fs from "node:fs";
import Fastify from "fastify";
import mercurius from "mercurius";
import { auth, verySecretApiKey } from "./auth.js";

const fastify = Fastify();

const schema = fs.readFileSync("./graphql/schema.graphql", "utf8");

const BASE_URL = "https://otp-api.shelex.dev/api";

const resolvers = {
    Query: {
        getPhoneList: async (_: any, { country }: { country: string }) => {
            const response = await fetch(`${BASE_URL}/list/${country}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },

        getOTPCode: async (
            _: any,
            {
                country,
                phoneNumber,
                ago,
                since,
                match,
                source,
            }: {
                country: string;
                phoneNumber: string;
                ago?: string;
                since?: number;
                match?: string;
                source?: string;
            }
        ) => {
            const params = new URLSearchParams({
                ...(ago && { ago }),
                ...(since && { since: since.toString() }),
                ...(match && { match }),
                ...(source && { source }),
            });
            const url = `${BASE_URL}/${country}/${phoneNumber}?${params}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },

        getCountries: async () => {
            const response = await fetch(`${BASE_URL}/countries`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        },

        authorize: () => {
            return {
                token: verySecretApiKey,
            };
        },
    },
};

fastify.register(mercurius, {
    schema,
    resolvers,
});

fastify.addHook("preHandler", auth);

fastify.listen({ port: 3000 }, (err) => {
    if (err) throw err;
    console.log("Server listening on http://localhost:3000/graphql");
});
