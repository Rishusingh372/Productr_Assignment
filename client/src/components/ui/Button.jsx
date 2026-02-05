import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        "px-4 py-2 rounded-md font-medium transition active:scale-[0.98] " +
        className
      }
    >
      {children}
    </button>
  );
}
