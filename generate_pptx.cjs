const PptxGenJS = require("pptxgenjs");
const path = require("path");

// Configuration
const IMAGES_DIR = path.join(__dirname, "presentation_images");

async function createPresentation() {
    let pres = new PptxGenJS();

    // Set Presentation properties
    pres.author = 'NexusBiz AI';
    pres.company = 'NexusPrime';
    pres.title = 'NexusBiz Presentation';
    pres.layout = 'LAYOUT_16x9';

    // Set default slide background (Dark Theme)
    pres.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: { color: "0F172A" },
        objects: [
            // Optional: Add a subtle footer or logo here if needed
            { rect: { x: 0, y: 7.2, w: '100%', h: 0.3, fill: { color: "1E1B4B" } } }
        ]
    });

    // --- Helper Styles ---
    const titleStyle = { x: 0.5, y: 0.5, w: '90%', fontSize: 36, fontFace: 'Arial', bold: true, color: '6366F1', align: 'left' };
    const subtitleStyle = { x: 0.5, y: 1.2, w: '90%', fontSize: 18, fontFace: 'Arial', color: '94A3B8', align: 'left' };
    const bodyTextStyle = { x: 0.5, y: 2.0, w: '45%', fontSize: 14, fontFace: 'Arial', color: 'F8FAFC', bullet: true, lineSpacing: 28 };
    const imageCheck = (filename) => path.join(IMAGES_DIR, filename);

    // --- Slide 1: Title ---
    let slide1 = pres.addSlide();
    slide1.background = { color: "0F172A" }; // Override master if needed, but master should be default

    // Add big title centered
    slide1.addText("NexusBiz", { x: 1, y: 2.5, w: '80%', fontSize: 60, fontFace: 'Arial', bold: true, color: '6366F1', align: 'center' });
    slide1.addText("AI-Powered Business Idea Generator", { x: 1, y: 3.5, w: '80%', fontSize: 24, fontFace: 'Arial', color: '94A3B8', align: 'center' });
    slide1.addText("🚀 Transform Ideas into Actionable Business Plans", { x: 2, y: 4.5, w: '60%', fontSize: 14, fontFace: 'Arial', color: '0EA5E9', align: 'center', fill: { color: '1E293B' }, rx: 10, ry: 10 });

    // --- Slide 2: Project Overview ---
    let slide2 = pres.addSlide();
    slide2.background = { color: "0F172A" };
    slide2.addText("Project Overview", titleStyle);
    slide2.addText("Building the future of entrepreneurship with AI", subtitleStyle);

    slide2.addText([
        { text: "Full-stack AI-powered business intelligence platform", options: { breakLine: true } },
        { text: "Generates personalized business ideas based on your skills, budget & market", options: { breakLine: true } },
        { text: "Creates comprehensive business plans with financial projections", options: { breakLine: true } },
        { text: "Modern glassmorphic UI with stunning animations", options: { breakLine: true } },
        { text: "Real-time AI processing with Anthropic Claude / Ollama", options: { breakLine: true } },
        { text: "Export business plans to PDF for presentations" }
    ], bodyTextStyle);

    slide2.addImage({ path: imageCheck('hero.png'), x: 5.5, y: 1.8, w: 4.5, h: 3.5 });

    // --- Slide 3: Key Features ---
    let slide3 = pres.addSlide();
    slide3.background = { color: "0F172A" };
    slide3.addText("Key Features", titleStyle);
    slide3.addText("Everything you need to launch your business empire", subtitleStyle);

    // Grid of features (simplified for PPT)
    const features = [
        { title: "AI-Powered Ideas", desc: "Curate personalized business concepts based on market potential." },
        { title: "Complete Business Plans", desc: "Comprehensive structural frameworks and actions." },
        { title: "Financial Projections", desc: "Data-driven 3-year forecasting." },
        { title: "Marketing Strategy", desc: "Targeted customer acquisition plans." },
        { title: "Operations Planning", desc: "Detailed workflows and resource requirements." },
        { title: "Idea Comparison", desc: "Compare up to 3 business ideas side-by-side." }
    ];

    let startX = 0.5, startY = 1.8;
    features.forEach((feat, i) => {
        let x = startX + (i % 3) * 3.2;
        let y = startY + Math.floor(i / 3) * 2.2;

        slide3.addShape(pres.ShapeType.rect, { x: x, y: y, w: 3, h: 1.8, fill: { color: "1E293B" }, line: { color: "334155" } });
        slide3.addText(feat.title, { x: x + 0.1, y: y + 0.1, w: 2.8, h: 0.5, fontSize: 14, bold: true, color: "6366F1" });
        slide3.addText(feat.desc, { x: x + 0.1, y: y + 0.6, w: 2.8, h: 1.0, fontSize: 11, color: "94A3B8" });
    });

    // --- Slide 4: How It Works ---
    let slide4 = pres.addSlide();
    slide4.background = { color: "0F172A" };
    slide4.addText("How It Works", titleStyle);
    slide4.addText("4-step intelligent wizard", subtitleStyle);

    slide4.addText([
        { text: "1. Market Analysis: Select industry, budget, location", options: { breakLine: true } },
        { text: "2. Skills Assessment: Define skills & risk tolerance", options: { breakLine: true } },
        { text: "3. Strategy Planning: Business model & target market", options: { breakLine: true } },
        { text: "4. Launch Configuration: Generate AI ideas", options: { breakLine: true } }
    ], { x: 0.5, y: 2.0, w: '45%', fontSize: 14, fontFace: 'Arial', color: 'F8FAFC', lineSpacing: 35 });

    slide4.addImage({ path: imageCheck('wizard.png'), x: 5.5, y: 1.8, w: 4.5, h: 3.5 });

    // --- Slide 5: Results Dashboard ---
    let slide5 = pres.addSlide();
    slide5.background = { color: "0F172A" };
    slide5.addText("Results Dashboard", titleStyle);
    slide5.addText("AI-synthesized business concepts", subtitleStyle);

    slide5.addText([
        { text: "Bento Grid Layout for quick scanning", options: { breakLine: true } },
        { text: "Real-time Search & Filtering", options: { breakLine: true } },
        { text: "Compare Mode for side-by-side analysis", options: { breakLine: true } },
        { text: "Market Sentiment indicators", options: { breakLine: true } }
    ], bodyTextStyle);

    slide5.addImage({ path: imageCheck('dashboard.png'), x: 5.5, y: 1.8, w: 4.5, h: 3.5 });

    // --- Slide 6: Business Plan Generator ---
    let slide6 = pres.addSlide();
    slide6.background = { color: "0F172A" };
    slide6.addText("Business Plan Generator", titleStyle);
    slide6.addText("Comprehensive architectural specification", subtitleStyle);

    const sections = [
        "Executive Summary", "Market Analysis", "Financial Projections", "Marketing Strategy",
        "Operations", "Technology", "Legal & HR", "Timeline & Risk"
    ];

    startX = 0.5; startY = 1.8;
    sections.forEach((sec, i) => {
        let x = startX + (i % 4) * 2.3;
        let y = startY + Math.floor(i / 4) * 1.5;
        slide6.addShape(pres.ShapeType.rect, { x: x, y: y, w: 2.1, h: 1.2, fill: { color: "1E293B" } });
        slide6.addText(sec, { x: x, y: y, w: 2.1, h: 1.2, fontSize: 14, color: "F8FAFC", align: "center" });
    });

    slide6.addText("📥 Export to PDF Available", { x: 3.5, y: 5.5, w: 3, h: 0.5, fontSize: 12, color: "F8FAFC", fill: { color: "6366F1" }, align: "center", shape: pres.ShapeType.roundRect });

    // --- Slide 7: Financial Intelligence ---
    let slide7 = pres.addSlide();
    slide7.background = { color: "0F172A" };
    slide7.addText("Financial Intelligence", titleStyle);
    slide7.addText("Data-driven projections", subtitleStyle);

    slide7.addImage({ path: imageCheck('financial.png'), x: 0.5, y: 2.0, w: 4.5, h: 3.5 });

    slide7.addText([
        { text: "3-Year Revenue Forecast", options: { breakLine: true } },
        { text: "Breakeven Analysis", options: { breakLine: true } },
        { text: "CapEx Requirements", options: { breakLine: true } },
        { text: "Estimated Valuation", options: { breakLine: true } },
        { text: "Visual Analytics powered by Recharts" }
    ], { x: 5.5, y: 2.0, w: '40%', fontSize: 14, fontFace: 'Arial', color: 'F8FAFC', bullet: true, lineSpacing: 28 });

    // --- Slide 8: Technology Stack ---
    let slide8 = pres.addSlide();
    slide8.background = { color: "0F172A" };
    slide8.addText("Technology Stack", titleStyle);
    slide8.addText("Enterprise-grade architecture", subtitleStyle);

    const techStack = [
        { cat: "Frontend", tools: "React 18, TypeScript, Vite, Tailwind CSS" },
        { cat: "Backend", tools: "Node.js, Express.js, TypeScript, Zod" },
        { cat: "AI / ML", tools: "Anthropic Claude, Ollama, Groq API" },
        { cat: "Tools", tools: "Winston, Helmet, Rate Limiting" }
    ];

    startY = 2.0;
    techStack.forEach((t, i) => {
        slide8.addText(t.cat, { x: 0.5, y: startY + (i * 0.9), w: 2, fontSize: 14, bold: true, color: "0EA5E9" });
        slide8.addText(t.tools, { x: 0.5, y: startY + (i * 0.9) + 0.3, w: 4, fontSize: 12, color: "F8FAFC" });
    });

    slide8.addImage({ path: imageCheck('brain.png'), x: 5.5, y: 2.0, w: 4.5, h: 3.5 });

    // --- Slide 9: Impact & Statistics ---
    let slide9 = pres.addSlide();
    slide9.background = { color: "0F172A" };
    slide9.addText("Impact & Statistics", titleStyle);

    const stats = [
        { val: "1.2M+", label: "Ideas Generated" },
        { val: "45k+", label: "Businesses Launched" },
        { val: "89%", label: "Success Rate" },
        { val: "$3.4B", label: "Market Value" }
    ];

    startX = 0.5; startY = 2.0;
    stats.forEach((st, i) => {
        let x = startX + i * 2.3;
        slide9.addShape(pres.ShapeType.rect, { x: x, y: startY, w: 2.1, h: 1.5, fill: { color: "1E293B" }, line: { color: "334155" } });
        slide9.addText(st.val, { x: x, y: startY + 0.2, w: 2.1, h: 0.6, fontSize: 24, bold: true, color: "6366F1", align: "center" });
        slide9.addText(st.label, { x: x, y: startY + 0.8, w: 2.1, h: 0.4, fontSize: 10, color: "94A3B8", align: "center" });
    });

    // --- Slide 10: Thank You ---
    let slide10 = pres.addSlide();
    slide10.background = { color: "1E1B4B" }; // Slightly different bg for closing

    slide10.addText("Thank You!", { x: 1, y: 2.0, w: '80%', fontSize: 50, fontFace: 'Arial', bold: true, color: '6366F1', align: 'center' });
    slide10.addText("Ready to build your next business empire?", { x: 1, y: 3.2, w: '80%', fontSize: 20, fontFace: 'Arial', color: '94A3B8', align: 'center' });

    slide10.addText("🚀 Start Building with NexusBiz", {
        x: 3, y: 4.5, w: 4, h: 0.8,
        fontSize: 16, fontFace: 'Arial', color: 'FFFFFF', align: 'center',
        fill: { color: '6366F1' }, rx: 20, ry: 20,
        hyperlink: { url: "https://nexus-biz.vercel.app/" }
    });

    // Save the Presentation
    const outFile = path.join(__dirname, "NexusBiz_Presentation.pptx");
    pres.writeFile({ fileName: outFile }).then(() => {
        console.log(`Presentation created successfully: ${outFile}`);
    }).catch(err => {
        console.error("Error creating presentation:", err);
    });
}

createPresentation();
