import React from 'react';
import { InvoiceData } from '../types/invoice';
import jsPDF from 'jspdf';
import Loader from "../components/Loader";

import html2canvas from 'html2canvas';

import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceFooter } from './InvoiceFooter';

import {
  calculateTotalPages,
  getItemsForPage,
  shouldShowFooterOnPage,
  ITEMS_PER_PAGE_1,
  FOOTER_THRESHOLD_2
} from '../utils/pagination';

import WaterMark from "./Picsart_24-12-25_16-34-54-625.png";
import stamp from "./Form/image.png";

interface AppProps {
  invoiceData: InvoiceData;
}

const App: React.FC<AppProps> = ({ invoiceData }) => {
  const [loading, setLoading] = React.useState(false);


  const totalPages = calculateTotalPages(invoiceData.items.length);

  const renderPage = (pageNumber: number) => {
    const shouldShowFooter =
      shouldShowFooterOnPage(invoiceData.items.length, pageNumber);

    return (
      <div
        className="relative min-h-[297mm] w-[210mm] mx-auto bg-white p-8 shadow-lg flex flex-col"
        key={pageNumber}
      >
        {/* ================= WATERMARK ================= */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <img src={WaterMark} alt="Watermark" style={{ width: "400px" }} />
        </div>

        {/* ================= TOP CONTENT ================= */}
        <div className="relative z-10">

          <InvoiceHeader data={invoiceData} />

          {pageNumber === 1 && (
            <div className="grid grid-cols-2 gap-8 mb-9">
              <div>
                <h2 className="font-bold mb-2">Bill To:</h2>
                <p>Name: <span className="font-bold">{invoiceData.billTo.name}</span></p>
                <p>Address: <span className="font-bold">{invoiceData.billTo.address}</span></p>
                <p>Mobile: <span className="font-bold">{invoiceData.billTo.mobileNo}</span></p>
                <p>GSTIN: <span className="font-bold">{invoiceData.billTo.gstin}</span></p>
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

        </div>

        {/* ================= BOTTOM LOCKED SECTION ================= */}
        {shouldShowFooter && (

          <div className="relative z-10 mt-auto">

            {/* FOOTER */}
            <div className="pt-4">
              <InvoiceFooter data={invoiceData} />
            </div>

            {/* TERMS & CONDITIONS */}
            <div className=" pt-3 text-sm">

              <div className="flex justify-between">

                {/* LEFT SIDE */}
                <div className="w-[65%]">
                  <h1 className="underline underline-offset-4">
                    Terms and Conditions:
                  </h1>
                  
                  <ul className="mt-1">
                    <li>1• Delivery charges will be always charged extra.</li>
                    <li>2• Once material delivered will not be taken back or exchanged.</li>
                    <li>3• No Claim will be admitted after delivery.</li>
                    <li>4• Subject to Hyderabad Jurisdiction</li>
                  </ul>

                  <p className="mt-2">
                    Received the above mentioned material in good condition
                    and as per order.
                  </p>
                </div>

                {/* RIGHT STAMP */}
                <div>
                  <h1>
                    For{" "}
                    <span className="font-bold text-customRed text-lg">
                      AGASTHYA <span className="text-blue-900">ENTERPRISES</span>
                    </span>
                  </h1>

                  <img
                    className="w-36 mt-3 ml-24"
                    src={stamp}
                    alt="stamp"
                  />
                </div>

              </div>

              {/* SIGNATURE LINE */}
              <div className="flex justify-between mt-3 text-lg">

                <h1>Receiver Signature</h1>

                <div>
                  <p className="text-[10px] text-right">
                    This is a digitally signed document
                  </p>
                  <h1 className="-mt-2">
                    Authorized Signature
                  </h1>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= PAGE NUMBER ================= */}
        <div className="absolute w-full left-0 bottom-0 flex flex-col justify-center">

          <div className="flex justify-center px-6 py-2">
            <h1>{pageNumber}</h1>
          </div>

          <div className="flex">
            <div className="w-[50%] h-2 bg-red-500"></div>
            <div className="w-[50%] h-2 bg-blue-700"></div>
          </div>

        </div>

      </div>
    );
  };


  /* ================= PDF DOWNLOAD ================= */

const downloadPDF = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  setLoading(true);  // START LOADING

  try {
    const pdf = new jsPDF("p", "mm", "a4");

    const originalDPR = window.devicePixelRatio;
    window.devicePixelRatio = 2;

    for (let i = 0; i < totalPages; i++) {
      const page = document.querySelector(`#page-${i + 1}`);
      if (!page) continue;

      const canvas = await html2canvas(page as HTMLElement, {
        scale: window.devicePixelRatio * 5,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (i > 0) pdf.addPage();

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST"
      );
    }

    pdf.save(`invoice-${invoiceData.invoiceDetails.invoiceNumber}.pdf`);
    window.devicePixelRatio = originalDPR;

  } catch (error) {
    console.error("PDF generation failed:", error);
  }

  setLoading(false); // STOP LOADING
};


return (
  <div className="min-h-screen bg-gray-100 py-8">

    {/* === LOADING OVERLAY === */}
    {loading && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <Loader />
      </div>
    )}

    <div className="max-w-[210mm] mx-auto space-y-8">
      {Array.from({ length: totalPages }, (_, i) => (
        <div key={i} id={`page-${i + 1}`}>
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

};

export default App;
