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
* Nginx forwards traffic internally to Node
* systemd manages the process (auto-restart + boot start)
* App runs as a non-root user

---

## 🛠 Tech Stack

* Node.js 20 (system-wide install)
* Express.js
* Ubuntu 22.04
* systemd
* Nginx
* UFW Firewall
* AWS EC2
* Git workflow (main/dev/feature branches)

---

## 📁 Project Structure

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

## 🔹 What This Project Covers

### 1️⃣ Local Development

* Structured Express app
* Health check endpoint (`/health`)
* Environment-based configuration
* Proper `.gitignore` usage

---

### 2️⃣ Git Workflow

* `main` → production
* `dev` → integration
* `feature/*` → development
* Rebase for local cleanup
* Merge for integration

---

### 3️⃣ EC2 Provisioning

* Ubuntu 22.04 instance
* Restricted SSH access (My IP only)
* Security group configuration
* Key-based authentication

---

### 4️⃣ Server Setup

* System update & package installation
* Node.js installed system-wide (`/usr/bin/node`)
* Dedicated `nodeapp` user
* Application directory in `/var/www`

---

### 5️⃣ Deployment Process

```bash
git clone <repo>
npm ci --omit=dev
cp .env.example .env
```

Manual validation before service setup:

```bash
node server.js
curl localhost:3000
```

---

### 6️⃣ systemd Service

The application is managed using systemd:

```ini
[Unit]
Description=Node.js Express Application
After=network.target

[Service]
User=nodeapp
Group=nodeapp
WorkingDirectory=/var/www/nodejs-app
Environment=NODE_ENV=production
EnvironmentFile=/var/www/nodejs-app/.env
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Commands:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nodejs-app
sudo systemctl start nodejs-app
sudo systemctl status nodejs-app
```

Logs:

```bash
sudo journalctl -u nodejs-app -f
```

---

## 🌐 Nginx Reverse Proxy

Nginx listens on port 80 and forwards traffic to the internal Node process:

```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

This keeps the Node app off the public internet.

---

## 🔐 Security Measures

* SSH key-based login only
* Non-root service execution
* Port 3000 not publicly exposed
* UFW firewall (deny incoming by default)
* `.env` excluded from Git
* Reproducible installs using `npm ci`

---

## 📚 What I Learned

* How Linux handles processes and ports
* How systemd manages services
* Why reverse proxies are used in production
* Proper Git branching strategy
* Basic server hardening practices
* Debugging real deployment issues (permissions, namespace, ports)

---

## 🚀 Next Improvements

* Cron-based health monitoring
* HTTPS with Let's Encrypt
* CI/CD pipeline (GitHub Actions)
* Dockerizing the application

---

This project reflects a hands-on understanding of how production deployments actually work instead of relying on managed services.
