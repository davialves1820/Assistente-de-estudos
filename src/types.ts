import 'fastify';

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any; // 👈 você pode trocar por (request: any, reply: any) => Promise<void> se quiser tipar
  }

  interface FastifyRequest {
    user?: any; // 👈 se você usa req.user (vindo do JWT)
  }
}

export interface JwtPayload {
  id: number;
  email: string;
}

export interface CreateStudyPlanBody {
  subjects: string[];
}

export interface CreateReviewBody {
  subject: string;
}
