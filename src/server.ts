import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors"; // importa o plugin CORS
import { authRoutes } from "./routes/auth";
import { planRoutes } from "./routes/plan";
import { reviewRoutes } from "./routes/review";
import { activityRoutes } from "./routes/activity";

const app = fastify();

// registra o CORS antes das rotas
app.register(fastifyCors, {
  origin: ["http://localhost:8080", "http://localhost:5173"], // coloque a porta do seu frontend
  credentials: true, // permite envio de cookies/autorização se precisar
});

app.register(fastifyJwt, { secret: process.env.JWT_SECRET || "supersecret" });
console.log("JWT Secret:", process.env.JWT_SECRET);

app.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

(async () => {
  await authRoutes(app);
  await planRoutes(app);
  await reviewRoutes(app);
  await activityRoutes(app);

  app.listen({ port: 3333 }, (err, address) => {
    if (err) throw err;
    console.log(`✅ Server listening at ${address}`);
  });
})();
