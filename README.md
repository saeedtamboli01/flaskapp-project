 A lightweight **Flask web application** fully containerized using **Docker** and **Docker Compose**. This project demonstrates how to package a Python web app into a portable Docker image and manage it with Docker Compose for consistent, reproducible deployments across any environment.

---

## 🚀 Project Overview

This project covers:

- Building a **Flask** web application from scratch
- Writing a clean, minimal **Dockerfile** to containerize the app
- Using **Docker Compose** to manage multi-service orchestration
- Configuring port binding, environment variables, and container networking
- Enabling one-command startup with `docker-compose up`

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Flask | Python micro web framework |
| Docker | Application containerization |
| Docker Compose | Multi-container management |
| Python 3.x | Backend language |
| Gunicorn | Production WSGI server |

---

## 📁 Project Structure

```
flaskapp-project/
├── app.py                 # Main Flask application
├── templates/             # HTML templates (Jinja2)
├── static/                # CSS, JS, images
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container build instructions
├── docker-compose.yml     # Service orchestration
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

### 1. Clone the Repository

```bash
git clone https://github.com/saeedtamboli01/flaskapp-project.git
cd flaskapp-project
```

### 2. Build and Run with Docker

```bash
# Build the Docker image
docker build -t flask-app .

# Run the container
docker run -p 5000:5000 flask-app
```

### 3. Run with Docker Compose (Recommended)

```bash
docker-compose up --build
```

Visit `http://localhost:5000` in your browser.

To stop the app:
```bash
docker-compose down
```

---

## 🐳 Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

---

## 🧩 Docker Compose Configuration

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
    volumes:
      - .:/app
    restart: always
```

---

## 🌐 Application Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home page |
| `/about` | GET | About page |

---

## 📌 Key Learnings

- How to containerize a Python/Flask application using Docker
- Writing optimized `Dockerfile` with minimal image size (`python:slim`)
- Using `docker-compose.yml` for environment configuration and service management
- Understanding container port binding and volume mounting
- Building consistent, portable deployment environments

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

> Built by [Saeed Tamboli](https://github.com/saeedtamboli01) — DevOps Enthusiast
