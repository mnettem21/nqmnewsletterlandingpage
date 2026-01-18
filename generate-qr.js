const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get the landing page URL from environment or use default
const LANDING_PAGE_URL = process.env.LANDING_PAGE_URL || 'http://localhost:3000';

async function generateQRCode() {
    try {
        const outputPath = path.join(__dirname, 'qr-code.png');
        
        // Generate QR code
        await QRCode.toFile(outputPath, LANDING_PAGE_URL, {
            width: 500,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        console.log(`✅ QR code generated successfully!`);
        console.log(`📄 File saved to: ${outputPath}`);
        console.log(`🔗 URL: ${LANDING_PAGE_URL}`);
        console.log(`\n💡 To use a different URL, set LANDING_PAGE_URL environment variable:`);
        console.log(`   LANDING_PAGE_URL=https://yourdomain.com node generate-qr.js`);
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
}

generateQRCode();
