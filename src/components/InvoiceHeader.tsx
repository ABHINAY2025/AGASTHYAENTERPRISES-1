import React from 'react';
import { InvoiceData } from '../types/invoice';
import Logo from "../components/Agasthya Enterprises.png"

interface Props {
  data: InvoiceData;
}

export const InvoiceHeader: React.FC<Props> = ({ data }) => (
  <header className="mb-1 -mt-8 pb-2 border-b-2 border-black flex items-center justify-between">
    <div>
      <h1>GSTIN <span className=' font-bold text-lg'>:36AINPJ0953A1ZJ</span></h1>
      <img className='w-28 mt-5' src={Logo} alt="" />
    </div>
    <div className='w-72 text-center'>
      <h1 className=' underline underline-offset-2 text-xl font-bold'>TAX INVOICE</h1>
      <h1 className='font-bold text-2xl text-customRed'>AGASTHYA <span className='text-blue-900 '>ENTERPRISES</span></h1>
      <p className='text-sm  text-gray-600'>Off: 1st Floor, 151, SBH Venture 2,
      LB Nagar, Hyderabad, Ranga Reddy Dist,
      Telangana-500074</p>
    </div>
    <div>
      <h1>Invoice #: <span className=' text-xl  font-bold text-customRed'>{data.invoiceDetails.invoiceNumber}</span></h1>
      <h1>Date: {data.invoiceDetails.date}</h1>
      <h1>Phone: 9949993656</h1>
    </div>
  </header>
);