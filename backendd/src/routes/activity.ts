import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma/client";
import dayjs from "dayjs";

interface DailyActivityBody {
  planId: number;
  dayIndex: number;
  hours: number;
  description: string;
}

export async function activityRoutes(app: FastifyInstance) {
  app.get("/activity", { preValidation: [app.authenticate] }, async (req: any, reply) => {
    const user = req.user;

    const today = dayjs();
    const startOfWeek = today.startOf("week");
    const endOfWeek = today.endOf("week");

    // Busca planos e revisões concluídos na semana atual
    const [plans, reviews] = await Promise.all([
      prisma.studyPlan.findMany({
        where: {
          userId: user.id,
          completed: true,
          updatedAt: {
            gte: startOfWeek.toDate(),
            lte: endOfWeek.toDate(),
          },
        },
      }),
      prisma.review.findMany({
        where: {
          userId: user.id,
          completed: true,
          updatedAt: {
            gte: startOfWeek.toDate(),
            lte: endOfWeek.toDate(),
          },
        },
      }),
    ]);

    // Inicializa array [0,0,0,0,0,0,0] (Dom a Sáb)
    const weeklyActivity = Array(7).fill(0);

    // Calcula tempo real de estudo por dia (em horas)
    [...plans, ...reviews].forEach((item) => {
      const dayIndex = dayjs(item.updatedAt).day();

      // Tenta usar `duration` (em minutos); senão calcula pela diferença de createdAt e updatedAt
      const durationMinutes =
        item.duration ??
        Math.max(dayjs(item.updatedAt).diff(dayjs(item.createdAt), "minute"), 0);

      const durationHours = durationMinutes / 60;
      weeklyActivity[dayIndex] += durationHours;
    });

    // Soma total da semana
    const totalStudyTime = parseFloat(
      weeklyActivity.reduce((a, b) => a + b, 0).toFixed(2)
    );

    // --- Calcular streak (dias consecutivos com estudo) ---
    const sortedDates = [...plans, ...reviews]
      .map((i) => dayjs(i.updatedAt).startOf("day").format("YYYY-MM-DD"))
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort();

    let streak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const current = dayjs(sortedDates[i]);
      const prev = i > 0 ? dayjs(sortedDates[i - 1]) : null;

      if (!prev || current.diff(prev, "day") === 1) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return reply.send({
      weeklyActivity: weeklyActivity.map((v) => parseFloat(v.toFixed(2))),
      totalStudyTime,
      streak,
    });
  });

  
}
