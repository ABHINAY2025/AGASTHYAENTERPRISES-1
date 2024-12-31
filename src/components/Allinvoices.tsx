import React, { useEffect, useState } from 'react';
import { db } from '../components/firebase'; // Import your Firebase config
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import necessary Firestore methods
import type { InvoiceData } from '../types/invoice';
import { useNavigate } from 'react-router-dom';


// Accordion component for each invoice
const InvoiceAccordion: React.FC<{
  invoice: InvoiceData;
  index: number;
  handleDelete: (invoiceId: string) => void;
}> = ({ invoice, index, handleDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGeneratePDF = () => {
    // Navigate to the home page ("/") and pass invoice data in the state
    navigate('/generate-invoice', { state: { invoice } });
  };
  
  return (
    <div className="border-2 mx-20  border-gray-300 rounded-md shadow-sm bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300"
      >
        Invoice #{invoice.invoiceDetails.invoiceNumber} - {invoice.billTo.name || 'Unknown Customer'}
      </button>
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Invoice General Info Box */}
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="font-semibold text-lg text-blue-600">Invoice Details</h4>
            <div>
              <strong>Invoice Number:</strong> {invoice.invoiceDetails.invoiceNumber || 'N/A'}
            </div>
            <div>
              <strong>Date:</strong> {invoice.invoiceDetails.date}
            </div>
          </div>

          {/* Customer Info Box */}
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <h4 className="font-semibold text-lg text-green-600">Customer Info</h4>
            <div>
              <strong>Name:</strong> {invoice.billTo.name || 'N/A'}
            </div>
            <div>
              <strong>Address:</strong> {invoice.billTo.address || 'N/A'}
            </div>
            <div>
              <strong>GSTIN:</strong> {invoice.billTo.gstin || 'N/A'}
            </div>
          </div>

          {/* Items Info Box */}
          <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
            <h4 className="font-semibold text-lg text-purple-600">Items</h4>
            <ul className="list-disc pl-5">
              {invoice.items.length > 0 ? (
                invoice.items.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.description || 'Item Name'}</strong>: quantity {item.quantity} x unit price {item.rate} ={' '}
                    {item.quantity * item.rate}
                  </li>
                ))
              ) : (
                <li>No items available</li>
              )}
            </ul>
          </div>

          {/* Taxes Box */}
          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
            <h4 className="font-semibold text-lg text-indigo-600">Taxes</h4>
            <div>
              <strong>SGST:</strong> {invoice.sgst || 0}%
            </div>
            <div>
              <strong>CGST:</strong> {invoice.cgst || 0}%
            </div>
          </div>

          {/* Total Box */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="font-semibold text-lg text-gray-800">Total</h4>
            <div>
              <strong>Total Amount:</strong>{' '}
              {invoice.items.reduce((total, item) => total + item.quantity * item.rate, 0) *
                (1 + (invoice.sgst + invoice.cgst) / 100)}
            </div>
          </div>

          {/* Delete Button */}
          <div className='flex'>
          <div
            onClick={() => handleDelete(invoice.invoiceDetails.invoiceNumber)} // Calling handleDelete with the invoiceId
            className="cursor-pointer text-white  font-bold p-4 bg-red-500 rounded-md  hover:bg-red-600"
          >
            Delete Invoice
          </div>
          <div
            onClick={handleGeneratePDF}
            className="cursor-pointer ml-5 font-bold p-4 bg-blue-500 rounded-md text-white  hover:bg-blue-700"
          >
            Generate PDF
          </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

const AllInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceData[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoicesCollection = collection(db, 'invoices'); // 'invoices' is the Firestore collection
      const invoiceSnapshot = await getDocs(invoicesCollection);
      const invoiceList = invoiceSnapshot.docs.map((doc) => doc.data() as InvoiceData);
      setInvoices(invoiceList);
      setFilteredInvoices(invoiceList); // Initialize filtered list with all invoices
    };

    fetchInvoices();
  }, []);

  // Handle delete function
  const handleDelete = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const invoiceDocRef = doc(db, 'invoices', invoiceId);
        await deleteDoc(invoiceDocRef);
        alert('Invoice deleted successfully');
        // After deleting, refresh the invoice list
        const updatedInvoices = invoices.filter((invoice) => invoice.invoiceDetails.invoiceNumber !== invoiceId);
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
  };

  // Handle search query change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredInvoices(
      invoices.filter(
        (invoice) =>
          invoice.invoiceDetails.invoiceNumber.toString().toLowerCase().includes(query) ||
          invoice.billTo.name.toLowerCase().includes(query)
      )
    );
  };
  const navigate = useNavigate();
  return (
    <div>
        <div 
        className="cursor-pointer mx-10 mt-10 rounded-lg text-lg flex hover:bg-blue-800   justify-center font-bold text-white  w-20 bg-blue-500 mb-4" 
        onClick={() => navigate("/")} // Navigate to the home page ("/")
      >
         <h1 className='px-7 py-2 '>Back</h1>
      </div>
      <h2 className="text-2xl mx-20 mt-10 font-bold text-gray-900">All Invoices</h2>
      {/* Search Box */}
      <div className="mt-4 m-20 ">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by invoice number or customer name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Invoices List */}
      <div className="mt-4 space-y-4">
        {filteredInvoices.map((invoice, index) => (
          <div key={index}>
            <InvoiceAccordion invoice={invoice} index={index} handleDelete={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllInvoices;