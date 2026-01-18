# Non-QM News - Newsletter Landing Page

A beautiful landing page for email newsletter subscriptions with file-based storage and optional email confirmations.

## Features

- ✨ Modern, responsive landing page with vibrant green design
- 📧 Email subscription form with validation
- 💾 File-based storage (no external APIs required)
- 📨 Optional email confirmation system
- 📱 QR code generation for easy sharing
- 🎨 Beautiful gradient design matching Underight branding

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

The app works out of the box with file-based storage. Subscriptions are saved to `subscribers.json`.

**To enable email confirmations**, create a `.env` file:

```bash
# Create .env file
touch .env
```

Add these variables to `.env`:

```env
# Server Configuration
PORT=3000

# Email Configuration (Optional - leave disabled if you don't want email confirmations)
EMAIL_ENABLED=true

# SMTP Configuration
# For Gmail: Use an App Password (not your regular password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email sender details
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Non-QM News
```

#### Setting Up Email (Optional)

**Option 1: Gmail**
1. Enable 2-factor authentication on your Google account
2. Go to [Google Account Settings](https://myaccount.google.com/) > Security
3. Under "2-Step Verification", click "App passwords"
4. Generate an app password for "Mail"
5. Use that app password as `SMTP_PASS` (not your regular Gmail password)

**Option 2: Other Email Providers**
- **Outlook**: `SMTP_HOST=smtp-mail.outlook.com`, `SMTP_PORT=587`
- **Yahoo**: `SMTP_HOST=smtp.mail.yahoo.com`, `SMTP_PORT=587`
- **Custom SMTP**: Use your provider's SMTP settings

**Note**: If you don't configure email, subscriptions will still be saved to `subscribers.json`. The success message will simply say "Successfully subscribed!" without mentioning email.

### 3. Run the Server

```bash
npm start
```

The landing page will be available at `http://localhost:3000`

**Viewing Subscriptions:**
- Subscriptions are saved to `subscribers.json` in the project folder
- Or visit `http://localhost:3000/api/subscribers` to see all subscriptions via API

### 4. Generate QR Code

Before generating the QR code, update the `LANDING_PAGE_URL` in your `.env` file to your production URL (if deploying), then:

```bash
npm run generate-qr
```

This will create a `qr-code.png` file in the project root that you can use on fliers and marketing materials.

## Deployment

**To make your landing page accessible via QR code, you need to deploy it to a public URL.**

### Option 1: Vercel (You already have this!)

See **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** for step-by-step Vercel deployment instructions.

**Quick deploy:**
```bash
npm i -g vercel
vercel login
vercel
```

### Option 2: Other Free Hosting

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for other free hosting options:

- **Railway** (Easiest, always-on)
- **Render** (Easy setup, free tier)
- **Fly.io** (Generous free tier)

All options are free and perfect for newsletter landing pages!

## File Structure

```
.
├── index.html          # Landing page HTML
├── styles.css          # Landing page styles
├── script.js           # Frontend JavaScript
├── server.js           # Express server with file-based storage and email
├── subscribers.json    # Subscriber data (auto-created, gitignored)
├── generate-qr.js      # QR code generation script
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Testing

1. Start the server: `npm start`
2. Open `http://localhost:3000` in your browser
3. Enter an email address and submit
4. Check `subscribers.json` - the email should appear with a timestamp

## Troubleshooting

### Email confirmations not sending
- Check that `EMAIL_ENABLED=true` in your `.env` file
- Verify SMTP credentials are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Check server logs for SMTP connection errors
- **Note**: Email is optional - subscriptions are saved even without email configured

### Subscriptions not saving
- Check server logs for errors
- Ensure the server has write permissions in the project directory
- Check that `subscribers.json` is not locked or read-only

### QR code not generating
- Make sure `qrcode` package is installed: `npm install`
- Check that `LANDING_PAGE_URL` is set correctly in `.env` (optional)

## License

MIT
