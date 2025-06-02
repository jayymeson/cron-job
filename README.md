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

### 1. Configurar o Ambiente

```bash
# Iniciar o Minikube (se estiver usando localmente)
minikube start

# Configurar o Docker para usar o daemon do Minikube
eval $(minikube -p minikube docker-env)
```

### 2. Construir e Implantar

```bash
# Construir a imagem da aplicação
docker build -t cron-job-app:latest ./app

# Criar os recursos necessários
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/cronjob-sync.yaml

# Verificar se tudo está rodando
kubectl get all
```

### 3. Configurar o Banco de Dados Externo

```bash
# Criar tabela e inserir dados de teste
kubectl exec -it postgres-<pod-id> -- psql -U postgres -d cronjob_db -c "
INSERT INTO users (name, email) VALUES
('Teste 1', 'teste1@email.com'),
('Teste 2', 'teste2@email.com'),
('Teste 3', 'teste3@email.com');"
```

### 4. Monitorar a Sincronização

```bash
# Ver detalhes do CronJob
kubectl describe cronjob user-sync

# Ver logs do job mais recente
kubectl logs job/user-sync-<job-id>

# Ver dados no banco local
kubectl exec -it postgres-<pod-id> -- psql -U postgres -d cronjob_db -c "SELECT * FROM users;"
```

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
