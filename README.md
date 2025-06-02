# Sincronização de Dados entre Bancos PostgreSQL

Este projeto demonstra uma sincronização de dados entre dois bancos PostgreSQL usando Docker Compose:

- Um banco PostgreSQL externo (simulando um banco de produção)
- Um banco PostgreSQL interno (simulando um banco local)

## Pré-requisitos

- Docker
- Docker Compose
- DBeaver (opcional, para visualização dos dados)

## Como Executar

### 1. Iniciar os Serviços

```bash
# Parar containers existentes (se houver)
docker-compose down

# Iniciar todos os serviços
docker-compose up -d

# Verificar se os containers estão rodando
docker ps
```

### 2. Criar Tabelas e Dados de Teste

```bash
# Criar tabela no banco externo
docker exec external-postgres psql -U external_user -d external_db -c "
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);"

# Inserir dados de teste
docker exec external-postgres psql -U external_user -d external_db -c "
INSERT INTO users (name, email) VALUES
('Teste 1', 'teste1@email.com'),
('Teste 2', 'teste2@email.com'),
('Teste 3', 'teste3@email.com');"
```

### 3. Acessando os Bancos via DBeaver

#### Banco Externo

- Host: localhost
- Port: 5433
- Database: external_db
- Username: external_user
- Password: external_pass

#### Banco Interno

- Host: localhost
- Port: 5432
- Database: cronjob_db
- Username: postgres
- Password: postgres

### 4. Monitoramento

```bash
# Ver logs da aplicação de sincronização
docker logs -f sync-app

# Ver dados no banco externo
docker exec external-postgres psql -U external_user -d external_db -c "SELECT * FROM users;"

# Ver dados no banco interno
docker exec internal-postgres psql -U postgres -d cronjob_db -c "SELECT * FROM users;"
```

### 5. Testando a Sincronização

1. Adicione um novo usuário no banco externo:

```bash
docker exec external-postgres psql -U external_user -d external_db -c "
INSERT INTO users (name, email) VALUES ('Novo Usuario', 'novo@email.com');"
```

2. Aguarde alguns segundos e verifique se o dado foi sincronizado no banco interno:

```bash
docker exec internal-postgres psql -U postgres -d cronjob_db -c "SELECT * FROM users;"
```

### 6. Parando os Serviços

```bash
# Parar todos os serviços
docker-compose down
```

## Estrutura do Projeto

```
.
├── app/
│   ├── src/
│   │   ├── apps/
│   │   │   └── users/
│   │   │       ├── entities/
│   │   │       │   └── user.entity.ts
│   │   │       └── services/
│   │   │           └── user-sync.service.ts
│   │   └── scripts/
│   │       └── sync-users.ts
│   └── Dockerfile
└── docker-compose.yaml
```

## Useful Commands

```bash
# Get all resources
kubectl get all

# Get CronJob details
kubectl describe cronjob user-sync

# Get logs from specific job
kubectl logs job/user-sync-<job-id>

# Delete all jobs
kubectl delete jobs --all

# Delete all failed pods
kubectl delete pods --field-selector status.phase=Failed
```

## Troubleshooting

### Image Pull Issues

If you see `ErrImagePull` or `ImagePullBackOff`:

1. Ensure you're using Minikube's Docker daemon: `eval $(minikube -p minikube docker-env)`
2. Rebuild the image: `docker build -t cron-job-app:latest .`
3. Delete the failed pods: `kubectl delete pods --field-selector status.phase=Failed`

### Database Connection Issues

1. Verify PostgreSQL is running: `kubectl get pods | grep postgres`
2. Check PostgreSQL logs: `kubectl logs <postgres-pod-name>`
3. Verify secrets are created: `kubectl get secrets`
