import React, { useState } from 'react'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; 
import { auth } from '../components/firebase'; // Adjust the path to your firebase.js 
import { useNavigate } from 'react-router-dom'; 

const LoginSignup: React.FC = () => {   
  const navigate = useNavigate();   
  const [email, setEmail] = useState(''); // State to handle email input
  const [resetEmailSent, setResetEmailSent] = useState(false); // State for password reset status

  const handleLogin = async (e) => {     
    e.preventDefault();     
    const password = e.target.password.value;      
    try {       
      await signInWithEmailAndPassword(auth, email, password);       
      navigate("/"); // Redirect to the home page on success     
    } catch (error) {       
      console.error("Login error", error);     
    }   
  };       

  const handleForgotPassword = async () => {   
    try {     
      await sendPasswordResetEmail(auth, email);     
      setResetEmailSent(true); // Set the state to indicate the email was sent   
    } catch (error) {     
      console.error("Password reset error", error);     
      setResetEmailSent(false); // Handle error in case of failure   
    }   
  };

  return (     
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">       
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">         
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">           
          Login to Your Account         
        </h2>          

        <form onSubmit={handleLogin} className="space-y-6">             
          <div className="flex flex-col">               
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state 
              required                 
              className="p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />             
          </div>             
          <div className="flex flex-col">               
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required                 
              className="p-3 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />             
          </div>             
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">               
            Login             
          </button>             
          <p className="text-center text-blue-600">               
            Forgot your password? 
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className="font-semibold">                 
              Reset Password               
            </button>             
          </p>             

          {/* Reset Email Sent Message */}             
          {resetEmailSent && <p className="text-center text-green-600 mt-2">Password reset email sent!</p>}         
        </form>             

        <div className="flex items-center justify-between mt-4">           
          <hr className="w-full border-blue-300" />                     
          <hr className="w-full border-blue-300" />         
        </div>                 
      </div>     
    </div>   
  ); 
};  

export default LoginSignup;
