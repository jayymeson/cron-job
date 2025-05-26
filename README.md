# Cron Job NestJS Project

Este projeto é um boilerplate NestJS estruturado com cron jobs, PostgreSQL e Docker.

## Estrutura do Projeto

```
app/
├── src/
│   ├── apps/
│   │   └── users/
│   │       ├── controllers/     # Controllers REST
│   │       ├── use-cases/       # Use cases (incluindo cron jobs)
│   │       ├── entities/        # Entidades do banco
│   │       ├── interfaces/      # Interfaces e contratos
│   │       └── dto/            # Data Transfer Objects
│   ├── infra/
│   │   ├── database/           # Configuração do banco
│   │   └── repositories/       # Implementações dos repositórios
│   ├── shared/
│   │   ├── services/           # Serviços de negócio
│   │   ├── exceptions/         # Exceções customizadas
│   │   ├── scripts/            # Scripts utilitários
│   │   └── config/            # Configurações
│   └── common/                 # Utilitários comuns
```

## Funcionalidades

- ✅ CRUD completo de usuários
- ✅ Cron job que atualiza timestamp dos usuários a cada 5 minutos
- ✅ PostgreSQL com TypeORM
- ✅ Docker e Docker Compose
- ✅ Validação de dados
- ✅ Health check endpoint
- ✅ Estrutura modular e escalável
- ✅ Script de seed para popular o banco
- ✅ Arquitetura limpa com separação de responsabilidades

## Como executar

### Opção 1: Usando Docker Compose (Recomendado para produção)

```bash
docker-compose up --build
```

### Opção 2: Script de desenvolvimento (Recomendado para desenvolvimento)

```bash
./start-dev.sh
```

Este script irá:

1. Verificar se o Docker está rodando
2. Iniciar um container PostgreSQL
3. Instalar dependências (se necessário)
4. Popular o banco com dados de exemplo
5. Iniciar a aplicação em modo desenvolvimento

### Opção 3: Desenvolvimento manual

1. Instale as dependências:

```bash
cd app
npm install
```

2. Configure o banco PostgreSQL local ou use Docker:

```bash
docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cronjob_db -p 5432:5432 -d postgres:15-alpine
```

3. Execute o seed do banco:

```bash
npm run seed
```

4. Execute a aplicação:

```bash
npm run start:dev
```

## Endpoints da API

### Usuários

- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `GET /users/status/active` - Lista usuários ativos
- `POST /users` - Cria novo usuário
- `PATCH /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário

### Health Check

- `GET /health` - Status da aplicação

## Exemplo de uso

Você pode usar o arquivo `api-examples.http` para testar os endpoints ou usar curl:

### Criar usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }'
```

### Listar usuários

```bash
curl http://localhost:3000/users
```

## Cron Job

O cron job `UpdateUsersTimestampUseCase` executa automaticamente a cada 5 minutos e:

1. Busca todos os usuários ativos
2. Atualiza o campo `updatedAt` de cada usuário
3. Registra logs detalhados do processo

### Configuração do Cron Job

O cron job está configurado em `src/apps/users/use-cases/update-users-timestamp.use-case.ts`:

```typescript
// Execute every 5 minutes
this.updateUsersJob = "*/5 * * * *";
```

Para alterar a frequência, modifique a expressão cron:

- `*/1 * * * *` - A cada minuto
- `*/10 * * * *` - A cada 10 minutos
- `0 */1 * * *` - A cada hora
- `0 0 * * *` - Todo dia à meia-noite

## Configuração

As configurações estão no arquivo `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=cronjob_db
DATABASE_SYNC=true
DATABASE_LOGGING=true
NODE_ENV=development
PORT=3000
```

## Scripts Disponíveis

```bash
npm run start:dev    # Desenvolvimento com hot reload
npm run build        # Build da aplicação
npm run start:prod   # Produção
npm run seed         # Popular banco com dados de exemplo
npm run lint         # Verificar código
npm run test         # Executar testes
```

## Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados
- **Docker & Docker Compose** - Containerização
- **Class Validator** - Validação de dados
- **Cron Jobs** - Tarefas agendadas
- **TypeScript** - Linguagem tipada

## Logs

Os logs do cron job incluem:

- Início e fim da execução
- Quantidade de usuários processados
- Detalhes de cada usuário atualizado
- Tratamento de erros

Exemplo de log:

```
[UpdateUsersTimestampUseCase] Cron job "updateUsersTimestamp" started successfully
[UpdateUsersTimestampUseCase] START UPDATE USERS TIMESTAMP
[UpdateUsersTimestampUseCase] Found 4 active users to update
[UpdateUsersTimestampUseCase] Updated timestamp for user: joao@example.com
[UpdateUsersTimestampUseCase] Updated timestamp for user: maria@example.com
[UpdateUsersTimestampUseCase] Updated timestamp for user: pedro@example.com
[UpdateUsersTimestampUseCase] Updated timestamp for user: ana@example.com
[UpdateUsersTimestampUseCase] FINISH UPDATE USERS TIMESTAMP
```

## Arquitetura

O projeto segue os princípios da **Arquitetura Limpa**:

- **Entities**: Modelos de domínio (`src/apps/users/entities/`)
- **Use Cases**: Regras de negócio (`src/apps/users/use-cases/`)
- **Interface Adapters**: Controllers e repositórios (`src/apps/users/controllers/`, `src/infra/repositories/`)
- **Frameworks**: NestJS, TypeORM, etc.

### Injeção de Dependência

O projeto usa injeção de dependência com interfaces para facilitar testes e manutenção:

```typescript
// Interface
export interface IUserRepository {
  findAll(): Promise<User[]>;
  // ...
}

// Implementação
@Injectable()
export class UserRepository implements IUserRepository {
  // ...
}

// Uso no serviço
@Injectable()
export class UserService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) {}
}
```

## Próximos Passos

Para expandir o projeto, você pode:

1. **Adicionar autenticação** com JWT
2. **Implementar mais cron jobs** para diferentes funcionalidades
3. **Adicionar testes unitários e de integração**
4. **Implementar cache** com Redis
5. **Adicionar monitoramento** com Prometheus/Grafana
6. **Implementar rate limiting**
7. **Adicionar documentação** com Swagger

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
