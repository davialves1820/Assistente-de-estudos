import 'fastify';

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any; 
  }

  interface FastifyRequest {
    user?: any;
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
