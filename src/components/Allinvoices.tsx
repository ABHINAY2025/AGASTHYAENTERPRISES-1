import React, { useEffect, useState } from "react";
import { db } from "../components/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import type { InvoiceData } from "../types/invoice";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader"; // ✅ ADD THIS

// Accordion component
const InvoiceAccordion: React.FC<{
  invoice: InvoiceData;
  index: number;
  handleDelete: (invoiceId: string) => void;
}> = ({ invoice, index, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePDF = () => {
    navigate("/generate-invoice", { state: { invoice } });
  };

  return (
    <div className="border-2 mx-20 border-gray-300 rounded-md shadow-sm bg-white">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300"
      >
        Invoice #{invoice.invoiceDetails.invoiceNumber} —{" "}
        {invoice.billTo.name || "Unknown Customer"}
      </button>

      {isOpen && (
        <div className="p-4 space-y-6">

          {/* INVOICE INFO */}
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="font-semibold text-blue-600">
              Invoice Details
            </h4>
            <p>
              <strong>No:</strong> {invoice.invoiceDetails.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {invoice.invoiceDetails.date}
            </p>
          </div>

          {/* CUSTOMER INFO */}
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <h4 className="font-semibold text-green-600">
              Customer
            </h4>
            <p><strong>Name:</strong> {invoice.billTo.name}</p>
            <p><strong>Address:</strong> {invoice.billTo.address}</p>
            <p><strong>GSTIN:</strong> {invoice.billTo.gstin}</p>
          </div>

          {/* ITEMS */}
          <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
            <h4 className="font-semibold text-purple-600">
              Items
            </h4>
            <ul className="list-disc pl-5">
              {invoice.items.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.description}</strong> —{" "}
                  {item.quantity} × {item.rate} = ₹
                  {(+item.quantity * +item.rate).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>

          {/* TOTAL */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="font-semibold">
              Total
            </h4>
            <p className="text-lg font-bold">
              ₹{invoice.total.toFixed(2)}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex">
            <button
              onClick={() =>
                handleDelete(invoice.invoiceDetails.invoiceNumber)
              }
              className="p-4 font-bold bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete Invoice
            </button>

            <button
              onClick={handleGeneratePDF}
              className="ml-4 p-4 font-bold bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
            >
              Generate PDF
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

// MAIN PAGE
const AllInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // ✅ LOADER STATE

  const navigate = useNavigate();

  // ✅ FETCH WITH LOADER
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "invoices"));
        const list = snap.docs.map(doc => doc.data() as InvoiceData);

        setInvoices(list);
        setFilteredInvoices(list);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false); // ✅ STOP LOADER
      }
    };

    fetchInvoices();
  }, []);

  // ✅ DELETE WITH LOADER
  const handleDelete = async (invoiceId: string) => {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      setLoading(true);

      await deleteDoc(doc(db, "invoices", invoiceId));

      const updated = invoices.filter(
        i => i.invoiceDetails.invoiceNumber !== invoiceId
      );

      setInvoices(updated);
      setFilteredInvoices(updated);

      alert("Invoice deleted ✅");

    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed ❌");
    } finally {
      setLoading(false); // ✅ STOP LOADER
    }
  };

  // ✅ SEARCH
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);

    setFilteredInvoices(
      invoices.filter(
        i =>
          i.invoiceDetails.invoiceNumber.toLowerCase().includes(q) ||
          i.billTo.name.toLowerCase().includes(q)
      )
    );
  };

  return (
    <div>

      {/* ✅ OVERLAY LOADER */}
      {loading && <Loader />}

      <div
        onClick={() => navigate("/")}
        className="cursor-pointer mx-10 mt-6 w-20 flex justify-center
                   font-bold text-white bg-blue-500 hover:bg-blue-800
                   rounded-lg"
      >
        <p className="py-2">Back</p>
      </div>

      <h2 className="text-2xl mx-20 mt-8 font-bold">
        All Invoices
      </h2>

      {/* SEARCH */}
      <div className="mt-4 mx-20">
        <input
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by invoice number or customer name"
          className="w-full p-2 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* LIST */}
      <div className="mt-4 space-y-4">
        {filteredInvoices.map((invoice, index) => (
          <InvoiceAccordion
            key={index}
            index={index}
            invoice={invoice}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AllInvoices;
