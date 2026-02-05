import React from "react";

export default function Input({ label, className="", ...props }) {
  return (
    <label className="block">
      {label && <div className="text-xs font-medium mb-1 text-gray-700">{label}</div>}
      <input
        {...props}
        className={
          "w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-600/30 " +
          className
        }
      />
    </label>
  );
}
