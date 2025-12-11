import React from "react";
import { Item } from "../types/invoice";

interface Props {
  items: Item[];
  startIndex?: number;
  showHeader?: boolean;
  innerRef?: React.Ref<HTMLTableSectionElement>; // 🔥 added for dynamic pagination
}

export const InvoiceTable: React.FC<Props> = ({
  items,
  startIndex = 0,
  showHeader = true,
  innerRef
}) => (
  <table className="w-full border-collapse mb-2 text-[13px]">
    
    {/* HEADER */}
    {showHeader && (
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-1 text-center align-middle">S.No</th>
          <th className="border p-1 text-center align-middle">Description</th>
          <th className="border p-1 text-center align-middle">HSN Code</th>
          <th className="border p-1 text-center align-middle">Qty</th>
          <th className="border p-1 text-center align-middle">Unit Price</th>
          <th className="border p-1 text-center align-middle">GST %</th>
          <th className="border p-1 text-center align-middle">GST Amt</th>
          <th className="border p-1 text-center align-middle">Amount</th>
        </tr>
      </thead>
    )}

    {/* BODY */}
    <tbody ref={innerRef}> {/* 🔥 rows now measurable */}
      {items.map((item, index) => (
        <tr
          key={startIndex + index}
          className="h-[32px] align-middle"
        >
          <td className="border p-1 text-center align-middle">
            {startIndex + index + 1}
          </td>

          <td className="border p-1 text-center align-middle">
            {item.description}
          </td>

          <td className="border p-1 text-center align-middle">
            {item.hsnCode}
          </td>

          <td className="border p-1 text-center align-middle">
            {item.quantity}
          </td>

          {/* RATE */}
          <td className="border p-1 text-center align-middle">
            ₹{parseFloat(item.rate || "0").toFixed(2)}
          </td>

          {/* GST % */}
          <td className="border p-1 text-center align-middle">
            {item.gstPercent || "0"}%
          </td>

          {/* GST Amount */}
          <td className="border p-1 text-center align-middle">
            ₹{item.gstAmount?.toFixed(2) || "0.00"}
          </td>

          {/* FINAL AMOUNT */}
          <td className="border p-1 text-center align-middle font-medium">
            ₹{item.amount}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
