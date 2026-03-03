Node.js Production Deployment on AWS EC2

This project demonstrates how to manually deploy a production-style Node.js application on an AWS EC2 Ubuntu server using core DevOps principles — without using managed platforms.

The goal was to understand how things actually work under the hood: Linux processes, systemd services, reverse proxying, and secure server setup.

---

Architecture

Internet
   │
AWS Security Group
   │
Nginx (Port 80)
   │  Reverse Proxy
Node.js App (Port 3000 - internal)
   │
systemd
   │
Ubuntu 22.04 EC2

* Port **3000 is not exposed publicly**
* systemd manages the process (auto-restart + boot start)
* App runs as a non-root user

---

## Tech Stack

* Node.js 20 (system-wide install)
* Express.js
* Ubuntu 22.04
* systemd
* UFW Firewall
* AWS EC2
* Git workflow (main/dev/feature branches)

---

## Project Structure

```text
nodejs-ec2-deploy/
├── src/
│   ├── app.js
│   └── routes/health.js
├── scripts/
│   ├── install.sh
│   └── deploy.sh
├── server.js
├── .env.example
└── package.json
```

---

## What This Project Covers

### 1️. Local Development

* Structured Express app
* Health check endpoint (`/health`)
* Environment-based configuration
* Proper `.gitignore` usage

---

### 2️. Git Workflow

* `main` → production
* `dev` → integration
* `feature/*` → development
* Rebase for local cleanup
* Merge for integration

---

### 3️. EC2 Provisioning

* Ubuntu 22.04 instance
* Security group configuration
* Key-based authentication

---

### 4️. Server Setup

* System update & package installation
* Application directory in `/var/www`

---

### 5️. Deployment Process

```bash
git clone https://github.com/samuel-maithre/nodejs-manual-ec2-deployment.git
npm ci --omit=dev
cp .env.example .env
```

Manual validation before service setup:

```bash
node server.js
curl localhost:3000
```

---

### 6️. systemd Service

The application is managed using systemd:

Commands:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nodejs-app
sudo systemctl start nodejs-app
sudo systemctl status nodejs-app
```
---

## Security Measures

* SSH key-based login only
* Non-root service execution
* Port 3000 not publicly exposed
* UFW firewall (deny incoming by default)
* `.env` excluded from Git
* Reproducible installs using `npm ci`

---

## What I Learned

* How Linux handles processes and ports
* How systemd manages services
* Proper Git branching strategy
* Basic server hardening practices
* Debugging real deployment issues (permissions, namespace, ports)

This project reflects a hands-on understanding of how production deployments actually work instead of relying on managed services.
