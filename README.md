# 🐳 Dockerized 2-Tier Web App (Java + HTML/JS)

## 🎯 Overview
This is a two-tier full-stack web app built with:
- **Backend:** Spring Boot (Java + Maven)
- **Frontend:** HTML, CSS, JavaScript (served via Nginx)
- **Orchestration:** Docker Compose

When you click **Show Data**, the frontend calls the backend API to display student info.
When you click **Clear Data**, the data disappears (mock delete using JSON state).

---

## ⚙️ Setup

### 1. Clone repo
```bash
git clone https://github.com/<your-username>/docker-project.git
cd docker-project
