# AkInteriors Deployment Guide

## Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Hostinger VPS or similar
- Domain name pointed to VPS IP

## Environment Setup

1. SSH into your VPS:
```bash
ssh user@your-vps-ip
```

2. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Install PM2:
```bash
npm install -g pm2
```

4. Install Nginx:
```bash
sudo apt-get install nginx
```

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/akinteriors.git
cd akinteriors
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
# Edit .env with your values
```

4. Build the project:
```bash
npm run build
```

5. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Nginx Setup

1. Copy nginx configuration:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/akinteriors
sudo ln -s /etc/nginx/sites-available/akinteriors /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Setup (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d akinteriors.com -d www.akinteriors.com
```

## PM2 Commands

```bash
pm2 status              # Check status
pm2 logs akinteriors    # View logs
pm2 restart akinteriors # Restart app
pm2 stop akinteriors    # Stop app
pm2 delete akinteriors  # Delete process
```

## MongoDB Setup

1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to .env as MONGODB_URI
4. Whitelist VPS IP in Atlas

## Image Uploads

Images are stored locally in `/public/uploads/`.
Ensure the VPS has sufficient disk space.
