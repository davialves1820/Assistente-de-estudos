import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import { reviewSchema } from "../schemas/studySchema";
import { generateReviewQuestion } from "../services/aiService";
import { completeReview } from "../services/progressService";

export async function reviewRoutes(app: FastifyInstance) {
  // Criar nova revisão
  app.post("/review", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const parsed = reviewSchema.safeParse(req.body);
    if (!parsed.success)
      return reply.status(400).send({ error: "ValidationError", details: parsed.error.format() });

    const user = req.user;
    const difficulty = req.body.difficulty || "intermediário";
    const reviewContent = await generateReviewQuestion(parsed.data.subject);

    const review = await prisma.review.create({
      data: {
        question: `Pergunta sobre ${parsed.data.subject}`,
        answer: reviewContent,
        userId: user.id,
        difficulty,
      },
    });

    // Cria automaticamente um flashcard vinculado
    await prisma.flashcard.create({
      data: {
        question: review.question,
        answer: review.answer,
        reviewId: review.id,
      },
    });

    return reply.status(201).send(review);
  });

  // Marcar revisão como concluída
  app.post("/review/:id/complete", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const review = await completeReview(Number(req.params.id), user.id);
    return reply.send(review);
  });

  // ✅ Listar todas as revisões do usuário
  app.get("/review", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return reply.send(reviews);
  });

  // ✅ Buscar uma revisão específica
  app.get("/review/:id", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const review = await prisma.review.findFirst({
      where: {
        id: Number(req.params.id),
        userId: user.id,
      },
      include: {
        flashcards: true,
      },
    });

    if (!review) return reply.status(404).send({ error: "Revisão não encontrada" });
    return reply.send(review);
  });

  // Deletar uma revisão específica
  app.delete("/review/:id", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    const reviewId = Number(req.params.id);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { flashcards: true },
    });

    if (!review || review.userId !== user.id) {
      return reply.status(404).send({ error: "Revisão não encontrada ou acesso negado" });
    }

    // Deleta os flashcards relacionados primeiro (para evitar erro de chave estrangeira)
    await prisma.flashcard.deleteMany({
      where: { reviewId },
    });

    // Depois deleta a revisão
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return reply.send({ message: "Revisão deletada com sucesso" });
  });
}
