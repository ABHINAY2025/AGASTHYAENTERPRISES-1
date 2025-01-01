import React from 'react';
import { InvoiceData } from '../types/invoice';
import { ToWords } from 'to-words';
interface Props {
  data: InvoiceData;
}
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});

export const InvoiceFooter: React.FC<Props> = ({ data }) => (
  <footer className="mt-12">
    <div className="">
      <div className='flex items-center justify-between border-b-2 pb-2  border-black'>
        <div>
          <div className='mb-2 w-96'>
            <h1 className='font-bold'>Amount In Words:</h1>
            <h1 className=' underline font-bold '>{toWords.convert(data.total).toUpperCase()}</h1>
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
              <h1>SGST:({data.sgst})%</h1>
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
    </div>
  </footer>
);