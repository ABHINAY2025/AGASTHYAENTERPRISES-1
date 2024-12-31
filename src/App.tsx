import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import InvoiceForm from './components/Form/Form'; // Your InvoiceForm component
import AllInvoices from './components/Allinvoices'; // Import the AllInvoices page/component
import Preview from './components/Preview'; // Ensure the correct path to Preview component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<InvoiceForm />} /> {/* Home route renders InvoiceForm */}
        <Route path="/allinvoices" element={<AllInvoices />} /> All invoices route
      </Routes>
    </Router>
  );
};

export default App;
