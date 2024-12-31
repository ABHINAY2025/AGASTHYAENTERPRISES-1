import React from 'react';
import { Item } from '../types/invoice';

interface Props {
  items: Item[];
  startIndex: number;
  showHeader?: boolean;
}

export const InvoiceTable: React.FC<Props> = ({ items, startIndex, showHeader = true }) => (
  <table className="w-full border-collapse mb-2">
    {showHeader && (
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-1">Sr No.</th>
          <th className="border p-1">Description</th>
          <th className="border p-1">HSN Code</th>
          <th className="border p-1">Quantity</th>
          <th className="border p-1">Price</th>
          <th className="border p-1">Amount</th>
        </tr>
      </thead>
    )}
    <tbody>
      {items.map((item, index) => (
        <tr key={startIndex + index}>
          <td className="border p-1 text-center">{startIndex + index + 1}</td>
          <td className="border p-1">{item.description}</td>
          <td className="border p-1 text-center">{item.hsnCode}</td>
          <td className="border p-1 text-center">{item.quantity}</td>
          <td className="border p-1 text-right">{item.rate}</td>
          <td className="border p-1 text-right">{item.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
);