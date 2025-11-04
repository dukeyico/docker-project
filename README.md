# 🧱 Full-Stack Docker Project – Java Backend & Web Frontend

**Platform:** Azure Linux VM
**Tools:** Docker • Docker Compose • GitHub Actions • Spring Boot • Nginx

---

## 📖 Overview

This project demonstrates the full **containerization and deployment of a two-tier web application** using **Docker**, **Docker Compose**, and **Azure Cloud Virtual Machine (VM)**.
It consists of:

* A **Java Spring Boot backend** providing REST APIs for student data management.
* A **frontend web interface** served through **Nginx**.
* Both services containerized, orchestrated, and deployed together using **Docker Compose**.

The project validates practical knowledge in **containerization**, **CI/CD automation**, and **cloud-based deployment** workflows.

---

## 🚀 Objectives

1. Containerize backend (Java) and frontend (HTML/JS) services.
2. Use Docker Compose to orchestrate both containers.
3. Build and push Docker images to Docker Hub.
4. Automate builds and pushes using GitHub Actions CI/CD.
5. Deploy and run containers on an Azure Linux VM.
6. Validate container communication and public accessibility.

---

## 🧩 Project Structure

```
docker-project/
│
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── model/Student.java
│   │   ├── service/StudentService.java
│   │   └── controller/StudentController.java
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── Dockerfile
│
├── docker-compose.yml
└── .github/workflows/docker-publish.yml
```

---

## ⚙️ Backend (Spring Boot)

**API Endpoints**

```
GET     /api/students
POST    /api/students
PUT     /api/students/{id}
DELETE  /api/students/{id}
```

**Dockerfile**

```dockerfile
# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 🌐 Frontend (HTML + CSS + JavaScript)

**Dockerfile**

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Frontend connects to backend using:

```javascript
fetch("http://20.0.250.3:8080/api/students")
```

---

## 🐳 Docker Compose Configuration

### Local Environment

```yaml
services:
  backend:
    image: dukeyico/java-backend:latest
    build: ./backend
    container_name: java-backend
    ports:
      - "8080:8080"
  frontend:
    image: dukeyico/web-frontend:latest
    build: ./frontend
    container_name: web-frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
```

### Azure Cloud Deployment

```yaml
services:
  backend:
    image: dukeyico/java-backend:latest
    container_name: java-backend
    restart: always
    ports:
      - "8080:8080"

  frontend:
    image: dukeyico/web-frontend:latest
    container_name: web-frontend
    restart: always
    ports:
      - "5173:80"
    depends_on:
      - backend
```

---

## 🧱 Build and Run

### 🔹 Local Test

```bash
docker compose up --build
docker ps
```

Access:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:8080/api/students](http://localhost:8080/api/students)

### 🔹 Cloud Test (Azure VM)

```bash
ssh azureuser@20.0.250.3
sudo docker compose up -d
docker ps
```

Access:

* Frontend → [http://20.0.250.3:5173](http://20.0.250.3:5173)
* Backend → [http://20.0.250.3:8080/api/students](http://20.0.250.3:8080/api/students)

---

## ☁️ Deployment on Azure VM

**Option 1: Clone Repository and Deploy**

```bash
ssh azureuser@20.0.250.3
git clone https://github.com/dukeyico/docker-project.git
cd docker-project
sudo docker compose up -d
```

**Option 2: Manual Compose File Creation**

```bash
ssh azureuser@20.0.250.3
nano docker-compose.yml
# Paste YAML content
sudo docker compose up -d
```

---

## 🧱 Docker Hub Integration

### Repositories

* [dukeyico/java-backend](https://hub.docker.com/r/dukeyico/java-backend)
* [dukeyico/web-frontend](https://hub.docker.com/r/dukeyico/web-frontend)

### Build and Push Commands

```bash
docker build -t dukeyico/java-backend:latest ./backend
docker build -t dukeyico/web-frontend:latest ./frontend
docker push dukeyico/java-backend:latest
docker push dukeyico/web-frontend:latest
```

---

## ⚙️ GitHub Actions CI/CD

**File:** `.github/workflows/docker-publish.yml`

```yaml
name: CI/CD Pipeline - Build, Push, Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push backend image
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: dukeyico/java-backend:latest

      - name: Build and push frontend image
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: dukeyico/web-frontend:latest

      - name: Deploy on Azure VM
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            sudo docker compose down
            sudo docker pull dukeyico/java-backend:latest
            sudo docker pull dukeyico/web-frontend:latest
            sudo docker compose up -d
```

---

## 🔐 Required GitHub Secrets

| Secret Name          | Description                        | Example                                   |
| -------------------- | ---------------------------------- | ----------------------------------------- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username           | dukeyico                                  |
| `DOCKERHUB_TOKEN`    | Docker Hub access token            | dckr_pat_xxxxxxx                          |
| `VM_HOST`            | Public IP address of your Azure VM | 20.0.250.3                                |
| `VM_USER`            | SSH username for your VM           | azureuser                                 |
| `VM_SSH_KEY`         | Private SSH key content            | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |

**How to Create Secrets**

1. Go to your GitHub repository → **Settings**
2. Navigate to **Secrets and variables → Actions**
3. Click **New repository secret**
4. Add all five secrets listed above

---

## 🧾 Verification

```bash
docker ps
curl http://localhost:8080/api/students
curl http://localhost:5173
```

**Expected Result:**

* Both containers run successfully.
* The frontend communicates properly with backend APIs.

---

## ⚠️ Challenges Encountered

| Issue                             | Cause                                | Fix                                              |
| --------------------------------- | ------------------------------------ | ------------------------------------------------ |
| CORS & Cross-Container Networking | Different origins between containers | Added `@CrossOrigin(origins="*")` in Spring Boot |
| Dockerfile Build Path Errors      | Wrong build context                  | Corrected working directory and JAR path         |
| YAML Indentation Errors           | Misplaced keys                       | Fixed indentation and validated YAML             |
| VM Permission Denied              | Root-owned files                     | Used `sudo chown -R $USER:$USER ./`              |
| API Connectivity                  | Wrong base URL                       | Updated frontend API to use VM IP                |

---

## 🧠 Results

✅ Containers deployed successfully on Azure VM
✅ Backend and frontend images published on Docker Hub
✅ CI/CD pipeline automates builds and pushes
✅ System accessible via public IP with working API calls

---

## 📸 Screenshots / Logs

* Deployed containers visible via `docker ps`
* Images published on [Docker Hub](https://hub.docker.com/u/dukeyico)
* Successful GitHub Actions workflow runs
* Browser access to frontend and backend endpoints

---

## 🧩 Lessons Learned

* End-to-end Docker workflow from build to deployment
* Importance of automation in CI/CD pipelines
* Managing cloud infrastructure using Docker Compose
* Debugging network and permission issues on VMs
* Secure handling of GitHub secrets

---

## ✅ Deliverables

| Deliverable                                                                                                                         | Description                   |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [`backend/Dockerfile`](https://github.com/dukeyico/docker-project/blob/main/backend/Dockerfile)                                     | Java backend container        |
| [`frontend/Dockerfile`](https://github.com/dukeyico/docker-project/blob/main/frontend/Dockerfile)                                   | Nginx frontend container      |
| [`docker-compose.yml`](https://github.com/dukeyico/docker-project/blob/main/docker-compose.yml)                                     | Multi-container orchestration |
| [`.github/workflows/docker-publish.yml`](https://github.com/dukeyico/docker-project/blob/main/.github/workflows/docker-publish.yml) | CI/CD pipeline configuration  |
| [Docker Hub Images](https://hub.docker.com/u/dukeyico)                                                                              | Published backend & frontend  |
| [Azure VM Deployment](http://20.0.250.3:5173)                                                                                       | Live deployed application     |
| [README.md](https://github.com/dukeyico/docker-project/blob/main/README.md)                                                         | Full project documentation    |

---

## 🏁 Conclusion

This project achieved complete automation of container build, deployment, and orchestration.
Using **Docker**, **Compose**, and **GitHub Actions**, a reproducible two-tier web application was created and hosted on **Azure Cloud VM**.
It demonstrates real-world **DevOps**, **cloud deployment**, and **CI/CD best practices** that align with enterprise standards.

---

## 📚 References

* [Docker Documentation](https://docs.docker.com)
* [Spring Boot Guide](https://spring.io/projects/spring-boot)
* [Nginx Docs](https://nginx.org)
* [GitHub Actions Docs](https://docs.github.com/actions)
* [Azure Documentation](https://learn.microsoft.com/azure)

---
