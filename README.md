# 🧱 Full-Stack Docker Project – Java Backend & Web Frontend
**Platform:** Azure Linux VM  
**Tools:** Docker • Docker Compose • GitHub Actions • Spring Boot • Nginx  

---

## 📖 Overview

This project demonstrates a **full-stack web application** deployment using **Docker**, **Docker Compose**, and **Azure Cloud Virtual Machine (VM)**.  
It consists of:

- A **Java Spring Boot backend** exposing REST APIs for student data management.  
- A **frontend web interface** served via **Nginx** that interacts with the backend through API calls.  
- Both services containerized, orchestrated, and deployed together.  

This project demonstrates practical knowledge of **containerization**, **CI/CD automation**, and **cloud deployment** workflows.

---

## 🚀 Project Objectives

1. Containerize both backend and frontend services.  
2. Use **Docker Compose** for multi-container orchestration.  
3. Push images to **Docker Hub**.  
4. Automate builds and pushes using **GitHub Actions**.  
5. Deploy and run containers on **Azure Linux VM**.  
6. Verify communication between frontend and backend.

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

GET    /api/students
POST   /api/students
Update /api/students
DELETE /api/students

````

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
````

---

## 🌐 Frontend (HTML + CSS + JavaScript)

**Dockerfile**

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Frontend communicates with backend using:

```javascript
fetch("http://<server-ip>:8080/api/students")
```

---

## 🐳 Docker Compose Configuration

**docker-compose.yml**

```yaml
services:
  backend:
    image: dukeyico/java-backend:latest
    volumes:
      - ./backend/src:/app/src
    build: ./backend
    container_name: java-backend
    develop:
      watch:
        - action: sync
          path: ./backend/src
          target: /app/src
        - action: rebuild
          path: ./backend/pom.xml

    ports:
      - "8080:8080"
  frontend:
    image: dukeyico/web-frontend:latest
    volumes:
      - ./frontend:/usr/share/nginx/html
    build: ./frontend
    container_name: web-frontend
    develop:
      watch:
        - action: sync
          path: ./frontend
          target: /usr/share/nginx/html
    ports:
      - "5173:80"
    depends_on:
      - backend
networks:
  app-network:
    driver: bridge
```
---

## 🧱 Build and Run Locally

```bash
docker compose up --build
```

Access:

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:8080/api/students](http://localhost:8080/api/students)

---

## ☁️ Deployment on Azure VM

1. SSH into VM:

   ```bash
   ssh user@<vm_public_ip>
   ```

2. Clone project:

   ```bash
   git clone https://github.com/<your_repo>.git
   cd docker-project
   ```

3. Run:

   ```bash
   sudo docker compose up --build -d
   ```

Access:

* Frontend → `http://<vm_public_ip>:5173`
* Backend → `http://<vm_public_ip>:8080/api/students`

---

## 🧱 Docker Hub Integration

### 1️⃣ Create Repositories

* `yourusername/java-backend`
* `yourusername/web-frontend`

### 2️⃣ Build and Tag

```bash
docker build -t yourusername/java-backend:v1.0.0 -t yourusername/java-backend:latest ./backend
docker build -t yourusername/web-frontend:v1.0.0 -t yourusername/web-frontend:latest ./frontend
```

### 3️⃣ Push Images

```bash
docker login --username yourusername
docker push yourusername/java-backend:v1.0.0
docker push yourusername/web-frontend:v1.0.0
```

---

## ⚙️ GitHub Actions CI/CD

**File:** `.github/workflows/docker-publish.yml`

```yaml
name: CI/CD Pipeline - Build, Push, Deploy

on:
  push:
    branches:
      - main  # Run only when you push to main branch

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # -----------------------------
      # Step 1: Checkout code
      # -----------------------------
      - name: Checkout repository
        uses: actions/checkout@v4

      # -----------------------------
      # Step 2: Set up Docker Buildx
      # -----------------------------
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # -----------------------------
      # Step 3: Log in to Docker Hub
      # -----------------------------
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      # -----------------------------
      # Step 4: Build & Push Backend Image
      # -----------------------------
      - name: Build and push backend image
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: dukeyico/java-backend:latest

      # -----------------------------
      # Step 5: Build & Push Frontend Image
      # -----------------------------
      - name: Build and push frontend image
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: dukeyico/web-frontend:latest

      # -----------------------------
      # Step 6: Deploy on Azure VM via SSH
      # -----------------------------
      - name: Deploy on Azure VM
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            cd ~/docker-project || git clone https://github.com/dukeyico/docker-project.git docker-project
            cd docker-project
            git pull origin main
            sudo docker compose down
            sudo docker pull dukeyico/java-backend:latest
            sudo docker pull dukeyico/web-frontend:latest
            sudo docker compose up -d
```

**Secrets Required:**

* `DOCKERHUB_USERNAME`
* `DOCKERHUB_TOKEN`
* `VM_HOST`
* `VM_USER`
* `VM_SSH_KEY`

---

## ✅ Deliverables

| Deliverable                            | Description                    |
| -------------------------------------- | ------------------------------ |
| `backend/Dockerfile`                   | (dukeyico/java-backend) [d]    |
| `frontend/Dockerfile`                  | Nginx-based frontend container |
| `docker-compose.yml`                   | Orchestration file for both    |
| `.github/workflows/docker-publish.yml` | CI/CD pipeline                 |
| Docker Hub Images                      | Published backend and frontend |
| Azure VM Deployment                    | Running full-stack app         |
| README.md                              | This documentation             |

---

## 🧠 Common Issues & Fixes

| Issue                    | Cause                                                       | Fix                                   |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------- |
| `ERR_CONNECTION_REFUSED` | Frontend used `localhost` instead of backend container name | Use backend service name or VM IP     |
| `403 Forbidden` (Nginx)  | Wrong HTML root path                                        | Copy files to `/usr/share/nginx/html` |
| `Permission denied`      | Root-owned files in VM                                      | `sudo chown -R $USER:$USER ./`        |
| `YAML validation error`  | Wrong indentation                                           | Validate YAML syntax properly         |

---

## 🧾 Verification

```bash
docker ps
curl http://localhost:8080/api/students
curl http://localhost:5173
```

Ensure both containers are running and frontend communicates with backend successfully.

---

## 🧩 Lessons Learned

* Building and tagging Docker images properly.
* Using Docker Compose for service orchestration.
* Automating builds and pushes via GitHub Actions.
* Managing cloud deployments on Azure VMs.
* Debugging container networking and permission issues.

---

## 📚 References

* [Docker Documentation](https://docs.docker.com)
* [Spring Boot Guide](https://spring.io/projects/spring-boot)
* [Nginx Docs](https://nginx.org)
* [GitHub Actions Docs](https://docs.github.com/actions)
* [Azure Docs](https://learn.microsoft.com/azure)

---
