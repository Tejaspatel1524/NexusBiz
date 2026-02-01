import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type for autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable: { finalY: number };
    }
}

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
    const margin = 20;
    let yPos = 20;

    // Helper functions
    const addTitle = (text: string, size: number = 16) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 102, 255); // Blue color
        doc.text(text, margin, yPos);
        yPos += size / 2 + 5;
    };

    const addSubtitle = (text: string) => {
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
        doc.text(lines, margin, yPos);
        yPos += lines.length * 5 + 5;
    };

    const addBulletList = (items: string[]) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        items.forEach((item) => {
            const lines = doc.splitTextToSize(`• ${item}`, pageWidth - margin * 2 - 5);
            doc.text(lines, margin + 5, yPos);
            yPos += lines.length * 5 + 2;
        });
        yPos += 5;
    };

    const checkPageBreak = (neededSpace: number = 40) => {
        if (yPos > doc.internal.pageSize.getHeight() - neededSpace) {
            doc.addPage();
            yPos = 20;
        }
    };

    const addSectionDivider = () => {
        yPos += 5;
        doc.setDrawColor(0, 102, 255);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, margin + 30, yPos);
        yPos += 10;
    };

    // ========== HEADER ==========
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NEXUSBIZ', margin, 25);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Business Plan Report', margin, 35);

    doc.setFontSize(10);
    doc.setTextColor(0, 102, 255);
    doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth - margin - 50, 35);

    yPos = 60;

    // ========== PLAN TITLE ==========
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    const titleLines = doc.splitTextToSize(plan.title.toUpperCase(), pageWidth - margin * 2);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 10 + 10;

    // ========== EXECUTIVE SUMMARY ==========
    addTitle('EXECUTIVE SUMMARY');
    addSectionDivider();
    addParagraph(plan.executiveSummary);

    checkPageBreak();

    // ========== MARKET ANALYSIS ==========
    addTitle('MARKET ANALYSIS');
    addSectionDivider();
    addParagraph(plan.marketAnalysis.overview);

    yPos += 5;
    addSubtitle('Market Trends');
    addBulletList(plan.marketAnalysis.trends);

    addSubtitle('Competitors');
    addBulletList(plan.marketAnalysis.competitors);

    checkPageBreak();

    // ========== FINANCIAL PROJECTIONS ==========
    addTitle('FINANCIAL PROJECTIONS');
    addSectionDivider();

    // Create financial table
    const tableData = plan.financialProjections.labels.map((label, i) => [
        label,
        `$${plan.financialProjections.yearOne[i]?.toLocaleString() || 'N/A'}`,
        `$${plan.financialProjections.yearTwo[i]?.toLocaleString() || 'N/A'}`,
        `$${plan.financialProjections.yearThree[i]?.toLocaleString() || 'N/A'}`
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Period', 'Year 1', 'Year 2', 'Year 3']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 102, 255],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    checkPageBreak();

    // ========== MARKETING STRATEGY ==========
    addTitle('MARKETING STRATEGY');
    addSectionDivider();
    addBulletList(plan.marketingStrategy);

    checkPageBreak();

    // ========== TECHNOLOGY REQUIREMENTS ==========
    addTitle('TECHNOLOGY REQUIREMENTS');
    addSectionDivider();
    addBulletList(plan.technologyRequirements);

    checkPageBreak();

    // ========== IMPLEMENTATION TIMELINE ==========
    addTitle('IMPLEMENTATION TIMELINE');
    addSectionDivider();

    const timelineData = plan.implementationTimeline.map(item => [
        item.date,
        item.milestone
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Timeline', 'Milestone']],
        body: timelineData,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 102, 255],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    checkPageBreak();

    // ========== RISK ANALYSIS ==========
    addTitle('RISK ANALYSIS');
    addSectionDivider();

    const riskData = plan.riskAnalysis.map(item => [
        item.risk,
        item.mitigation
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Risk', 'Mitigation Strategy']],
        body: riskData,
        theme: 'grid',
        headStyles: {
            fillColor: [220, 53, 69],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4
        },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    checkPageBreak(60);

    // ========== OPERATIONS ==========
    addTitle('OPERATIONS & LOGISTICS');
    addSectionDivider();
    addParagraph(plan.operationsPlan);
    addParagraph(plan.productionLogistics);

    checkPageBreak();

    // ========== LEGAL & HR ==========
    addTitle('LEGAL & HR STRUCTURE');
    addSectionDivider();
    addParagraph(plan.legalCompliance);
    addParagraph(plan.hrTeamStructure);

    // ========== FOOTER on last page ==========
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Generated by NexusBiz | Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Save the PDF
    const fileName = `${plan.title.replace(/[^a-zA-Z0-9]/g, '_')}_BusinessPlan.pdf`;
    doc.save(fileName);
};
