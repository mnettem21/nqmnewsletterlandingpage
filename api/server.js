const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Determine storage path - use /tmp on Vercel, project root locally
const isVercel = process.env.VERCEL === '1';
const DATA_FILE = isVercel 
    ? path.join('/tmp', 'subscribers.json')
    : path.join(__dirname, '..', 'subscribers.json');

// Email configuration (optional)
let emailTransporter = null;
let emailConfig = null;

// Initialize email transporter if credentials are provided
function initEmail() {
    const emailEnabled = process.env.EMAIL_ENABLED === 'true';
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.FROM_EMAIL || smtpUser;
    const fromName = process.env.FROM_NAME || 'Non-QM Daily News';

    if (emailEnabled && smtpHost && smtpPort && smtpUser && smtpPass) {
        emailTransporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: smtpPort === '465',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        console.log('Email service configured');
        return { fromEmail, fromName };
    } else {
        console.log('Email service not configured - subscriptions will be saved but no emails will be sent');
        return null;
    }
}

// Send confirmation email
async function sendConfirmationEmail(toEmail, emailConfig) {
    if (!emailTransporter || !emailConfig) {
        return false;
    }

    try {
        const mailOptions = {
            from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
            to: toEmail,
            subject: 'Welcome to Non-QM Daily News!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #00C853 0%, #00A844 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; padding: 12px 30px; background: #00C853; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Non-QM Daily News!</h1>
                        </div>
                        <div class="content">
                            <p>Thank you for subscribing to <strong>Non-QM Daily News</strong>!</p>
                            <p>You'll now receive daily updates with the latest Non-Qualified Mortgage news and insights delivered straight to your inbox.</p>
                            <p>We're excited to keep you informed about:</p>
                            <ul>
                                <li>📰 Daily industry news and updates</li>
                                <li>🎯 Expert analysis and market trends</li>
                                <li>⚡ Quick, actionable insights</li>
                            </ul>
                            <p>Stay tuned for your first newsletter!</p>
                            <p>Best regards,<br>The Non-QM Daily News Team</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Welcome to Non-QM Daily News!

Thank you for subscribing! You'll now receive daily updates with the latest Non-Qualified Mortgage news and insights.

We're excited to keep you informed about:
- Daily industry news and updates
- Expert analysis and market trends
- Quick, actionable insights

Stay tuned for your first newsletter!

Best regards,
The Non-QM Daily News Team
            `,
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${toEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Initialize file storage
async function initStorage() {
    try {
        try {
            await fs.access(DATA_FILE);
            console.log('Subscribers file found');
        } catch {
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
            console.log('Created new subscribers file');
        }
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
}

// Read subscribers from file
async function readSubscribers() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading subscribers:', error);
        return [];
    }
}

// Write subscribers to file
async function writeSubscribers(subscribers) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing subscribers:', error);
        return false;
    }
}

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// API endpoint to handle subscriptions
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    try {
        const subscribers = await readSubscribers();
        
        const existingEmail = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
        
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }
        
        const newSubscriber = {
            email: email.toLowerCase(),
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        subscribers.push(newSubscriber);
        const success = await writeSubscribers(subscribers);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to save subscription' });
        }
        
        console.log(`New subscription: ${email}`);
        
        if (emailConfig) {
            sendConfirmationEmail(email, emailConfig).catch(err => {
                console.error('Failed to send confirmation email:', err);
            });
        }
        
        res.json({ success: true, message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription' });
    }
});

// Endpoint to view all subscribers
app.get('/api/subscribers', async (req, res) => {
    try {
        const subscribers = await readSubscribers();
        res.json({ count: subscribers.length, subscribers });
    } catch (error) {
        console.error('Error reading subscribers:', error);
        res.status(500).json({ error: 'Failed to read subscribers' });
    }
});

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const subscribers = await readSubscribers();
        res.json({ 
            status: 'ok', 
            storage: isVercel ? 'vercel-tmp' : 'file-based',
            subscriberCount: subscribers.length 
        });
    } catch (error) {
        res.json({ status: 'error', error: error.message });
    }
});

// Initialize email config
emailConfig = initEmail();

// Initialize storage (non-blocking)
initStorage().catch(console.error);

// Export for Vercel serverless
module.exports = app;
