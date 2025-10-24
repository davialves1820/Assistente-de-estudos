import { prisma } from "../prisma/client";
import dayjs from "dayjs";

export async function completeStudyPlan(planId: number, userId: number) {
  const plan = await prisma.studyPlan.findUnique({
    where: { id: planId },
  });

  if (!plan || plan.userId !== userId) {
    throw new Error("Plano não encontrado ou acesso negado");
  }

  // Calcula o tempo em minutos entre criação e conclusão
  const durationInMinutes = Math.max(
    dayjs().diff(dayjs(plan.createdAt), "minute"),
    1 // evita 0
  );

  const updatedPlan = await prisma.studyPlan.update({
    where: { id: planId },
    data: {
      completed: true,
      durationInMinutes,
      updatedAt: new Date(),
    },
  });

  // Incrementa pontos do usuário
  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: 10 } },
  });

  return updatedPlan;
}

export async function completeReview(reviewId: number, userId: number) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Revisão não encontrada ou acesso negado");
  }

  // Calcula o tempo em minutos entre criação e conclusão
  const durationInMinutes = Math.max(
    dayjs().diff(dayjs(review.createdAt), "minute"),
    1
  );

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      completed: true,
      durationInMinutes,
      updatedAt: new Date(),
    },
  });

  // Incrementa pontos do usuário
  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: 5 } },
  });

  return updatedReview;
}

export async function getUserProgress(userId: number) {
  const plans = await prisma.studyPlan.findMany({ where: { userId } });
  const reviews = await prisma.review.findMany({ where: { userId } });

  const completedPlans = plans.filter(p => p.completed).length;
  const completedReviews = reviews.filter(r => r.completed).length;

  const totalActivities = plans.length + reviews.length;
  const completedActivities = completedPlans + completedReviews;

  return {
    totalPlans: plans.length,
    completedPlans,
    totalReviews: reviews.length,
    completedReviews,
    progressPercent: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0,
  };
}
