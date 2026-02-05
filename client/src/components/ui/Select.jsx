import React from "react";

export default function Select({ label, children, className="", ...props }) {
  return (
    <label className="block">
      {label && <div className="text-xs font-medium mb-1 text-gray-700">{label}</div>}
      <select
        {...props}
        className={
          "w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-600/30 " +
          className
        }
      >
        {children}
      </select>
    </label>
  );
}
