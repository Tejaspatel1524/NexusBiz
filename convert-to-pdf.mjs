import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const htmlPath = path.join(__dirname, 'NexusBiz_Presentation.html');
    console.log('📄 Loading:', htmlPath);

    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
    });

    await new Promise(r => setTimeout(r, 2000));
    console.log('✅ Page loaded.');

    // Take screenshot of first slide as PDF
    const pdfPath = path.join(__dirname, 'NexusBiz_Presentation.pdf');

    await page.pdf({
        path: pdfPath,
        width: '1920px',
        height: '1080px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    console.log(`\n✅ PDF saved: ${pdfPath}`);
}

generatePDF().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
