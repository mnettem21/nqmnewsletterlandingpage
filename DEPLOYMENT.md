# Deployment Guide - Making Your Newsletter Landing Page Accessible

To make your landing page accessible via QR code, you need to deploy it to a public URL. Here are the best **free** options:

## Option 1: Railway (Recommended - Easiest)

Railway offers a free tier that's perfect for this project.

### Steps:

1. **Sign up** at [railway.app](https://railway.app) (free tier available)

2. **Connect your GitHub repository:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Set environment variables** (if using email):
   - Go to your project → Variables
   - Add any variables from your `.env` file

4. **Deploy:**
   - Railway auto-detects Node.js and runs `npm start`
   - Your site will be live at `https://your-app-name.railway.app`

5. **Generate QR code:**
   ```bash
   LANDING_PAGE_URL=https://your-app-name.railway.app npm run generate-qr
   ```

**Pros:** Free tier, automatic deployments, easy setup
**Cons:** Free tier has usage limits (but fine for newsletters)

---

## Option 2: Render

Another great free option with automatic deployments.

### Steps:

1. **Sign up** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

3. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

4. **Set environment variables** (if using email):
   - Go to Environment section
   - Add your variables

5. **Deploy:**
   - Render will build and deploy automatically
   - Your site will be at `https://your-app-name.onrender.com`

6. **Generate QR code:**
   ```bash
   LANDING_PAGE_URL=https://your-app-name.onrender.com npm run generate-qr
   ```

**Pros:** Free tier, automatic SSL, easy setup
**Cons:** Free tier spins down after inactivity (first request may be slow)

---

## Option 3: Fly.io

Great for always-on hosting with a generous free tier.

### Steps:

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up** at [fly.io](https://fly.io) and login:
   ```bash
   fly auth login
   ```

3. **Create a fly.toml file** (create this in your project root):
   ```toml
   app = "your-app-name"
   primary_region = "iad"

   [build]

   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[vm]]
     cpu_kind = "shared"
     cpus = 1
     memory_mb = 256
   ```

4. **Deploy:**
   ```bash
   fly launch
   ```
   - Follow prompts (choose free tier)
   - Set environment variables if needed: `fly secrets set SMTP_USER=...`

5. **Generate QR code:**
   ```bash
   LANDING_PAGE_URL=https://your-app-name.fly.dev npm run generate-qr
   ```

**Pros:** Generous free tier, always-on option available
**Cons:** Requires CLI setup

---

## Option 4: Vercel (Requires Serverless Conversion)

Vercel is free but requires converting your Express server to serverless functions. This is more complex but possible.

---

## Quick Comparison

| Platform | Free Tier | Setup Difficulty | Always On | Best For |
|----------|-----------|------------------|-----------|----------|
| Railway  | ✅ Yes    | ⭐ Easy          | ✅ Yes    | Beginners |
| Render   | ✅ Yes    | ⭐ Easy          | ⚠️ Sleeps | Beginners |
| Fly.io   | ✅ Yes    | ⭐⭐ Medium      | ✅ Yes    | Advanced |

---

## After Deployment

1. **Update QR Code:**
   ```bash
   LANDING_PAGE_URL=https://your-deployed-url.com npm run generate-qr
   ```

2. **Test your QR code:**
   - Scan with your phone
   - Make sure the landing page loads
   - Test a subscription

3. **Monitor subscriptions:**
   - Visit `https://your-deployed-url.com/api/subscribers`
   - Or download `subscribers.json` from your hosting platform

---

## Important Notes

- **File Storage:** Your `subscribers.json` file will be stored on the server. For production, consider:
  - Using a database (MongoDB Atlas free tier)
  - Or regularly downloading the file from your hosting platform

- **Environment Variables:** Never commit `.env` to git. Set them in your hosting platform's dashboard.

- **Domain (Optional):** Most platforms let you add a custom domain for free (e.g., `newsletter.yourdomain.com`)

---

## Recommended: Railway

For the easiest setup, I recommend **Railway**:
- Free tier is generous
- Automatic deployments from GitHub
- No credit card required
- Simple environment variable management
- Always-on (no sleep)

Just connect your GitHub repo and you're done! 🚀
