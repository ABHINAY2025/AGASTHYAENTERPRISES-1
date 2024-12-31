import React, { useState } from 'react';
import { InvoiceData, InvoiceItem, BillTo, InvoiceDetails } from '../../types/invoice'; // Import the InvoiceData interface
import { FaTrashAlt } from 'react-icons/fa'; // Import the trash icon from React Icons
import Preview from '../Privew'; // Assuming Preview component is in the right folder

const InvoiceForm: React.FC = () => {
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

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-8">Invoice Form</h1>

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
            <input
              type="text"
              placeholder="Despatch Through"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={invoiceData.invoiceDetails.DespThrough}
              onChange={(e) => handleInvoiceDetailsChange('DespThrough', e.target.value)}
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
                placeholder="Rate"
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
        <div className="mb-6">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-4"
            onClick={handleCalculateTotal}
          >
            Calculate Total
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleRoundOff}
          >
            Round Off
          </button>
        </div>

        <Preview invoiceData={invoiceData} />
      </form>
    </div>
  );
};

export default InvoiceForm;
