import React from 'react';
import { InvoiceData } from '../types/invoice';
import { numberToWords } from "amount-to-words";
interface Props {
  data: InvoiceData;
}

export const InvoiceFooter: React.FC<Props> = ({ data }) => (
  <footer className="">
    <div className="">
      <div className='flex items-center justify-between border-b-2 pb-2  border-black'>
        <div>
          <div className='mb-2 w-96'>
            <h1 className='font-bold'>Amount In Words:</h1>
            <h1 className=' underline font-bold '>{numberToWords(data.total,2)}</h1>
          </div>
          <div>
            <h1 className=' underline underline-offset-2 font-bold'>ACCOUNT DETAILS:</h1>
            <div className='flex'>
              <div>
                <ul>
                  <li>Bank:</li>
                  <li>A/C No:</li>
                  <li>IFSC Code:</li>
                  <li>Branch:</li>
                </ul>
              </div>
              <div className='ml-10'>
                <ul>
                  <li className=' font-bold'>FEDERAL BANK</li>
                  <li className=' font-bold'>16720200005119</li>
                  <li className=' font-bold'>FDRL0001672</li>
                  <li className=' font-bold'>LB NAGAR</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='flex  gap-5'>
            <div>
              <h1>Subtotal:</h1>
              <h1>CGST:({data.cgst})%</h1>
              <h1>SGST :({data.sgst})%</h1>
              <h1 className='mt-4 font-bold'>Total:</h1>
            </div>
            <div className=' text-right'>
              <h1 className=' font-bold'>₹{data.subtotal.toFixed(2)}</h1>
              <h1 className=' font-bold'>₹{data.cgstAmount.toFixed(2)}</h1>
              <h1 className=' font-bold'>₹{data.sgstAmount.toFixed(2)}</h1>
              <h1 className=' mt-4 font-bold'>₹{data.total.toFixed(2)}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-between '>
        <div className='w-[65%]'>
          <h1 className=' underline underline-offset-4'>Terms and Conditions:</h1>
          <ul>
            <li>1• Delivery charges will be always charged extra.</li>
            <li>2• Once material delivered will not be taken back or exchanged.</li>
            <li>3• No Claim will be admitted after delivery.</li>
            <li>4• Subject to Hyderabad Jurisdiction</li>
          </ul>
        <p>Received the above mentioned material in good condition and
        as per order</p>
        </div>
        <div>
          <h1>For <span className='font-bold text-blue-900 text-lg'>AGASTHYA ENTERPRISES</span></h1>
        </div>
      </div>
      <div className='mt-10 flex text-xl text-black justify-between'>
        <h1>Receiver Signature</h1>
        <h1>Authorized Signature</h1>
      </div>
    </div>
  </footer>
);