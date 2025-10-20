import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth";
import { planRoutes } from "./routes/plan";
import { reviewRoutes } from "./routes/review";

const app = fastify();

app.register(fastifyJwt, { secret: process.env.JWT_SECRET || "supersecret" });
console.log("JWT Secret:", process.env.JWT_SECRET);
// 👉 Define o método de autenticação aqui
app.decorate(
  "authenticate",
  async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized" });
    }
  }
);

(async () => {
  await authRoutes(app);
  await planRoutes(app);
  await reviewRoutes(app);

  app.listen({ port: 3333 }, (err, address) => {
    if (err) throw err;
    console.log(`Server listening at ${address}`);
  });
})();
