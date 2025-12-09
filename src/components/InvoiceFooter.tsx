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

export const InvoiceFooter: React.FC<Props> = ({ data }) => {

  /* ✅ Calculate accurate GST % from totals */
  const gstTotal = data.cgstAmount + data.sgstAmount;

  const gstPercent =
    data.subtotal > 0
      ? (gstTotal / data.subtotal) * 100
      : 0;

  const cgstPercent = gstPercent / 2;
  const sgstPercent = gstPercent / 2;

  
  return (
    <footer className="mt-12">

      <div className="flex items-center justify-between border-b-2 pb-2 border-black">

        {/* ========== LEFT SECTION ========== */}
        <div>
          <div className="mb-2 w-96">
            <h1 className="font-bold">Amount In Words:</h1>
            <h1 className="underline font-bold">
              {toWords.convert(data.total).toUpperCase()}
            </h1>
          </div>

          <div>
            <h1 className="underline underline-offset-2 font-bold">
              ACCOUNT DETAILS:
            </h1>

            <div className="flex">
              <div>
                <ul>
                  <li>Bank:</li>
                  <li>A/C No:</li>
                  <li>IFSC Code:</li>
                  <li>Branch:</li>
                </ul>
              </div>

              <div className="ml-10 font-bold">
                <ul>
                  <li>INDIAN OVERSEAS BANK</li>
                  <li>327502000000422</li>
                  <li>IOBA0003275</li>
                  <li>L.B NAGAR</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RIGHT TOTALS ========== */}
        <div>

          <div className="flex gap-5">

            <div>
              <h1>Subtotal:</h1>
              <h1>CGST:</h1>
              <h1>SGST:</h1>
              <h1 className="mt-4 font-bold">Total:</h1>
            </div>

            <div className="text-right font-bold">
              <h1>₹{data.subtotal.toFixed(2)}</h1>
              <h1>₹{data.cgstAmount.toFixed(2)}</h1>
              <h1>₹{data.sgstAmount.toFixed(2)}</h1>
              <h1 className="mt-4">
                ₹{data.total.toFixed(2)}
              </h1>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};
