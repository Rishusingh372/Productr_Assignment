// ✅ ProductCard.jsx (Figma-like card + mini image carousel on hover)
// - Same layout: image frame, dots, details grid, buttons row
// - Hover on image area => auto-carousel if multiple images
// - No extra libraries needed

import React, { useEffect, useMemo, useState } from "react";
import Button from "./ui/Button";

export default function ProductCard({ item, onEdit, onDelete, onToggle }) {
  const base = import.meta.env.VITE_API_BASE || "";
  const images = useMemo(
    () => (item?.images?.length ? item.images.map((u) => `${base}${u}`) : []),
    [item?.images, base]
  );

  const isPublished = item.status === "published";

  const [activeIdx, setActiveIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Auto carousel on hover
  useEffect(() => {
    if (!hovered) return;
    if (images.length <= 1) return;

    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 900);

    return () => clearInterval(id);
  }, [hovered, images.length]);

  // Reset on item change / hover end
  useEffect(() => {
    setActiveIdx(0);
  }, [item?._id]);

  const goDot = (idx) => setActiveIdx(idx);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Image frame (like figma) */}
      <div
        className="p-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative h-[170px] rounded-xl border border-gray-200 bg-[#f8fafc] overflow-hidden">
          {/* Image */}
          {images.length > 0 ? (
            <img
              key={images[activeIdx]} // force transition re-render
              src={images[activeIdx]}
              alt={item.productName}
              className="w-full h-full object-contain p-3 transition-opacity duration-300"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-xs text-gray-400">
              No Image
            </div>
          )}

          {/* Status dot badge (small) */}
          <span
            className={
              "absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold " +
              (isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")
            }
          >
            {isPublished ? "Published" : "Unpublished"}
          </span>

          {/* Carousel dots (bottom center) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goDot(i)}
                  className={
                    "h-1.5 w-1.5 rounded-full transition " +
                    (i === activeIdx ? "bg-[#ff6b3d]" : "bg-gray-300")
                  }
                  title={`image ${i + 1}`}
                />
              ))}
              {images.length > 5 && (
                <span className="text-[10px] text-gray-400 ml-1">+{images.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title + details */}
      <div className="px-4 pb-4">
        <div className="font-semibold text-[13px] text-gray-800 truncate">
          {item.productName}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-y-1 text-[11px] text-gray-500">
          <div>Product type -</div>
          <div className="text-right text-gray-700">{item.productType}</div>

          <div>Quantity Stock -</div>
          <div className="text-right text-gray-700">{item.quantityStock}</div>

          <div>MRP-</div>
          <div className="text-right text-gray-700">₹ {item.mrp}</div>

          <div>Selling Price -</div>
          <div className="text-right text-gray-900 font-semibold">₹ {item.sellingPrice}</div>

          <div>Brand Name -</div>
          <div className="text-right text-gray-700">{item.brandName}</div>

          <div>Total Number of images -</div>
          <div className="text-right text-gray-700">{item.images?.length || 0}</div>

          <div>Exchange Eligibility -</div>
          <div className="text-right text-gray-700">
            {item.isReturnable ? "YES" : "NO"}
          </div>
        </div>

        {/* Actions row (same like figma) */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            onClick={() => onToggle(item)}
            className={
              "flex-1 h-9 rounded-lg text-white text-[12px] font-semibold " +
              (isPublished
                ? "bg-green-500 hover:bg-green-600"
                : "bg-[#0b157a] hover:bg-[#0a136a]")
            }
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>

          <button
            onClick={() => onEdit(item)}
            className="h-9 flex-1 rounded-lg border border-gray-300 text-[12px] font-semibold text-gray-700 bg-white hover:bg-gray-50"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(item)}
            className="h-9 w-9 rounded-lg border border-gray-300 grid place-items-center bg-white hover:bg-gray-50 text-gray-600"
            title="delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
