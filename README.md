# 🎓 Assistente de Estudos

Sistema voltado para apoiar estudantes no **planejamento, registro e acompanhamento** de sessões de estudo de forma simples e eficaz.

---

## 🧭 Sumário

- [Visão Geral](#-visão-geral)  
- [Funcionalidades](#-funcionalidades)  
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)  
- [Estrutura do Projeto](#-estrutura-do-projeto)  
- [Instalação e Execução](#-instalação-e-execução)  
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)  
- [Endpoints da API](#-endpoints-da-api)  
- [Autenticação](#-autenticação)  
- [Como Contribuir](#-como-contribuir)  
- [Licença](#-licença)  
- [Contato](#-contato)  

---

## 🚀 Visão Geral

Este projeto oferece uma solução full‑stack com frontend e backend para que o estudante possa:  
- Criar planos de estudo (por disciplina, meta de horas etc)  
- Registrar suas sessões de estudo (horas estudadas, descrição, data)  
- Visualizar o progresso ao longo do tempo (por plano ou meta)  
- Manter um histórico e estatísticas que ajudam a entender seus hábitos  

A divisão principal do projeto é entre:  
- **Backend**: servidor, API, lógica de negócio e persistência de dados  
- **Frontend**: interface do usuário para interação  

---

## ✨ Funcionalidades

- Cadastro de usuário e login  
- Criação, edição e remoção de planos de estudo  
- Registro diário de atividades de estudo (horas, descrição)  
- Visualização de todas as atividades ligadas a um plano  
- Visualização de progresso/estatísticas (por exemplo, total horas, média por dia)  
- Rotas protegidas para usuários autenticados  
- Facilidade de uso e interface intuitiva  

---

## 🧰 Tecnologias Utilizadas

### **Backend**  
- TypeScript  
- Fastify  
- Prisma ORM  
- PostgreSQL  
- JSON Web Tokens (JWT)  
- CORS  
- dotenv  

### **Frontend**  
- React Native + Expo  
- TypeScript  
- Axios  
- AsyncStorage  
- React Navigation  

---

## 🗂 Estrutura do Projeto

```
Assistente‑de‑estudos/
│
├── backend/           # Código do servidor
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
│
├── frontend/          # Código do app/interface
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Instalação e Execução

### 1. Clone o repositório  
```bash
git clone https://github.com/davialves1820/Assistente‑de‑estudos.git
cd Assistente‑de‑estudos
```

### 2. Instalar e rodar o backend  
```bash
cd backend
npm install
```
Crie o arquivo `.env` com as variáveis necessárias:
```
DATABASE_URL="sua_string_de_conexão_ao_banco"
JWT_SECRET="sua_chave_secreta"
```
Execute as migrações e inicie o servidor:
```bash
npx prisma migrate dev
npm run dev
```
O backend estará disponível em `http://localhost:3333`

### 3. Instalar e rodar o frontend  
```bash
cd ../frontend
npm install
npm run start
```

---

## 📡 Endpoints da API

### **Auth**  
| Método | Rota | Descrição |
|--------|------|------------|
| POST | /register | Cria um novo usuário |
| POST | /login | Faz login e retorna token JWT |

### **Planos de Estudo**  
| Método | Rota | Descrição |
|--------|------|------------|
| GET | /plans | Lista planos do usuário |
| POST | /plans | Cria um novo plano |
| PUT | /plans/:id | Atualiza um plano |
| DELETE | /plans/:id | Deleta um plano |

### **Atividades**  
| Método | Rota | Descrição |
|--------|------|------------|
| GET | /plans/:planId/activities | Lista atividades |
| POST | /plans/:planId/activities | Adiciona nova atividade |
| PUT | /activities/:id | Atualiza uma atividade |
| DELETE | /activities/:id | Remove uma atividade |

