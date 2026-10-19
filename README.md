# Celebra — MVP de frontend

Projeto inicial do Celebra, uma demonstração de criação, personalização e compartilhamento de convites digitais.

## Requisitos
- Node.js 20 ou superior (Node 22 também funciona)
- npm

## Como executar no VS Code
1. Extraia o arquivo ZIP.
2. Abra a pasta `celebra-mvp` no VS Code.
3. Abra o terminal integrado (**Terminal → Novo Terminal**).
4. Execute:

```bash
npm install
npm run dev
```

5. Abra `http://localhost:3000`.

## Fluxo sugerido para testar
1. Na página inicial, clique em **Criar convite grátis**.
2. Acesse a demonstração.
3. No painel, clique em **Criar novo evento**.
4. Preencha as etapas e escolha um modelo.
5. Personalize os textos e cores no editor.
6. Clique em **Publicar convite**.
7. Use **Visualizar** para abrir o convite público.
8. Envie uma confirmação de presença de teste.
9. Volte ao painel do evento e abra **Gerenciar convidados**.

Também existem convites de exemplo publicados:
- `/convite/marina-e-rafael`
- `/convite/aniversario-da-helena`

## Comandos úteis
```bash
npm run dev
npm run build
npm start
```

## Limitações desta versão
- Não possui backend, banco de dados ou autenticação real.
- Os dados ficam no `localStorage` do navegador; não sincronizam entre dispositivos.
- A publicação é apenas demonstrativa e não cria um link hospedado para outros usuários.
- Não há envio automático de WhatsApp ou e-mail.
- Imagens são composições feitas com CSS; não há upload de imagens.
- O armazenamento local não é adequado para uso comercial com dados reais.

## Próximos passos
1. Validar o fluxo e a identidade visual com usuários.
2. Criar backend Java com Spring Boot e PostgreSQL.
3. Implementar autenticação e autorização por usuário/organizador.
4. Migrar eventos, modelos e respostas RSVP para a API.
5. Implementar upload de imagens e armazenamento em nuvem.
6. Adicionar testes automatizados e políticas de privacidade.

## Estrutura principal
- `app/`: páginas e rotas Next.js App Router.
- `components/`: componentes de interface.
- `lib/data.ts`: modelos e dados de demonstração.
- `lib/storage.ts`: persistência local no navegador.
- `lib/types.ts`: tipos TypeScript.
