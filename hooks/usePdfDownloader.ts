
import React, { useCallback } from 'react';
// In a real project, you would install these with: npm install jspdf html2canvas
// For this environment, we assume they are available.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePdfDownloader = (elementRef: React.RefObject<HTMLElement>, fileName: string) => {
  const downloadPdf = useCallback(() => {
    const input = elementRef.current;
    if (!input) {
      console.error("PDF download failed: reference element not found.");
      return;
    }

    // --- PDF Generation Fix for Dark Mode ---
    // 1. Check if dark mode is active and store the state.
    const wasDarkMode = document.documentElement.classList.contains('dark');
    
    // 2. If it is, temporarily remove the 'dark' class to force light-mode styles.
    if (wasDarkMode) {
        document.documentElement.classList.remove('dark');
    }

    const promise = html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff' // Ensure canvas background is white
    });
    
    promise.then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      let position = 0;
      let heightLeft = height;

      pdf.addImage(imgData, 'PNG', 0, position, width, height);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - height;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, width, height);
        heightLeft -= pdfHeight;
      }
      pdf.save(`${fileName.replace(/ /g, '_')}.pdf`);
    }).catch(err => {
        console.error("Error generating PDF", err);
    }).finally(() => {
        // 3. IMPORTANT: Restore dark mode if it was originally active.
        // This runs whether the promise succeeded or failed.
        if (wasDarkMode) {
            document.documentElement.classList.add('dark');
        }
    });

  }, [elementRef, fileName]);

  return { downloadPdf };
};
