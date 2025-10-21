import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import { studyPlanSchema } from "../schemas/studySchema";
import { generateStudyPlan } from "../services/aiService";
import { completeStudyPlan, getUserProgress } from "../services/progressService";

export async function planRoutes(app: FastifyInstance) {
  app.post("/study-plan", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const parsed = studyPlanSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });

    const user = req.user;
    const difficulty = req.body.difficulty || "intermediário";
    const planText = await generateStudyPlan(user.email, parsed.data.subjects);

    const plan = await prisma.studyPlan.create({
      data: { title: "Plano de Estudos", content: planText, userId: user.id, difficulty },
    });

    return reply.status(201).send(plan);
  });

  app.post("/study-plan/:id/complete", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const plan = await completeStudyPlan(Number(req.params.id), user.id);
    return reply.send(plan);
  });

  app.get("/progress", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const progress = await getUserProgress(user.id);
    return reply.send(progress);
  });
}
