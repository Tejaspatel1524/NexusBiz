const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('Starting PDF generation...');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to 1920x1080 for high quality
    await page.setViewport({ width: 1920, height: 1080 });

    // Load the HTML file
    const htmlPath = path.join(__dirname, 'NexusBiz_Presentation.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    console.log('Page loaded. Generating slides...');

    const totalSlides = 10;
    const pdfPages = [];

    for (let i = 1; i <= totalSlides; i++) {
        console.log(`Capturing slide ${i}/${totalSlides}...`);

        // Navigate to slide
        await page.evaluate((slideNum) => {
            if (typeof goToSlide === 'function') {
                goToSlide(slideNum);
            }
        }, i);

        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 500));

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: false
        });

        pdfPages.push(screenshot);
    }

    // Create PDF using screenshots
    const PDFDocument = require('puppeteer').PDFDocument || null;

    // Alternative: Save as single PDF with all slides
    // We'll create a combined HTML with all slides visible

    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; }
                body { background: #020617; }
                .slide-page {
                    width: 1920px;
                    height: 1080px;
                    page-break-after: always;
                    overflow: hidden;
                }
                .slide-page:last-child {
                    page-break-after: avoid;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            </style>
        </head>
        <body>
            ${pdfPages.map((_, i) => `<div class="slide-page"><img src="data:image/png;base64,${pdfPages[i].toString('base64')}" /></div>`).join('')}
        </body>
        </html>
    `);

    // Generate PDF
    const pdfPath = path.join(__dirname, 'NexusBiz_Presentation.pdf');
    await page.pdf({
        path: pdfPath,
        width: '1920px',
        height: '1080px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    console.log(`\n✅ PDF saved to: ${pdfPath}`);
    console.log('File size:', (fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2), 'MB');
}

generatePDF().catch(console.error);
