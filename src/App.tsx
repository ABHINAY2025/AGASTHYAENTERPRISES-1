import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/firebase'; // Import the configured auth object
import InvoiceForm from './components/Form/Form';
import AllInvoices from './components/Allinvoices';
import Invoice from './components/Invoice';
import Login from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <InvoiceForm /> : <Navigate to="/login" />} />
        <Route path="/allinvoices" element={user ? <AllInvoices /> : <Navigate to="/login" />} />
        <Route path="/generate-invoice" element={user ? <Invoice /> : <Navigate to="/login" />} />
        {/* Add a Login component route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
