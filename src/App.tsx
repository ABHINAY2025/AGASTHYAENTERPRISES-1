import React from 'react';
import InvoiceForm from './components/Form/Form';
import { BrowserRouter } from 'react-router-dom'; 
import Privew from "./components/Privew"// Ensure the correct path to InvoiceForm

const App: React.FC = () => {
  return (
    <div className="App">
      <InvoiceForm />
    </div>
  );
};

export default App;
