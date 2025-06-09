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

1. Instale os arquivos de frontend e backend
2. Instale o schema do banco de dados em SQL e aplique no seu sistema
3. Configure a conexão PostgreSQL no backend
4. Rode o backend e frontend separadamente com `npm run dev` no cmd e acesse a página de forma local com o endereço do Vite
