import { FastifyInstance } from "fastify";
import { prisma } from "../prisma/client";
import dayjs from "dayjs";

export async function activityRoutes(app: FastifyInstance) {
    app.get("/activity", { preValidation: [app.authenticate] }, async (req: any, reply) => {
        const user = req.user;

        // Pega data atual e início da semana (domingo)
        const today = dayjs();
        const startOfWeek = today.startOf("week"); // domingo
        const endOfWeek = today.endOf("week");

        // Busca planos de estudo e revisões concluídos na semana atual
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

        // Simula que cada plano ou revisão concluído vale 1h de estudo
        [...plans, ...reviews].forEach((item) => {
        const dayIndex = dayjs(item.updatedAt).day(); // 0=Dom, 6=Sáb
        weeklyActivity[dayIndex] += 1;
        });

        const totalStudyTime = weeklyActivity.reduce((a, b) => a + b, 0);

        // --- Calcular streak (dias consecutivos com estudo) ---
        const sortedDates = [...plans, ...reviews]
        .map((i) => dayjs(i.updatedAt).startOf("day").format("YYYY-MM-DD"))
        .filter((v, i, arr) => arr.indexOf(v) === i) // remove duplicatas
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
        weeklyActivity,
        totalStudyTime,
        streak,
        });
    });
}
