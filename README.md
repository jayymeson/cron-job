# Sincronização de Dados entre Bancos PostgreSQL

Este projeto demonstra uma sincronização de dados entre dois bancos PostgreSQL, com suporte para dois ambientes:

- Docker Compose (desenvolvimento local)
- Kubernetes (produção)

## Pré-requisitos

- Docker e Docker Compose
- Kubernetes (Minikube ou cluster)
- kubectl
- DBeaver (opcional, para visualização dos dados)

## Opção 1: Executando com Docker Compose (Desenvolvimento)

### 1. Iniciar os Serviços

```bash
# Parar containers existentes (se houver)
docker-compose down

# Iniciar todos os serviços
docker-compose up -d

# Verificar se os containers estão rodando
docker ps
```

### 2. Criar Dados de Teste no Banco Externo

```bash
# Inserir dados de teste
docker exec external-postgres psql -U external_user -d external_db -c "
INSERT INTO users (name, email) VALUES
('Teste 1', 'teste1@email.com'),
('Teste 2', 'teste2@email.com'),
('Teste 3', 'teste3@email.com');"
```

### 3. Monitorar a Sincronização

```bash
# Ver logs da aplicação
docker logs -f sync-app

# Ver dados no banco externo
docker exec external-postgres psql -U external_user -d external_db -c "SELECT * FROM users;"

# Ver dados no banco interno
docker exec internal-postgres psql -U postgres -d cronjob_db -c "SELECT * FROM users;"
```

## Opção 2: Executando com Kubernetes (Produção)

### 1. Iniciar os Bancos de Dados (Necessário)

Primeiro, precisamos iniciar os bancos de dados usando Docker Compose. Para isso, use uma versão modificada do docker-compose.yml que contém apenas os serviços de banco de dados:

```bash
# Iniciar apenas os bancos de dados
docker-compose up -d internal-postgres external-postgres

# Verificar se os bancos estão rodando
docker ps
```

### 2. Configurar o Ambiente Kubernetes

```bash
# Iniciar o Minikube (se estiver usando localmente)
minikube start

# Configurar o Docker para usar o daemon do Minikube
eval $(minikube -p minikube docker-env)
```

### 3. Construir e Implantar

```bash
# Construir a imagem da aplicação
docker build -t cron-job-app:latest ./app

# Aplicar as configurações do Kubernetes
kubectl apply -f k8s/

# Verificar se tudo está rodando
kubectl get all
```

### 4. Iniciar a Sincronização

```bash
# Ativar o CronJob (por padrão inicia suspenso)
kubectl patch cronjob user-sync -p '{"spec":{"suspend":false}}'

# Verificar status do CronJob
kubectl get cronjobs
```

### 5. Monitorar a Sincronização

```bash
# Ver detalhes do CronJob
kubectl describe cronjob user-sync

# Ver logs do job mais recente (substitua <job-id> pelo ID real)
kubectl logs job/user-sync-<job-id>
```

### 6. Verificar os Dados

Você pode usar o DBeaver ou qualquer outro cliente SQL para verificar os dados:

- Banco interno (local): localhost:5432

  - Usuário: postgres
  - Senha: postgres
  - Database: cronjob_db

- Banco externo (local): localhost:5433
  - Usuário: external_user
  - Senha: external_pass
  - Database: external_db

### 7. Parar o Ambiente (Quando Necessário)

```bash
# Parar o Minikube
minikube stop

# Parar os bancos de dados
docker-compose down
```

### 8. Endpoints de Sincronização

O sistema possui dois endpoints para controlar a sincronização:

#### Iniciar Sincronização

```bash
# Inicia a sincronização imediatamente e ativa o CronJob
curl -X POST http://localhost:3000/sync/start
```

Este endpoint:

1. Executa uma sincronização imediata
2. Ativa o CronJob que continuará sincronizando a cada minuto

#### Parar Sincronização

```bash
# Suspende o CronJob de sincronização
curl -X POST http://localhost:3000/sync/stop
```

Este endpoint:

1. Suspende o CronJob, interrompendo as sincronizações automáticas
2. Mantém os dados já sincronizados

## Estrutura do Projeto

```
.
├── app/                      # Código da aplicação
│   ├── src/
│   │   ├── apps/users/      # Módulos relacionados a usuários
│   │   ├── scripts/         # Scripts de sincronização
│   │   └── shared/          # Código compartilhado
│   └── Dockerfile
├── k8s/                     # Configurações Kubernetes
│   ├── cronjob-sync.yaml    # CronJob para sincronização
│   ├── postgres.yaml        # Deployment do PostgreSQL
│   └── secret.yaml          # Secrets do Kubernetes
└── docker-compose.yaml      # Configuração Docker Compose
```

## Troubleshooting

### Problemas com Docker Compose

1. **Containers não iniciam:**

   ```bash
   # Verificar logs
   docker-compose logs

   # Reiniciar serviços
   docker-compose restart
   ```

2. **Problemas de conexão com banco:**

   ```bash
   # Verificar se os containers estão rodando
   docker ps

   # Verificar logs específicos
   docker logs external-postgres
   docker logs internal-postgres
   ```

### Problemas com Kubernetes

1. **Image Pull Issues:**

   ```bash
   # Verificar se está usando o daemon do Minikube
   eval $(minikube -p minikube docker-env)

   # Reconstruir a imagem
   docker build -t cron-job-app:latest ./app
   ```

2. **Pods não iniciam:**

   ```bash
   # Verificar status dos pods
   kubectl get pods

   # Ver logs detalhados
   kubectl describe pod <pod-name>
   ```

3. **Problemas com CronJob:**

   ```bash
   # Verificar status
   kubectl get cronjobs

   # Ver logs do último job
   kubectl logs job/user-sync-<job-id>
   ```

## Comandos Úteis

### Docker Compose

```bash
# Iniciar serviços em background
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f
```

### Kubernetes

```bash
# Ver todos os recursos
kubectl get all

# Ver logs de um pod
kubectl logs <pod-name>

# Executar comando em um pod
kubectl exec -it <pod-name> -- /bin/bash

# Deletar todos os jobs
kubectl delete jobs --all
```
