# ContAI – Gerenciamento de Lançamentos Financeiros

ContAI é uma aplicação fullstack para registro e acompanhamento de lançamentos financeiros mensais. Permite cadastrar, visualizar, editar e excluir registros de crédito e débito por mês e ano.

## Tecnologias

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide
- **Backend**: Node.js, Express, TypeScript, TypeORM, class-validator
- **Banco de Dados**: PostgreSQL

## Funcionalidades

- Cadastro, edição e exclusão de lançamentos
- Filtro por ano e agrupamento por mês
- Cálculo automático de totais por tipo
- Máscara para valores monetários e tipo (Crédito/Débito)

## Execução

1. Instale as dependências com `npm install` em `client/` e `server/`
2. Configure a conexão PostgreSQL no backend
3. Rode o backend e frontend separadamente com `npm run dev`
