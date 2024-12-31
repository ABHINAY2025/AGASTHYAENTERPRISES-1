import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from './types/invoice';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceTable } from './components/InvoiceTable';
import { InvoiceFooter } from './components/InvoiceFooter';
import { calculateTotalPages, getItemsForPage, shouldShowFooterOnPage, ITEMS_PER_PAGE_1, FOOTER_THRESHOLD_2 } from './utils/pagination';
import WaterMark from "./components/Picsart_24-12-25_16-34-54-625.png"
function App() {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceData: InvoiceData = {
    items: Array(11).fill({
      description: 'Sample Item',
      hsnCode: '12345',
      quantity: '1',
      rate: '100',
      amount: '100',
    }),
    billTo: {
      name: 'John Doe',
      address: '123 Street, City',
      gstin: 'GSTIN123456',
      mobileNo: '1234567890',
    },
    invoiceDetails: {
      invoiceNumber: 'INV-001',
      date: '2024-03-14',
      DespThrough: 'Courier',
    },
    cgst: '9',
    sgst: '9',
    subtotal: 4000,
    total: 4720,
    cgstAmount: 360,
    sgstAmount: 360,
  };

  const totalPages = calculateTotalPages(invoiceData.items.length);

  const renderPage = (pageNumber: number) => (
  <div
    className="relative min-h-[297mm] w-[210mm] mx-auto bg-white p-8 shadow-lg"
    key={pageNumber}
  >
    {/* Watermark Background */}
    <div
      className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
    >
      <img
        src={WaterMark}
        alt="Watermark"
        style={{
          width: '500px',
        }}
      />
    </div>

    {/* Page Content */}
    <div className="relative z-10">
      {/* Invoice Header (Repeats on every page) */}
      <InvoiceHeader data={invoiceData} />

      {/* Bill To and Invoice Details (First Page Only) */}
      {pageNumber === 1 && (
        <div className="grid grid-cols-2 gap-8 mb-3">
          <div>
            <h2 className="font-semibold mb-2">Bill To:</h2>
            <p>{invoiceData.billTo.name}</p>
            <p>{invoiceData.billTo.address}</p>
            <p>GSTIN: {invoiceData.billTo.gstin}</p>
            <p>Mobile: {invoiceData.billTo.mobileNo}</p>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      <InvoiceTable
        items={getItemsForPage(invoiceData.items, pageNumber)}
        startIndex={
          pageNumber === 1
            ? 0
            : pageNumber === 2
            ? ITEMS_PER_PAGE_1
            : FOOTER_THRESHOLD_2
        }
        showHeader={pageNumber === 1}
      />

      {/* Footer */}
      {shouldShowFooterOnPage(invoiceData.items.length, pageNumber) && (
        <InvoiceFooter data={invoiceData} />
      )}

      {/* Page Number */}
    </div>
      <div className=" absolute w-full left-0 bottom-0 flex">
       <div className='w-[50%] h-2 bg-red-500'></div>
       <div className='w-[50%] h-2 bg-blue-700'></div>
      </div>
  </div>
);


  const downloadPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    for (let i = 0; i < totalPages; i++) {
      const pageContainer = document.querySelector(`#page-${i + 1}`);
      if (!pageContainer) continue;
  
      const canvas = await html2canvas(pageContainer as HTMLElement, {
        scale: 2,
        useCORS: true, // Enables cross-origin image capture
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save(`invoice-${invoiceData.invoiceDetails.invoiceNumber}.pdf`);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[210mm] mx-auto space-y-8">
        {Array.from({ length: totalPages }, (_, i) => (
          <div id={`page-${i + 1}`} key={i}>
            {renderPage(i + 1)}
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download All Pages
        </button>
      </div>
    </div>
  );
}

export default App;
