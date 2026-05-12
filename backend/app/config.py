from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str
    supabase_url: str
    supabase_service_key: str
    github_token: str
    github_vault_repo: str
    github_vault_branch: str = "main"
    james_system_prompt: str = (
        "Você é James, assistente pessoal do Pedro. "
        "Responda em português, de forma direta e prática. "
        "Use as notas fornecidas como contexto quando relevantes."
    )
    claude_model: str = "claude-sonnet-4-6"
    max_context_notes: int = 5
    max_tokens: int = 1024

    class Config:
        env_file = ".env"


settings = Settings()
