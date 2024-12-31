import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import InvoiceForm from './components/Form/Form'; // Your InvoiceForm component
import AllInvoices from './components/Allinvoices'; // Import the AllInvoices page/component // Ensure the correct path to Preview component
import Invoice from "./components/Invoice"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<InvoiceForm />} /> {/* Home route renders InvoiceForm */}
        <Route path="/allinvoices" element={<AllInvoices />} /> 
        <Route path="/generate-invoice" element={<Invoice />} /> 
      </Routes>
    </Router>
  );
};

export default App;
