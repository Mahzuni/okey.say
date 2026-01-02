import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Retain high quality
            backgroundColor: '#242424', // Match theme background or use null
            useCORS: true,
            logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10; // Margin top

        // Scale to fit width
        const printWidth = pdfWidth - 20; // 10mm margin each side
        const printHeight = (imgHeight * printWidth) / imgWidth;

        pdf.addImage(imgData, 'JPEG', 10, 10, printWidth, printHeight);
        pdf.save('okey-sonuc.pdf');

    } catch (error) {
        console.error("PDF Export Failed", error);
        alert("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    }
};
