# Kubernetes CronJob Data Synchronization

This project demonstrates a Kubernetes CronJob that synchronizes user data between an external PostgreSQL database and a local one running in the cluster.

## Architecture

- External PostgreSQL database running via Docker
- Local PostgreSQL database running in Kubernetes
- Kubernetes CronJob that runs every minute to sync data

## Prerequisites

- Docker
- Kubernetes (Minikube)
- kubectl
- Node.js 18+

## Setup Instructions

### 1. Start Minikube

```bash
# Start Minikube
minikube start

# Enable the ingress addon (if needed)
minikube addons enable ingress

# Verify Minikube is running
minikube status
```

### 2. Build and Load Docker Image

```bash
# Point your shell to minikube's docker-daemon
eval $(minikube -p minikube docker-env)

# Build the application image (from the app directory)
cd app
docker build -t cron-job-app:latest .
cd ..

# Verify the image is built
docker images | grep cron-job-app
```

### 3. Start External PostgreSQL Database

```bash
# Start the external database
docker-compose up -d external-postgres

# Verify it's running
docker ps | grep external-postgres
```

### 4. Apply Kubernetes Manifests

Apply the manifests in the following order:

```bash
# Create secrets first
kubectl apply -f k8s/secret.yaml

# Create ConfigMap
kubectl apply -f k8s/configmap.yaml

# Create local PostgreSQL database
kubectl apply -f k8s/postgres.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

# Create the CronJob
kubectl apply -f k8s/cronjob-sync.yaml
```

### 5. Populate External Database

```bash
# Run the seed script
npm run seed:external
```

### 6. Monitor the Synchronization

```bash
# Watch CronJobs, Jobs, and Pods
watch -n 2 "kubectl get cronjobs,jobs,pods"

# Check CronJob logs (replace <pod-name> with actual pod name)
kubectl logs job/user-sync-<job-id>

# Check data in local database
kubectl exec -it postgres-<pod-id> -- psql -U postgres -d cronjob_db -c "SELECT * FROM users;"
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

## Project Structure

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
├── k8s/
│   ├── configmap.yaml
│   ├── cronjob-sync.yaml
│   ├── postgres.yaml
│   └── secret.yaml
└── docker-compose.yaml
```

## Cleanup

```bash
# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete

# Stop Docker containers
docker-compose down
```
