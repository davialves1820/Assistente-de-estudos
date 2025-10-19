import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "../schemas/authSchema";

export async function authRoutes(app: FastifyInstance) {
  // decorator para autenticar rotas protegidas
  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });

  app.post("/register", async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(400).send({ error: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hash } });

    return reply.status(201).send({ id: user.id, email: user.email, name: user.name });
  });

  app.post("/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(400).send({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });
    return reply.send({ token });
  });
}
