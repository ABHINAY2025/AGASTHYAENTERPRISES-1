import React, { useState,useEffect } from 'react';
import { InvoiceData, InvoiceItem, BillTo, InvoiceDetails } from '../../types/invoice'; // Import the InvoiceData interface
import { FaTrashAlt } from 'react-icons/fa'; // Import the trash icon from React Icons
import Preview from '../Privew'; // Assuming Preview component is in the right folder
import { getFirestore, collection, addDoc, doc, getDoc , setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "../firebase"

const InvoiceForm: React.FC = () => {
  const [User,setUser]=useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (Cuser) => {
      setUser(Cuser);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);
console.log(User)
  const navigate = useNavigate(); // Get the navigate function
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
      DespThrough: '',
    },
    cgst: '',
    sgst: '',
    subtotal: 0,
    total: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    AmountINwords: '',
  });
  const handleNavigate = () => {
    navigate('/allinvoices'); // Navigate to the /allinvoices route
  };
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'rate' || field === 'quantity') {
      const rate = parseFloat(updatedItems[index].rate) || 0;
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      updatedItems[index].amount = (rate * quantity).toFixed(2);
    }

    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const handleBillToChange = (field: keyof BillTo, value: string) => {
    setInvoiceData({
      ...invoiceData,
      billTo: { ...invoiceData.billTo, [field]: value },
    });
  };

  const handleInvoiceDetailsChange = (field: keyof InvoiceDetails, value: string) => {
    let updatedValue = value;

    if (field === 'date' && value) {
      const date = new Date(value);
      updatedValue = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase();
    }

    setInvoiceData({
      ...invoiceData,
      invoiceDetails: { ...invoiceData.invoiceDetails, [field]: updatedValue },
    });
  };

  const handleCGSTSGSTChange = (field: 'cgst' | 'sgst', value: string) => {
    setInvoiceData({ ...invoiceData, [field]: value });
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
          amount: '0',
        },
      ],
    });
  };

  const handleCalculateTotal = () => {
    const subtotal = invoiceData.items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
    const cgstAmount = (subtotal * (parseFloat(invoiceData.cgst) || 0)) / 100;
    const sgstAmount = (subtotal * (parseFloat(invoiceData.sgst) || 0)) / 100;
    const total = subtotal + cgstAmount + sgstAmount;
    setInvoiceData({
      ...invoiceData,
      subtotal,
      cgstAmount,
      sgstAmount,
      total,
    });
  };

  const handleRoundOff = () => {
    const roundedTotal = Math.round(invoiceData.total);
    setInvoiceData({ ...invoiceData, total: roundedTotal });
  };

  const storeInvoiceData = async () => {
    try {
      // Custom invoice ID
      const invoiceId = `${invoiceData.invoiceDetails.invoiceNumber}`;
  
      // Reference to the Firestore document with the custom ID
      const docRef = doc(db, 'invoices', invoiceId);
  
      // Check if a document with the same invoice ID already exists
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // If the document exists, show an error message and exit
        toast.error(`Invoice with ID: ${invoiceId} already exists.`);
        return;
      }
  
      // Save the invoice data to Firestore
      await setDoc(docRef, {
        invoiceId, // Save the custom invoiceId
        items: invoiceData.items,
        billTo: invoiceData.billTo,
        invoiceDetails: invoiceData.invoiceDetails,
        cgst: invoiceData.cgst,
        sgst: invoiceData.sgst,
        subtotal: invoiceData.subtotal,
        total: invoiceData.total,
        cgstAmount: invoiceData.cgstAmount,
        sgstAmount: invoiceData.sgstAmount,
        AmountINwords: invoiceData.AmountINwords,
      });
  
      // Log the invoice ID and data
      // console.log("Invoice stored with custom ID: ", invoiceId);
  
      // Update the invoiceData state to reflect the custom invoiceId
      setInvoiceData({
        ...invoiceData,
        invoiceDetails: {
          ...invoiceData.invoiceDetails,
          invoiceNumber: invoiceId, // Assuming 'invoiceNumber' stores the ID in the invoice details
        },
      });
  
      // Show success message
      toast.success(`Invoice saved successfully with ID: ${invoiceId}`);
    } catch (e) {
      console.error("Error adding document: ", e);
  
      // Show error message
      toast.error("Error saving invoice. Please try again.");
    }
  };
  
  
  
  
  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <Navbar/>
      <div 
      className='font-bold w-40 rounded py-2 px-7 justify-center items-center flex hover:bg-blue-800 cursor-pointer bg-blue-500 text-white'
      onClick={handleNavigate} // Handle the click event
    >
      <p>All Invoices</p>
    </div>
      <h1 className="text-2xl font-semibold text-center mb-8">Invoice Form</h1>
      <ToastContainer /> {/* This will render the toasts */}
      <form>
        {/* Bill To Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Bill To</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.billTo.name}
              onChange={(e) => handleBillToChange('name', e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.billTo.address}
              onChange={(e) => handleBillToChange('address', e.target.value)}
            />
            <input
              type="text"
              placeholder="GSTIN"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.billTo.gstin}
              onChange={(e) => handleBillToChange('gstin', e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile No."
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.billTo.mobileNo}
              onChange={(e) => handleBillToChange('mobileNo', e.target.value)}
            />
          </div>
        </div>

        {/* Invoice Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Invoice Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Invoice Number"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.invoiceDetails.invoiceNumber}
              onChange={(e) => handleInvoiceDetailsChange('invoiceNumber', e.target.value)}
            />
            <input
              type="date"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.invoiceDetails.date}
              onChange={(e) => handleInvoiceDetailsChange('date', e.target.value)}
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Items</h3>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-4">
              <input
                type="text"
                placeholder="Description"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              <input
                type="text"
                placeholder="HSN Code"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={item.hsnCode}
                onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={item.rate}
                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Amount"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  value={item.amount}
                  readOnly
                />
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteItem(index)}
                >
                  <FaTrashAlt /> {/* React Icon trash icon */}
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>

        {/* CGST and SGST Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">CGST/SGST</h3>
          <div className="grid grid-cols-2 gap-6">
            <input
              type="number"
              placeholder="CGST (%)"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.cgst}
              onChange={(e) => handleCGSTSGSTChange('cgst', e.target.value)}
            />
            <input
              type="number"
              placeholder="SGST (%)"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.sgst}
              onChange={(e) => handleCGSTSGSTChange('sgst', e.target.value)}
            />
          </div>
        </div>

        {/* Total Calculation and Final Section */}
        <div className="mb-6 ">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-4"
            onClick={handleCalculateTotal}
          >
            Calculate Total
          </button>
          <button
            type="button"
            className="px-4 py-2 ml-4 bg-blue-600 text-white rounded-lg"
            onClick={handleRoundOff}
          >
            Round Off
          </button>
            <button
             type="button"
             className="px-4 ml-10 py-2 bg-blue-600 text-white rounded-lg"
             onClick={storeInvoiceData}>
              save data
            </button>
        </div>
        <Preview invoiceData={invoiceData} />
      </form>
    </div>
  );
};

export default InvoiceForm;