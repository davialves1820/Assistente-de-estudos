import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import { generateReviewQuestion } from "../services/aiService";
import { reviewSchema } from "../schemas/studySchema";

export async function reviewRoutes(app: FastifyInstance) {
  app.post("/review", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });
    }

    const user = req.user as { id: number };
    const reviewContent = await generateReviewQuestion(parsed.data.subject);

    const review = await prisma.review.create({
      data: {
        question: `Pergunta sobre ${parsed.data.subject}`,
        answer: reviewContent,
        userId: user.id,
      },
    });

    return reply.status(201).send(review);
  });

  app.get("/reviews", { preValidation: [app.authenticate] }, async (req: any) => {
    const user = req.user as { id: number };
    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  });
}
