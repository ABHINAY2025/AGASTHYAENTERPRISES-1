import jsPDF from "jspdf";
import Logo from "../components/Agasthya Enterprises.png";
import stamp from "../components/Form/image.png";

export const generateVectorInvoice = (pdf: jsPDF, data: any) => {
  let y = 20;

  // ---------------------------
  // HEADER
  // ---------------------------
  pdf.addImage(Logo, "PNG", 15, y, 35, 35);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("AGASTHYA ENTERPRISES", 60, y + 10);

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("Off: 1st Floor, 151, SBH Venture 2,", 60, y + 20);
  pdf.text("LB Nagar, Hyderabad, Telangana - 500074", 60, y + 27);
  pdf.text("Phone: 9949993656", 60, y + 34);

  pdf.line(10, y + 45, 200, y + 45);

  y += 55;

  // ---------------------------
  // BILL TO SECTION
  // ---------------------------
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bill To:", 10, y);

  const b = data.billTo;

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Name: ${b.name}`, 10, y + 10);
  pdf.text(`Address: ${b.address}`, 10, y + 18);
  pdf.text(`Mobile: ${b.mobileNo}`, 10, y + 26);
  pdf.text(`GSTIN: ${b.gstin}`, 10, y + 34);

  y += 45;

  // ---------------------------
  // TABLE HEADER
  // ---------------------------
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);

  const headers = [
    "S.No",
    "Description",
    "HSN",
    "Qty",
    "Rate",
    "GST%",
    "GST Amt",
    "Amount"
  ];

  const colX = [10, 30, 90, 115, 135, 155, 175, 175];

  headers.forEach((h, i) => pdf.text(h, colX[i], y));

  pdf.line(10, y + 2, 200, y + 2);

  y += 10;

  // ---------------------------
  // TABLE BODY
  // ---------------------------
  pdf.setFont("helvetica", "normal");

  data.items.forEach((item: any, index: number) => {
    if (y > 260) {
      pdf.addPage();
      y = 20;
    }

    pdf.text(String(index + 1), 10, y);
    pdf.text(item.description, 30, y);
    pdf.text(item.hsnCode, 90, y);
    pdf.text(String(item.quantity), 115, y);
    pdf.text(item.rate, 135, y);
    pdf.text(String(item.gstPercent), 155, y);
    pdf.text(item.gstAmount.toFixed(2), 175, y);
    pdf.text(item.amount.toFixed(2), 175, y);

    y += 8;
  });

  // ---------------------------
  // FOOTER TOTALS
  // ---------------------------
  y += 10;

  pdf.setFont("helvetica", "bold");
  pdf.text(`Subtotal: ₹${data.subtotal.toFixed(2)}`, 140, y);
  pdf.text(`CGST: ₹${data.cgstAmount.toFixed(2)}`, 140, y + 8);
  pdf.text(`SGST: ₹${data.sgstAmount.toFixed(2)}`, 140, y + 16);

  pdf.setFontSize(14);
  pdf.text(`TOTAL: ₹${data.total.toFixed(2)}`, 140, y + 30);

  y += 45;

  // ---------------------------
  // STAMP
  // ---------------------------
  pdf.addImage(stamp, "PNG", 140, y, 40, 40);
  pdf.text("Authorized Signature", 140, y + 48);

  return pdf;
};
