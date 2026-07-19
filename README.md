# Bookstore Manager CLI

Aplicação de linha de comando para gerenciamento de uma biblioteca. O sistema permite manter autores, livros, clientes e empréstimos, além de consultar relatórios sobre o acervo e os empréstimos.

## Objetivo

Oferecer uma interface simples para operações do dia a dia de uma biblioteca, aplicando separação de responsabilidades entre a interface de terminal, regras de negócio e persistência em banco de dados.

## Tecnologias utilizadas

- Node.js 24.x
- TypeScript 5.9.3
- PostgreSQL 16
- `pg` 8.22.0
- `dotenv` 16.6.1
- `tsx` 4.23.0, para execução em desenvolvimento
- Docker e Docker Compose, opcionalmente

As versões dos pacotes acima são as resolvidas em `package-lock.json`. O projeto declara faixas compatíveis no `package.json`.

## Requisitos para execução

### Sem Docker

- Node.js 24.x e npm;
- PostgreSQL 16 em execução;
- acesso para criar banco, tabelas e conectar-se ao PostgreSQL.

O Dockerfile usa a imagem `node:24-bookworm-slim`, que define a versão de Node recomendada para o projeto.

### Com Docker

- Docker Engine;
- Docker Compose v2 (`docker compose`).

## Configuração do banco de dados

Copie o arquivo de exemplo e ajuste as credenciais:

```bash
cp .env.example .env
```

Variáveis disponíveis:

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DB_HOST` | Host do PostgreSQL | `localhost` sem Docker; `db` com Docker |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `bookstore_manager` |
| `DB_USER` | Usuário do banco | `bmc_admin` |
| `DB_PASSWORD` | Senha do usuário | `troque-esta-senha` |

O esquema está em [`src/database/schema.sql`](src/database/schema.sql). Ele cria as tabelas `autores`, `clientes`, `livros` e `emprestimos`, incluindo as chaves estrangeiras necessárias.

### Banco local

Com o PostgreSQL local em execução e o `.env` configurado para `DB_HOST=localhost`, crie o banco e aplique o esquema:

```bash
createdb -U bmc_admin bookstore_manager
psql -U bmc_admin -d bookstore_manager -f src/database/schema.sql
```

Caso use outro usuário, banco, host ou porta, ajuste os comandos e o `.env` de forma consistente.

### Banco com Docker

O serviço `db` usa `postgres:16-alpine` e aplica o esquema automaticamente na primeira criação do volume. As credenciais são lidas do arquivo `.env`.

## Instalação

### Sem Docker

```bash
git clone <url-do-repositorio>
cd bookstore-manager-cli
cp .env.example .env
npm ci
```

Depois, configure e inicialize o banco conforme a seção anterior.

### Com Docker

```bash
git clone <url-do-repositorio>
cd bookstore-manager-cli
cp .env.example .env
docker compose up --build
```

O comando padrão também considera `docker-compose.override.yml`, iniciando a aplicação em modo de desenvolvimento e expondo o PostgreSQL na porta definida por `DB_PORT`.

Para encerrar os serviços, use `Ctrl+C` e depois:

```bash
docker compose down
```

O volume do banco é preservado. Para recriar o banco do zero, remova o volume com `docker compose down -v` — essa ação apaga os dados persistidos.

## Execução

### Desenvolvimento local

```bash
npm run dev
```

### Build e execução local

```bash
npm run build
npm start
```

### Docker

Após `docker compose up --build`, utilize o terminal conectado ao contêiner para interagir com os menus. O Compose aguarda a verificação de saúde do PostgreSQL antes de iniciar a aplicação.

## Arquitetura do projeto

O projeto segue uma organização em camadas:

```text
CLI (menus, entrada e apresentação)
        ↓
Controllers (coordenação dos casos de uso)
        ↓
Services (regras de negócio e validações)
        ↓
Repositories (consultas e transações PostgreSQL)
        ↓
Banco de dados
```

As factories montam cada funcionalidade com suas dependências (repositório, serviço, controller e menu), deixando o ponto de entrada enxuto. Os contratos por interface permitem que as camadas dependam de abstrações quando apropriado.

## Funcionalidades implementadas

- CRUD de autores, livros e clientes;
- busca por ID, nome e dados cadastrados;
- cadastro, devolução, remoção e busca de empréstimos;
- validação de dados de entrada e regras como disponibilidade de exemplares;
- listagem de empréstimos com título do livro e nome do cliente;
- relatórios de livros disponíveis, emprestados, por autor, mais emprestados, clientes com empréstimos ativos e atrasos;
- transações para operações que alteram empréstimos e estoque;
- mensagens amigáveis para entradas inválidas, falhas de conexão e erros de banco.

## Estrutura de pastas

```text
src/
├── cli/            # Entrada de terminal, menus e apresentação
├── controllers/    # Coordenação das operações da aplicação
├── database/       # Conexão e esquema SQL
├── dto/            # Objetos de transferência de dados
├── factories/      # Composição das funcionalidades e dependências
├── models/         # Entidades do domínio
├── repositories/   # Persistência PostgreSQL e mapeadores
├── services/       # Regras de negócio
├── shared/         # Constantes e erros compartilhados
└── main.ts         # Inicialização da aplicação
```

## Exemplos de utilização

No menu principal, escolha a funcionalidade pelo número correspondente.

### Cadastrar um autor

```text
1 - Gerenciar autores
2 - Cadastrar autor
Nome do autor: Machado de Assis
Ano de nascimento: 1839
Nacionalidade: Brasileira
```

### Cadastrar um livro

O autor precisa estar cadastrado previamente.

```text
2 - Gerenciar livros
2 - Cadastrar livro
Título: Dom Casmurro
Quantidade: 3
ID do autor: 1
```

### Registrar um empréstimo

Cadastre antes um livro disponível e um cliente.

```text
3 - Gerenciar empréstimos
2 - Emprestar livro
ID do livro: 1
ID do cliente: 1
```

Ao listar os empréstimos, a aplicação apresenta o título do livro e o nome do cliente, além das datas e da situação da devolução.

## Kanban

O acompanhamento das atividades do projeto está no [Kanban do Trello](https://trello.com/b/VPXxgKPp/bookstore-manager-cli).
