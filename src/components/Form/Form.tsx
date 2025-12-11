import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import Preview from '../Privew';
import Loader from '../Loader';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ================== TYPES ================== */

export interface InvoiceItem {
  description: string;
  hsnCode: string;
  quantity: string;
  rate: string;
  gstPercent: string;
  amount: string;
  gstAmount?: number;
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
}

export interface InvoiceData {
  items: InvoiceItem[];
  billTo: BillTo;
  invoiceDetails: InvoiceDetails;
  subtotal: number;
  total: number;
  cgstAmount: number;
  sgstAmount: number;
  AmountINwords: string;
}

/* ================== STYLES ================== */

const inputStyle =
  "w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition";

const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";

const btn =
  "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2 rounded-md shadow-md transition font-semibold";

const btnDark =
  "bg-gray-700 hover:bg-gray-800 active:scale-95 text-white px-4 py-2 rounded-md shadow transition font-semibold";

const sectionTitle =
  "text-lg font-bold text-gray-800 border-b pb-1 mb-3";

/* ================== COMPONENT ================== */



const InvoiceForm: React.FC = () => {

  useEffect(() => {
    onAuthStateChanged(auth, () => {});
  }, []);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    items: [],
    billTo: {
      name: '',
      address: '',
      gstin: '',
      mobileNo: '',
    },
    invoiceDetails: {
      invoiceNumber: '',
      date: '',
    },
    subtotal: 0,
    total: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    AmountINwords: '',
  });

  /* ================== HANDLERS ================== */

  const handleBillToChange = (field: keyof BillTo, val: string) => {
    setInvoiceData({
      ...invoiceData,
      billTo: { ...invoiceData.billTo, [field]: val },
    });
  };

  const handleInvoiceDetailsChange = (field: keyof InvoiceDetails, val: string) => {
    let updated = val;
    if (field === 'date') {
      updated = new Date(val)
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .toUpperCase();
    }

    setInvoiceData({
      ...invoiceData,
      invoiceDetails: { ...invoiceData.invoiceDetails, [field]: updated },
    });
  };


  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          description: '',
          hsnCode: '',
          quantity: '',
          rate: '',
          gstPercent: '',
          amount: '0.00',
          gstAmount: 0,
        },
      ],
    });
  };


  const handleItemChange = (
    i: number,
    field: keyof InvoiceItem,
    val: string
  ) => {

    const items = [...invoiceData.items];
    items[i] = { ...items[i], [field]: val };

    const rate = parseFloat(items[i].rate) || 0;
    const qty = parseFloat(items[i].quantity) || 0;
    const gst = parseFloat(items[i].gstPercent) || 0;

    const baseAmount = rate * qty;
    const gstAmount = (baseAmount * gst) / 100;
    const finalAmount = baseAmount + gstAmount;

    items[i].gstAmount = gstAmount;
    items[i].amount = finalAmount.toFixed(2);

    setInvoiceData({
      ...invoiceData,
      items
    });
  };


  const handleDeleteItem = (i: number) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter((_, idx) => idx !== i),
    });
  };


  /* ================== TOTALS ================== */

  const handleCalculateTotal = () => {

    let subtotal = 0;
    let gstTotal = 0;

    invoiceData.items.forEach(i => {
      const base = (parseFloat(i.rate || "0") * parseFloat(i.quantity || "0")) || 0;
      subtotal += base;
      gstTotal += i.gstAmount || 0;
    });

    setInvoiceData({
      ...invoiceData,
      subtotal,
      cgstAmount: gstTotal / 2,
      sgstAmount: gstTotal / 2,
      total: subtotal + gstTotal
    });
  };

  const handleRoundOff = () => {
    setInvoiceData({
      ...invoiceData,
      total: Math.round(invoiceData.total),
    });
  };


  /* ================== SAVE ================== */

  const storeInvoiceData = async () => {
  try {
    const invoiceNo = invoiceData.invoiceDetails.invoiceNumber;

    if (!invoiceNo) {
      toast.error("Invoice number required");
      return;
    }

    setLoading(true);    // ✅ SHOW LOADER

    const ref = doc(db, 'invoices', invoiceNo);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      toast.error("Invoice already exists");
      setLoading(false);
      return;
    }

    await setDoc(ref, {
      invoiceId: invoiceNo,
      ...invoiceData,
    });

    toast.success("Invoice Saved ✅");

  } catch (err) {
    toast.error("Save failed");
  }
  finally {
    setLoading(false);  // ✅ HIDE LOADER
  }
};


  /* ================== JSX ================== */

  return (
  <div className="bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">

    <Navbar />
    <ToastContainer />

    {loading && <Loader />}

    <div className="w-full px-4 max-w-5xl mx-auto">

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 shadow-xl rounded-lg">

        {/* HEADER */}
        <div className="flex justify-between mb-6 items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Invoice Generator
          </h1>

          <button
            className={btnDark}
            onClick={() => navigate('/allinvoices')}
          >
            View All Invoices
          </button>
        </div>

        {/* BILL TO */}
        <section className="mb-6">
          <h2 className={sectionTitle}>Bill To</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className={labelStyle}>Customer Name</label>
              <input
                className={inputStyle}
                onChange={(e)=>handleBillToChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className={labelStyle}>Address</label>
              <input
                className={inputStyle}
                onChange={(e)=>handleBillToChange("address", e.target.value)}
              />
            </div>

            <div>
              <label className={labelStyle}>GSTIN</label>
              <input
                className={inputStyle}
                onChange={(e)=>handleBillToChange("gstin", e.target.value)}
              />
            </div>

            <div>
              <label className={labelStyle}>Mobile</label>
              <input
                className={inputStyle}
                onChange={(e)=>handleBillToChange("mobileNo", e.target.value)}
              />
            </div>

          </div>
        </section>


        {/* INVOICE INFO */}
        <section className="mb-6">
          <h2 className={sectionTitle}>Invoice Info</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className={labelStyle}>Invoice No</label>
              <input
                className={inputStyle}
                onChange={(e)=>handleInvoiceDetailsChange("invoiceNumber", e.target.value)}
              />
            </div>

            <div>
              <label className={labelStyle}>Invoice Date</label>
              <input
                type="date"
                className={inputStyle}
                onChange={(e)=>handleInvoiceDetailsChange("date", e.target.value)}
              />
            </div>

          </div>
        </section>


        {/* ITEMS */}
        <section className="mb-6">
          <h2 className={sectionTitle}>Items</h2>

          <div className="hidden md:grid grid-cols-6 gap-3 text-sm 
                          font-semibold text-gray-600 mb-2 text-center">
            <p>Description</p>
            <p>HSN</p>
            <p>Qty</p>
            <p>Unit Price</p>
            <p>GST %</p>
            <p>Amount</p>
          </div>


          {invoiceData.items.map((item, i) => (
            <div key={i}
              className="grid sm:grid-cols-2 md:grid-cols-3 
                         lg:grid-cols-6 gap-3 mb-2 items-center">

              <input
                className={inputStyle}
                placeholder="Item"
                onChange={(e)=>handleItemChange(i,"description",e.target.value)}
              />

              <input
                className={inputStyle}
                placeholder="HSN"
                onChange={(e)=>handleItemChange(i,"hsnCode",e.target.value)}
              />

              <input
                type="number"
                className={`${inputStyle} text-center`}
                onChange={(e)=>handleItemChange(i,"quantity",e.target.value)}
              />

              <input
                type="number"
                className={`${inputStyle} text-center`}
                onChange={(e)=>handleItemChange(i,"rate",e.target.value)}
              />

              <input
                type="number"
                className={`${inputStyle} text-center`}
                onChange={(e)=>handleItemChange(i,"gstPercent",e.target.value)}
              />

              <div className="flex gap-2 items-center justify-center">

                <input
                  readOnly
                  className={`${inputStyle} bg-gray-100 text-center`}
                  value={item.amount}
                />

                <button
                  onClick={() => handleDeleteItem(i)}
                  className="text-red-600 hover:text-red-800 text-lg">
                  <FaTrashAlt />
                </button>

              </div>

            </div>
          ))}


          <button
            className={`${btn} mt-3`}
            type="button"
            onClick={handleAddItem}
          >
            + Add Item
          </button>
        </section>


        {/* TOTAL */}
        <section className="flex flex-wrap gap-4 items-center">

          <button onClick={handleCalculateTotal} className={btn}>
            Calculate Total
          </button>

          <button onClick={handleRoundOff} className={btn}>
            Round Off
          </button>

          <button onClick={storeInvoiceData} className={btn}>
            Save Invoice
          </button>

          <div className="ml-auto text-right">
            <p>Subtotal : ₹{invoiceData.subtotal.toFixed(2)}</p>
            <p>CGST : ₹{invoiceData.cgstAmount.toFixed(2)}</p>
            <p>SGST : ₹{invoiceData.sgstAmount.toFixed(2)}</p>

            <p className="font-bold text-xl">
              TOTAL : ₹{invoiceData.total.toFixed(2)}
            </p>
          </div>

        </section>

      </div>


      {/* ================= PREVIEW BELOW FORM ================= */}
      <div className="mt-8 bg-white rounded-lg shadow-lg">
        <Preview invoiceData={invoiceData} />
      </div>

    </div>

  </div>
);
};

export default InvoiceForm;
