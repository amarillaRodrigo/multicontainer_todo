# Multi-Container Todo Application

## Objetivo

Implementar una API de TODOs en Node.js + Express + MongoDB, dockerizada y desplegable en entorno local con Vagrant, incluyendo CI/CD con GitHub Actions sobre un runner self-hosted.

## Requerimientos funcionales de la API

Endpoints:

- `GET /todos` — listar todos los TODOs
- `POST /todos` — crear TODO
- `GET /todos/:id` — obtener TODO por id
- `PUT /todos/:id` — actualizar TODO por id
- `DELETE /todos/:id` — eliminar TODO por id

### Modelo de datos (MongoDB + Mongoose)

- `title`: `string`, requerido, `trim`, longitud mínima 1
- `description`: `string`, opcional
- `completed`: `boolean`, default `false`
- `createdAt`, `updatedAt`: timestamps automáticos

### Contratos y validaciones

- `PUT /todos/:id` se define como **actualización parcial** (solo campos enviados).
- `400` para ObjectId inválido.
- `404` cuando el recurso no existe.
- Formato de error estándar:

```json
{ "error": "mensaje" }
```

## Dockerización (Requirement #1)

Se usarán dos archivos de Compose:

- `docker-compose.yml` para desarrollo:
  - API con `nodemon`
  - bind mount del código para hot reload
  - MongoDB
- `docker-compose.prod.yml` para producción:
  - API sin `nodemon`
  - consumo de imagen publicada en Docker Hub
  - MongoDB y servicios auxiliares necesarios

Persistencia:

- Volumen nombrado `mongo_data` para MongoDB.

### Ejecución local con Compose

Desarrollo (recarga automática):

```bash
docker compose up --build
```

Producción (imagen publicable):

```bash
docker compose -f docker-compose.prod.yml up -d
```

Para usar una imagen publicada propia:

```bash
TODO_API_IMAGE=usuario/repositorio:tag docker compose -f docker-compose.prod.yml up -d
```

## Infraestructura local (Requirement #2 adaptado)

### Decisión de alcance

No se usará cloud público (DigitalOcean/AWS). Se implementará solo en entorno local con Vagrant.

> Esta decisión se documenta como excepción explícita respecto al requirement #2 original (servidor remoto en cloud).

### Aprovisionamiento

- **Terraform local** para crear/provisionar la VM.
- **Ansible** para configurar la VM:
  - instalación de Docker y Docker Compose
  - autenticación/pull de imagen desde Docker Hub
  - ejecución de contenedores con `docker compose`

### Flujo reproducible de VM local (Rebanada 7)

Desde `infra\terraform`:

```bash
terraform init
terraform apply -auto-approve
```

Desde `infra\ansible`:

```bash
ansible-playbook playbooks/bootstrap.yml
ansible-playbook playbooks/deploy.yml
```

Para forzar una imagen concreta en despliegue:

```bash
TODO_API_IMAGE=usuario/repositorio:tag ansible-playbook playbooks/deploy.yml
```

## CI/CD (Requirement #3, adaptado a local)

- Repositorio en GitHub.
- GitHub Actions con **self-hosted runner** dentro de la VM de Vagrant.
- Flujo de despliegue:
  1. build de imagen
  2. push a Docker Hub
  3. bootstrap + deploy en VM vía Ansible (`bootstrap.yml` y `deploy.yml`)

### Pipeline implementado (Rebanada 8)

Workflow: `.github/workflows/ci-cd.yml`

- Trigger automático en `push` a `main` (y manual con `workflow_dispatch`).
- Job `build_and_push` en `ubuntu-latest` para publicar imagen en Docker Hub.
- Job `deploy` en `self-hosted` que ejecuta:
  - `ansible-playbook playbooks/bootstrap.yml`
  - `ansible-playbook playbooks/deploy.yml`

Secrets requeridos en GitHub:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

## Bonus: Reverse Proxy con Nginx

- Se incluirá Nginx como contenedor en Compose.
- Acceso mediante hostname local `todo.local`.
- Requiere entrada en archivo hosts del sistema apuntando a la VM.

### Verificación reproducible de `todo.local` (Rebanada 9)

1. Levantar el stack productivo con Nginx:

```bash
docker compose -f docker-compose.prod.yml up -d
```

2. Agregar entrada en hosts local:

```text
127.0.0.1 todo.local
```

3. Verificar enrutamiento del proxy:

```bash
curl http://todo.local/todos
```

## Testing

Se incluirán tests de integración mínimos para:

- los 5 endpoints principales
- casos de error `400` (id inválido) y `404` (no encontrado)

## Orden de implementación acordado

1. API + Mongo + tests de integración
2. Docker (dev/prod compose)
3. Terraform local + Ansible
4. GitHub Actions con self-hosted runner
5. Nginx reverse proxy
