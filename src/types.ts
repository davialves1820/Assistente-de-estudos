import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
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
