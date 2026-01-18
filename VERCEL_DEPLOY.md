# Deploying to Vercel

## Quick Deploy Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (select your account)
   - Link to existing project? **No**
   - Project name? (press enter for default or enter custom name)
   - Directory? (press enter for current directory)
   - Override settings? **No**

4. **Set Environment Variables** (if using email):
   ```bash
   vercel env add EMAIL_ENABLED
   # Enter: true
   
   vercel env add SMTP_HOST
   # Enter: smtp.gmail.com (or your SMTP host)
   
   vercel env add SMTP_PORT
   # Enter: 587
   
   vercel env add SMTP_USER
   # Enter: your-email@gmail.com
   
   vercel env add SMTP_PASS
   # Enter: your-app-password
   
   vercel env add FROM_EMAIL
   # Enter: your-email@gmail.com
   
   vercel env add FROM_NAME
   # Enter: Non-QM News
   ```

5. **Redeploy** (to apply environment variables):
   ```bash
   vercel --prod
   ```

6. **Get your URL**:
   After deployment, Vercel will give you a URL like:
   `https://your-project-name.vercel.app`

7. **Generate QR Code**:
   ```bash
   LANDING_PAGE_URL=https://your-project-name.vercel.app npm run generate-qr
   ```

## Alternative: Deploy via GitHub

1. **Push your code to GitHub** (if not already)

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure:**
   - Framework Preset: **Other**
   - Root Directory: `./` (default)
   - Build Command: Leave empty (not needed)
   - Output Directory: Leave empty
   - Install Command: `npm install`

6. **Add Environment Variables** (if using email):
   - Click "Environment Variables"
   - Add each variable:
     - `EMAIL_ENABLED` = `true`
     - `SMTP_HOST` = `smtp.gmail.com`
     - `SMTP_PORT` = `587`
     - `SMTP_USER` = your email
     - `SMTP_PASS` = your app password
     - `FROM_EMAIL` = your email
     - `FROM_NAME` = `Non-QM News`

7. **Deploy!**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live!

## Important Notes

### File Storage on Vercel

⚠️ **Important**: Vercel uses serverless functions, and the filesystem is read-only except `/tmp`. 

- Subscriptions are stored in `/tmp/subscribers.json` on Vercel
- **This is temporary storage** - data may be lost when functions restart
- For production use, consider:
  - Using Vercel KV (key-value store) - free tier available
  - Using a database (MongoDB Atlas, Supabase, etc.)
  - Or regularly exporting data via the `/api/subscribers` endpoint

### Viewing Subscriptions

- Visit: `https://your-project.vercel.app/api/subscribers`
- Or use the Vercel dashboard logs to see subscription activity

### Custom Domain

You can add a custom domain in Vercel:
1. Go to your project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build fails
- Make sure all dependencies are in `package.json`
- Check that `api/server.js` exists

### Subscriptions not saving
- Check Vercel function logs in the dashboard
- `/tmp` directory should be writable automatically

### Static files not loading
- Make sure `index.html`, `styles.css`, and `script.js` are in the project root
- They should be served automatically by the Express static middleware

### Email not working
- Verify environment variables are set correctly
- Check function logs for SMTP errors
- For Gmail, make sure you're using an App Password, not your regular password

## Next Steps

After deployment:
1. Test your landing page
2. Test a subscription
3. Generate QR code with your Vercel URL
4. Monitor subscriptions via `/api/subscribers` endpoint

Your newsletter landing page is now live! 🚀
