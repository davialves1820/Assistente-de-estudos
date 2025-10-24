import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string | undefined,
});

export async function generateStudyPlan(nameOrEmail: string, subjects: string[]) {
  const prompt = `Você é um assistente educacional. Crie um plano de estudos semanal detalhado para o(a) estudante ${nameOrEmail}.
Matérias: ${subjects.join(", ")}.
Dê um cronograma diário com tempo estimado de estudo por aula, metas de aprendizado e dicas de revisão. Seja objetivo e organizado.`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
    temperature: 0.7,
    max_tokens: 1100,
  });

  return res.choices?.[0]?.message?.content ?? "Não foi possível gerar o plano de estudos.";
}

export async function generateReviewQuestion(subject: string) {
  const prompt = `Gere UMA pergunta de revisão sobre o tema "${subject}" com a resposta correta e uma breve explicação (máx. 100 palavras).`;
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  });

  return res.choices?.[0]?.message?.content ?? "Erro ao gerar revisão.";
}
