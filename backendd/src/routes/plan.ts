import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import { studyPlanSchema } from "../schemas/studySchema";
import { generateStudyPlan } from "../services/aiService";
import { completeStudyPlan, getUserProgress } from "../services/progressService";

export async function planRoutes(app: FastifyInstance) {
  // Criar um novo plano
  app.post("/study-plan", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const parsed = studyPlanSchema.safeParse(req.body);
    if (!parsed.success)
      return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });

    const user = req.user;
    const difficulty = req.body.difficulty || "intermediário";
    const planText = await generateStudyPlan(user.email, parsed.data.subjects);

    const plan = await prisma.studyPlan.create({
      data: {
        title: "Plano de Estudos",
        content: planText,
        userId: user.id,
        difficulty,
      },
    });

    return reply.status(201).send(plan);
  });

  // Marcar um plano como concluído
  app.post("/study-plan/:id/complete", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const plan = await completeStudyPlan(Number(req.params.id), user.id);
    return reply.send(plan);
  });

  // Obter progresso do usuário
  app.get("/progress", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const progress = await getUserProgress(user.id);
    return reply.send(progress);
  });

  // 🆕 Listar todos os planos do usuário
  app.get("/study-plan", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;

    const plans = await prisma.studyPlan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }, // opcional: mais recentes primeiro
    });

    return reply.send(plans);
  });

  // 🆕 Buscar um plano específico por ID
  app.get("/study-plan/:id", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const planId = Number(req.params.id);

    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || plan.userId !== user.id) {
      return reply.status(404).send({ error: "Plano não encontrado ou acesso negado" });
    }

    return reply.send(plan);
  });
}
