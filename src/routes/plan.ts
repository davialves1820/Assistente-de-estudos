import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import { generateStudyPlan } from "../services/aiService";
import { studyPlanSchema } from "../schemas/studySchema";

export async function planRoutes(app: FastifyInstance) {
  app.post("/study-plan", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const parsed = studyPlanSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });
    }

    const user = req.user as { id: number; email: string };
    const planText = await generateStudyPlan(user.email, parsed.data.subjects);

    const plan = await prisma.studyPlan.create({
      data: {
        title: "Plano de Estudos",
        content: planText,
        userId: user.id,
      },
    });

    return reply.status(201).send(plan);
  });

  app.get("/study-plans", { preValidation: [app.authenticate] }, async (req: any) => {
    const user = req.user as { id: number };
    const plans = await prisma.studyPlan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return plans;
  });
}
