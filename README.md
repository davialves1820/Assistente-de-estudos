# StudyAI - Backend

> Backend de um assistente de estudos inteligente com planos de estudo, revisões, flashcards e gamificação.

---

## 🧠 Descrição do Projeto

O **StudyAI** é uma plataforma de backend que permite:

- Cadastro e autenticação de usuários.
- Geração automática de planos de estudo semanais usando IA.
- Criação de revisões, quizzes e flashcards automáticos.
- Sistema de progresso e gamificação (pontos por atividades concluídas).
- Suporte a níveis de dificuldade e histórico de estudos.
- Preparado para integração com notificações e lembretes de estudo.

O backend é desenvolvido em **TypeScript** usando **Fastify**, **Prisma** e a API da **OpenAI**.

---

## ⚡ Funcionalidades

### Funcionalidades principais

1. **Autenticação de usuários**
   - Registro com email, senha e nome.
   - Login com geração de JWT com expiração de 1 hora.
   - Proteção de rotas privadas com `authenticate`.

2. **Planos de estudo**
   - Criação de planos personalizados por assunto.
   - Nível de dificuldade configurável (iniciante, intermediário, avançado).
   - Flashcards automáticos vinculados ao plano.
   - Marcar planos como concluídos e acumular pontos.

3. **Revisões**
   - Criação de perguntas de revisão via IA.
   - Flashcards automáticos.
   - Marcar revisões como concluídas e acumular pontos.

4. **Gamificação**
   - Sistema de pontos:
     - +10 pontos por plano concluído.
     - +5 pontos por revisão concluída.
   - Histórico e cálculo de progresso do usuário.

5. **Endpoints de progresso**
   - Visualizar percentual de progresso de planos e revisões.
   - Contabilização automática de atividades concluídas.

6. **Preparado para futuras funcionalidades**
   - Notificações e lembretes de estudo.
   - Grupos de estudo e compartilhamento de planos.

---

## 🛠 Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Fastify** (servidor HTTP)
- **Prisma** (ORM) com **PostgreSQL**
- **OpenAI** (IA para geração de planos e revisões)
- **Zod** (validação de dados)
- **bcrypt** (hash de senhas)
- **JWT** (autenticação)
- **Dotenv** (variáveis de ambiente)

---

## 🚀 Estrutura do Projeto

```
/backend
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ index.ts
│  ├─ types.d.ts
│  ├─ prismaClient.ts
│  ├─ services/
│  │  ├─ aiService.ts
│  │  ├─ authService.ts
│  │  └─ progressService.ts
│  ├─ schemas/
│  │  ├─ authSchema.ts
│  │  └─ studySchema.ts
│  └─ routes/
│     ├─ authRoutes.ts
│     ├─ planRoutes.ts
│     └─ reviewRoutes.ts
```

---

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/studyai-backend.git
cd studyai-backend
```

2. Instale dependências:
```bash
npm install
```

3. Configure variáveis de ambiente (`.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/studyai"
JWT_SECRET="uma_chave_super_secreta"
OPENAI_API_KEY="sua_chave_openai"
```

4. Configure o banco de dados e rode migrations:
```bash
npx prisma migrate dev --name init
```

5. Inicie o servidor:
```bash
npm run dev
```

Servidor rodando em: `http://localhost:3333`

---

## 📌 Endpoints

### **Auth**
| Método | Endpoint       | Descrição                    |
|--------|----------------|------------------------------|
| POST   | /register      | Registrar usuário            |
| POST   | /login         | Login e geração de JWT       |

### **Study Plan**
| Método | Endpoint                   | Descrição                                 |
|--------|----------------------------|-------------------------------------------|
| POST   | /study-plan               | Criar plano de estudo (com nível)        |
| POST   | /study-plan/:id/complete  | Marcar plano como concluído e ganhar pontos |
| GET    | /study-plans              | Listar todos os planos do usuário        |

### **Review**
| Método | Endpoint                   | Descrição                                 |
|--------|----------------------------|-------------------------------------------|
| POST   | /review                    | Criar revisão + flashcard                 |
| POST   | /review/:id/complete       | Marcar revisão como concluída e ganhar pontos |
| GET    | /reviews                   | Listar revisões do usuário               |

### **Progress**
| Método | Endpoint       | Descrição                      |
|--------|----------------|--------------------------------|
| GET    | /progress      | Retorna percentual de progresso e atividades concluídas |

---

## 🔒 Segurança

- Senhas armazenadas com **bcrypt**.
- JWT com **expiração de 1 hora**.
- Rotas privadas protegidas por middleware `authenticate`.
- Validação de dados via **Zod**.

---

## 💡 Funcionalidades Futuras

- Envio de notificações e lembretes automáticos.
- Gamificação avançada: badges, ranks, desafios.
- Compartilhamento de planos e revisões com outros usuários.
- Grupos de estudo colaborativos.