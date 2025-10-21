import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import { reviewSchema } from "../schemas/studySchema";
import { generateReviewQuestion } from "../services/aiService";
import { completeReview } from "../services/progressService";

export async function reviewRoutes(app: FastifyInstance) {
  app.post("/review", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });

    const user = req.user;
    const difficulty = req.body.difficulty || "intermediário";
    const reviewContent = await generateReviewQuestion(parsed.data.subject);

    const review = await prisma.review.create({
      data: { question: `Pergunta sobre ${parsed.data.subject}`, answer: reviewContent, userId: user.id, difficulty },
    });

    // Criar flashcard automaticamente
    await prisma.flashcard.create({
      data: { question: review.question, answer: review.answer, reviewId: review.id },
    });

    return reply.status(201).send(review);
  });

  app.post("/review/:id/complete", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const review = await completeReview(Number(req.params.id), user.id);
    return reply.send(review);
  });
}
