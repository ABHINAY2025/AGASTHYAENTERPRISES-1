import React from "react";
import { useLocation } from "react-router-dom";
import { InvoiceData } from "../types/invoice"; // Adjust the path if necessary
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {InvoiceHeader} from "./InvoiceHeader";
import {InvoiceTable}from "./InvoiceTable";
import {InvoiceFooter} from "./InvoiceFooter";
import WaterMark from "./Picsart_24-12-25_16-34-54-625.png";
import {
  calculateTotalPages,
  getItemsForPage,
  shouldShowFooterOnPage,
  ITEMS_PER_PAGE_1,
  FOOTER_THRESHOLD_2,
} from "../utils/pagination";

const InvoicePage: React.FC = () => {
  const location = useLocation();
  const invoiceData: InvoiceData = location.state?.invoice;

  if (!invoiceData) {
    return <div>No invoice data provided</div>;
  }

  const totalPages = calculateTotalPages(invoiceData.items.length);

  const renderPage = (pageNumber: number) => {
    const shouldShowFooter = shouldShowFooterOnPage(invoiceData.items.length, pageNumber);

    return (
      <div
        className="relative min-h-[297mm] w-[210mm] mx-auto bg-white p-8 shadow-lg flex flex-col justify-between"
        key={pageNumber}
        id={`page-${pageNumber}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <img src={WaterMark} alt="Watermark" style={{ width: "500px" }} />
        </div>

        <div className="relative z-10">
          <InvoiceHeader data={invoiceData} />
          {pageNumber === 1 && (
            <div className="grid grid-cols-2 gap-8 mb-3">
              <div>
                <h2 className="font-semibold mb-2">Bill To:</h2>
                <p>Name: {invoiceData.billTo.name}</p>
                <p>Address: {invoiceData.billTo.address}</p>
                <p>Mobile: {invoiceData.billTo.mobileNo}</p>
                <p>GSTIN: {invoiceData.billTo.gstin}</p>
              </div>
            </div>
          )}

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

          {shouldShowFooter && <InvoiceFooter data={invoiceData} />}
        </div>

        {shouldShowFooter && (
          <div>
            <div className="flex justify-between">
              <div className="w-[65%]">
                <h1 className="underline underline-offset-4">Terms and Conditions:</h1>
                <ul>
                  <li>1• Delivery charges will be always charged extra.</li>
                  <li>2• Once material delivered will not be taken back or exchanged.</li>
                  <li>3• No Claim will be admitted after delivery.</li>
                  <li>4• Subject to Hyderabad Jurisdiction</li>
                </ul>
                <p>
                  Received the above mentioned material in good condition and as per order.
                </p>
              </div>
              <div>
                <h1>
                  For <span className="font-bold text-blue-900 text-lg">AGASTHYA ENTERPRISES</span>
                </h1>
              </div>
            </div>
            <div className="mt-10 flex text-xl text-black justify-between">
              <h1>Receiver Signature</h1>
              <h1>Authorized Signature</h1>
            </div>
          </div>
        )}

        <div className="absolute w-full left-0 bottom-0 flex">
          <div className="w-[50%] h-2 bg-red-500"></div>
          <div className="w-[50%] h-2 bg-blue-700"></div>
        </div>
      </div>
    );
  };

  const downloadPDF = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const pdf = new jsPDF("p", "mm", "a4");
    for (let i = 0; i < totalPages; i++) {
      const pageContainer = document.querySelector(`#page-${i + 1}`);
      if (!pageContainer) continue;

      const canvas = await html2canvas(pageContainer as HTMLElement, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    pdf.save(`invoice-${invoiceData.invoiceDetails.invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-[210mm] mx-auto space-y-8">
        {Array.from({ length: totalPages }, (_, i) => renderPage(i + 1))}
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
};

export default InvoicePage;
