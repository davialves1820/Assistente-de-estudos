import { prisma } from "../prisma/client";

export async function completeStudyPlan(planId: number, userId: number) {
  const plan = await prisma.studyPlan.update({
    where: { id: planId },
    data: { completed: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: 10 } }, // 10 pontos por plano concluído
  });

  return plan;
}

export async function completeReview(reviewId: number, userId: number) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { completed: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: 5 } }, // 5 pontos por revisão concluída
  });

  return review;
}

export async function getUserProgress(userId: number) {
  const plans = await prisma.studyPlan.findMany({ where: { userId } });
  const reviews = await prisma.review.findMany({ where: { userId } });

  const completedPlans = plans.filter(p => p.completed).length;
  const completedReviews = reviews.filter(r => r.completed).length;

  return {
    totalPlans: plans.length,
    completedPlans,
    totalReviews: reviews.length,
    completedReviews,
    progressPercent: ((completedPlans + completedReviews) / (plans.length + reviews.length || 1)) * 100,
  };
}
