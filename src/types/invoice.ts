// src/models/invoice.ts

export interface InvoiceItem {
  description: string;
  hsnCode: string;
  quantity: string;
  rate: string;
  amount: string;
}

export interface BillTo {
  name: string;
  address: string;
  gstin: string;
  mobileNo: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  DespThrough: string;
}

export interface InvoiceData {
  items: InvoiceItem[];
  billTo: BillTo;
  invoiceDetails: InvoiceDetails;
  cgst: string;
  sgst: string;
  subtotal: number;
  total: number;
  cgstAmount: number;
  sgstAmount: number;
  AmountINwords: string;
}
