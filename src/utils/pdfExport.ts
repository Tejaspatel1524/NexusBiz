import jsPDF from 'jspdf';

interface BusinessPlan {
    id: string;
    title: string;
    executiveSummary: string;
    marketAnalysis: {
        overview: string;
        trends: string[];
        competitors: string[];
    };
    marketingStrategy: string[];
    financialProjections: {
        labels: string[];
        yearOne: number[];
        yearTwo: number[];
        yearThree: number[];
    };
    operationsPlan: string;
    productionLogistics: string;
    legalCompliance: string;
    hrTeamStructure: string;
    technologyRequirements: string[];
    implementationTimeline: { milestone: string; date: string }[];
    riskAnalysis: { risk: string; mitigation: string }[];
}

export const generateBusinessPlanPDF = (plan: BusinessPlan): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 20;

    // Helper functions
    const addTitle = (text: string, size: number = 16) => {
        checkPageBreak(30);
        doc.setFontSize(size);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 255);
        doc.text(text, margin, yPos);
        yPos += size / 2 + 5;
    };

    const addSubtitle = (text: string) => {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(text, margin, yPos);
        yPos += 8;
    };

    const addParagraph = (text: string) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);

        lines.forEach((line: string) => {
            checkPageBreak(10);
            doc.text(line, margin, yPos);
            yPos += 5;
        });
        yPos += 5;
    };

    const addBulletList = (items: string[]) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);

        items.forEach((item) => {
            const lines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 5);
            lines.forEach((line: string, idx: number) => {
                checkPageBreak(10);
                doc.text(line, idx === 0 ? margin + 5 : margin + 10, yPos);
                yPos += 5;
            });
            yPos += 2;
        });
        yPos += 5;
    };

    const checkPageBreak = (neededSpace: number = 40) => {
        if (yPos > pageHeight - neededSpace) {
            doc.addPage();
            yPos = 25;
        }
    };

    const addSectionDivider = () => {
        yPos += 3;
        doc.setDrawColor(0, 102, 255);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, margin + 30, yPos);
        yPos += 10;
    };

    // Simple table function without autoTable
    const addSimpleTable = (headers: string[], rows: string[][], headerColor: number[] = [0, 102, 255]) => {
        const colWidth = (pageWidth - margin * 2) / headers.length;
        const rowHeight = 10;

        // Check if we need a new page
        checkPageBreak(rowHeight * (rows.length + 2));

        // Draw header
        doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.rect(margin, yPos - 6, pageWidth - margin * 2, rowHeight, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);

        headers.forEach((header, i) => {
            doc.text(header, margin + colWidth * i + 3, yPos);
        });
        yPos += rowHeight;

        // Draw rows
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);

        rows.forEach((row, rowIdx) => {
            checkPageBreak(rowHeight + 5);

            // Alternate row background
            if (rowIdx % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(margin, yPos - 6, pageWidth - margin * 2, rowHeight, 'F');
            }

            row.forEach((cell, i) => {
                const cellText = doc.splitTextToSize(cell, colWidth - 6);
                doc.text(cellText[0] || '', margin + colWidth * i + 3, yPos);
            });
            yPos += rowHeight;
        });

        yPos += 10;
    };

    // ========== HEADER ==========
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NEXUSBIZ', margin, 25);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Business Plan Report', margin, 35);

    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin - 50, 35);

    yPos = 60;

    // ========== PLAN TITLE ==========
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    const titleLines = doc.splitTextToSize(plan.title.toUpperCase(), pageWidth - margin * 2);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 8 + 10;

    // ========== EXECUTIVE SUMMARY ==========
    addTitle('EXECUTIVE SUMMARY');
    addSectionDivider();
    addParagraph(plan.executiveSummary);

    // ========== MARKET ANALYSIS ==========
    addTitle('MARKET ANALYSIS');
    addSectionDivider();
    addParagraph(plan.marketAnalysis.overview);

    addSubtitle('Market Trends');
    addBulletList(plan.marketAnalysis.trends);

    addSubtitle('Competitors');
    addBulletList(plan.marketAnalysis.competitors);

    // ========== FINANCIAL PROJECTIONS ==========
    addTitle('FINANCIAL PROJECTIONS');
    addSectionDivider();

    const financialHeaders = ['Period', 'Year 1', 'Year 2', 'Year 3'];
    const financialRows = plan.financialProjections.labels.map((label, i) => [
        label,
        `$${plan.financialProjections.yearOne[i]?.toLocaleString() || 'N/A'}`,
        `$${plan.financialProjections.yearTwo[i]?.toLocaleString() || 'N/A'}`,
        `$${plan.financialProjections.yearThree[i]?.toLocaleString() || 'N/A'}`
    ]);

    addSimpleTable(financialHeaders, financialRows);

    // ========== MARKETING STRATEGY ==========
    addTitle('MARKETING STRATEGY');
    addSectionDivider();
    addBulletList(plan.marketingStrategy);

    // ========== TECHNOLOGY REQUIREMENTS ==========
    addTitle('TECHNOLOGY REQUIREMENTS');
    addSectionDivider();
    addBulletList(plan.technologyRequirements);

    // ========== IMPLEMENTATION TIMELINE ==========
    addTitle('IMPLEMENTATION TIMELINE');
    addSectionDivider();

    const timelineHeaders = ['Timeline', 'Milestone'];
    const timelineRows = plan.implementationTimeline.map(item => [item.date, item.milestone]);
    addSimpleTable(timelineHeaders, timelineRows);

    // ========== RISK ANALYSIS ==========
    addTitle('RISK ANALYSIS');
    addSectionDivider();

    const riskHeaders = ['Risk', 'Mitigation'];
    const riskRows = plan.riskAnalysis.map(item => [item.risk, item.mitigation]);
    addSimpleTable(riskHeaders, riskRows, [220, 53, 69]);

    // ========== OPERATIONS ==========
    addTitle('OPERATIONS & LOGISTICS');
    addSectionDivider();
    addParagraph(plan.operationsPlan);
    addParagraph(plan.productionLogistics);

    // ========== LEGAL & HR ==========
    addTitle('LEGAL & HR STRUCTURE');
    addSectionDivider();
    addParagraph(plan.legalCompliance);
    addParagraph(plan.hrTeamStructure);

    // ========== FOOTER on all pages ==========
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Generated by NexusBiz | Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    const fileName = `${plan.title.replace(/[^a-zA-Z0-9]/g, '_')}_BusinessPlan.pdf`;
    doc.save(fileName);
};
