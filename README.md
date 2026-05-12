# James — Agente Pessoal

Assistente pessoal com memória baseada em vault do Obsidian, usando RAG + Claude API.

## Stack

| Camada | Tech | Onde roda |
|--------|------|-----------|
| Backend + RAG | FastAPI (Python) | Railway |
| Banco + vetores | Supabase + pgvector | Supabase |
| Memória fonte | Obsidian vault (.md) | GitHub repo |
| LLM | Claude API (claude-sonnet-4-6) | Anthropic |
| Frontend web | Next.js | Vercel / local |

## Setup rápido

### 1. Backend

```bash
cd backend
cp .env.example .env
# Preencha as variáveis no .env

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Acesse `http://localhost:8000/health` para verificar.

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Preencha NEXT_PUBLIC_JAMES_API_URL

npm install
npm run dev
```

Acesse `http://localhost:3000`.

### 3. Variáveis de ambiente (backend)

| Variável | Descrição |
|----------|-----------|
| `ANTHROPIC_API_KEY` | Chave da Anthropic API |
| `SUPABASE_URL` | URL do seu projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key do Supabase |
| `GITHUB_TOKEN` | Personal access token do GitHub |
| `GITHUB_VAULT_REPO` | `usuario/nome-do-repo` com o vault |
| `GITHUB_VAULT_BRANCH` | Branch do vault (padrão: `main`) |

### 4. Supabase (Fase 2 — RAG com embeddings)

Execute o SQL em `docs/supabase_setup.sql` no editor SQL do Supabase.

## Estrutura

```
james/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── config.py        # Settings via .env
│   │   ├── models/          # Pydantic models
│   │   ├── routers/         # Endpoints (chat, health)
│   │   └── services/
│   │       ├── vault.py     # Leitura das notas do GitHub
│   │       └── claude.py    # Integração Claude API
│   ├── requirements.txt
│   └── railway.toml
├── frontend/
│   └── app/
│       ├── chat/ChatPage.tsx    # Interface principal
│       ├── components/          # ChatMessage, ChatInput
│       └── lib/api.ts           # Cliente HTTP
└── docs/
    └── supabase_setup.sql       # Schema pgvector
```

## Roadmap

- **Fase 1** ✅ FastAPI + busca por palavras-chave + chat Next.js
- **Fase 2** Embeddings no Supabase pgvector (busca semântica)
- **Fase 3** App Expo mobile + sync bidirecional
- **Fase 4** James aprende e salva novas memórias automaticamente

## Deploy no Railway (backend)

1. Conecte o repositório no Railway
2. Defina as variáveis de ambiente no painel
3. O `railway.toml` já configura o build e health check automaticamente
