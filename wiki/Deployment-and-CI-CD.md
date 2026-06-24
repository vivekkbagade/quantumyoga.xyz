# Deployment & CI/CD Pipeline Setup

Quantum Yoga uses a fully automated CI/CD pipeline powered by **GitHub Actions** to deploy updates seamlessly to a target Virtual Machine (VM). The application process is managed in production using the **PM2** process manager.

---

## 🚀 CI/CD Pipeline Workflow

The GitHub Actions workflow configuration is located in [.github/workflows/ci-cd.yml](file:///d:/QuantumYogaWebsite/.github/workflows/ci-cd.yml).

The pipeline executes the following stages:

### 1. Build and Test (`build-and-test` job)
*   **Triggers:** Pushes or Pull Requests to the `main` or `master` branches. Can also be triggered manually via `workflow_dispatch`.
*   **Setup:** Spins up an `ubuntu-latest` runner, configures Node.js, and restores cached dependencies.
*   **Compile:** Runs `npm run build` to build client-side assets using Vite into the `dist/` directory.
*   **Test:** Executes tests (`npm run test`) and fails the deployment if the test suite fails.
*   **Package:** Gathers production files (`dist/`, `server.js`, `package.json`, `package-lock.json`, `ecosystem.config.cjs`, client files, and images) and uploads them as a build artifact.

### 2. Deploy (`deploy` job)
*   **Triggers:** Runs only after `build-and-test` succeeds and the code is on the main branch.
*   **Transfer (SCP):** Uses `appleboy/scp-action` to securely copy files over SSH to the VM's configured deployment path.
*   **Remote Commands (SSH):** Uses `appleboy/ssh-action` to run the following scripts directly on the VM:
    1.  Safely initializes `db.json` from the repository template if it doesn't exist on the VM (to prevent overwriting live database states).
    2.  Cleans up old PM2 processes running under the name `quantum-yoga-website` (if any).
    3.  Installs production-only dependencies (`npm install --omit=dev`).
    4.  Ensures PM2 is installed globally.
    5.  Starts or reloads the Express server under the name `quantum-yoga` using the PM2 config file.

---

## 🔑 GitHub Repository Secrets Configuration

To authorize the pipeline, go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**, and add these secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `VM_SSH_IP` | Public IP Address or Domain of your VM | `192.0.2.1` |
| `VM_SSH_USER` | SSH Username for logging in | `ubuntu` or `root` |
| `VM_SSH_KEY` | Private SSH key authorized to log in | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VM_DEPLOY_PATH` | Absolute path to deploy files on the VM | `/var/www/quantum-yoga` |

---

## ⚙️ VM Server Environment Preparation

Before your first deployment, configure the VM runtime environment:

### 1. Install Node.js, Git, and PM2
SSH into your VM and run:
```bash
# Update repositories and install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Configure Deployment Folder Permissions
Ensure the deployment folder exists and is owned by the SSH user (e.g. `ubuntu`):
```bash
sudo mkdir -p /var/www/quantum-yoga
sudo chown -R ubuntu:ubuntu /var/www/quantum-yoga
```

### 3. Create Production `.env`
In `/var/www/quantum-yoga`, create a `.env` file with production credentials:
```env
PORT=8080
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/quantum_yoga
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_ADDRESS=admin@quantumyoga.xyz
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_SENDER_NUMBER=+14155238886
```

---

## 🛡️ PM2 Process Management

Production processes are managed using `ecosystem.config.cjs`:
*   **App Name:** `quantum-yoga`
*   **Entry Script:** `server.js`
*   **Instances:** `1` (customizable for clusters)
*   **Restart Policy:** Automatically restarts on crashes or memory overhead (>1GB).

### Useful PM2 commands on the VM:
*   View app status: `pm2 status`
*   Monitor resources & logs: `pm2 monit`
*   View real-time logs: `pm2 logs quantum-yoga`
*   Restart the application: `pm2 restart quantum-yoga`
