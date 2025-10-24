import { z } from "zod";

export const studyPlanSchema = z.object({
  subjects: z.array(z.string().min(2)).min(1),
});

export const reviewSchema = z.object({
  subject: z.string().min(2),
});
