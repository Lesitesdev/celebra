# Celebra API (primeira etapa)

API Spring Boot para contas individuais/buffets, membros e eventos persistidos no PostgreSQL. Login e cadastro por e-mail ja estao ligados a tela `/entrar`; login Google cria uma conta individual no primeiro acesso. Esta etapa ainda nao cobra nem emite creditos.

## Requisitos locais

- Java 21
- Maven 3.6.3 ou superior
- Docker Desktop iniciado, para subir o banco de desenvolvimento

O projeto usa Spring Boot 4.1.2 com Java 21, ambos compatíveis com este ambiente. O starter MVC e as dependencias SQL seguem os guias oficiais do Spring Boot. [Requisitos do Spring Boot](https://docs.spring.io/spring-boot/system-requirements.html) · [Aplicacao MVC](https://docs.spring.io/spring-boot/tutorial/first-application/)

## Iniciar no PowerShell

Em um terminal na pasta `backend`:

```powershell
docker compose up -d postgres
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5433/celebra"
$env:SPRING_DATASOURCE_USERNAME = "celebra_dev"
$env:SPRING_DATASOURCE_PASSWORD = "celebra_dev_only"
$env:CELEBRA_JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$env:GOOGLE_CLIENT_ID = "seu-client-id.apps.googleusercontent.com"
$env:CELEBRA_PLATFORM_ADMIN_EMAILS = "admin@seudominio.com"
mvn spring-boot:run
```

Flyway cria o schema na primeira inicializacao. O segredo JWT acima e temporario para desenvolvimento; gere um segredo persistente no `.env` local antes de trabalhar com varias sessoes. Nunca reutilize a senha local nem esse arranjo em producao.

Para habilitar o Google, crie um OAuth Client ID do tipo Web no Google Cloud Console e adicione `http://localhost:3000` como origem JavaScript autorizada. Use o mesmo valor em `GOOGLE_CLIENT_ID` no terminal do backend e `NEXT_PUBLIC_GOOGLE_CLIENT_ID` no `.env.local` da raiz do Next.js (copie o `.env.example`). O backend valida a assinatura do token, o emissor, o Client ID destinatario e o e-mail verificado antes de criar ou acessar a conta.

## Admin da plataforma

A pagina interna fica em `http://localhost:3000/admin`. Ela mostra indicadores globais e contas de buffet/individuais. As rotas `GET /api/admin/overview` e `GET /api/admin/accounts` exigem token e verificam o e-mail cadastrado em `CELEBRA_PLATFORM_ADMIN_EMAILS`, uma lista separada por virgulas configurada apenas no ambiente do backend. Cadastre uma conta Celebra normal com esse e-mail, inclua o mesmo e-mail na variavel e reinicie a API. O cadastro publico nao concede permissao administrativa. Creditos, pagamentos e suporte aparecem como areas futuras porque ainda nao ha integracao de cobranca nem ferramentas operacionais para essas tarefas.

## Endpoints

- `GET /api/health` — status da API.
- `POST /api/auth/register` — cria usuario, conta individual ou buffet e membro OWNER.
- `POST /api/auth/login` — valida e-mail e senha, retorna token Bearer e contas do usuario.
- `GET /api/auth/me` — usuario autenticado.
- `GET /api/accounts/{accountId}/members` — lista membros da conta.
- `POST /api/accounts/{accountId}/members` — adiciona usuario ja cadastrado como ADMIN ou MEMBER.
- `GET /api/accounts/{accountId}/events` — lista eventos da conta.
- `POST /api/accounts/{accountId}/events` — cria evento como rascunho.
- `PUT /api/accounts/{accountId}/events/{eventId}` — atualiza evento da conta.
- `GET /api/public/invitations/{slug}` — retorna somente convite publicado.

As rotas de conta exigem `Authorization: Bearer <accessToken>` e validam a associacao do usuario com a conta. Eventos sao armazenados como JSONB para preservar os campos do editor enquanto o contrato do frontend evolui. O UUID e o slug publico sao gerados no servidor.

Cadastro de exemplo:

```json
{
  "email": "organizador@example.com",
  "password": "uma-senha-local-forte",
  "fullName": "Nome do organizador",
  "accountType": "BUFFET",
  "accountName": "Buffet Exemplo"
}
```

Use `INDIVIDUAL` no campo `accountType` para uma conta de pessoa fisica. O cadastro retorna `accounts[0].accountId`, usado nos endpoints de eventos e membros.

## Verificar e empacotar

```powershell
mvn test
mvn package
```

O banco e iniciado separadamente pelo Docker Compose. A API pode ser parada com `Ctrl+C`; pare o banco com `docker compose down` (os dados de desenvolvimento ficam no volume local).

## Proximas etapas

1. Integrar login e eventos do Next.js a esta API, removendo a dependencia de `localStorage` para contas autenticadas.
2. Criar ledger de creditos e bloquear publicacao sem credito.
3. Integrar checkout/webhooks de pagamento.
4. Mover fotos para armazenamento de objetos, em vez de gravar imagens base64 no JSON do evento.
