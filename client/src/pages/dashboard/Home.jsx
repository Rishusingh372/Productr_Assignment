import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ProductCard from "../../components/ProductCard"; // ✅ adjust path if needed

export default function Home() {
  const [tab, setTab] = useState("published"); // published | unpublished
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchByTab = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/products?status=${tab}`);
      setItems(res.data.products || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchByTab();
  }, [tab]);

  const empty = !loading && items.length === 0;

  // Home page me Edit/Delete disable (agar card me buttons hain)
  const noop = () => {};

  const togglePublish = async (p) => {
    try {
      const url =
        p.status === "published"
          ? `/api/products/${p._id}/unpublish`
          : `/api/products/${p._id}/publish`;

      await api.patch(url);
      toast.success(p.status === "published" ? "Unpublished" : "Published");
      fetchByTab();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px-48px)]">
      {/* ✅ Tabs (same like screenshot) */}
      <div className="border-b border-gray-200">
        <div className="flex gap-7 text-[12px] font-medium text-gray-500">
          <button
            onClick={() => setTab("published")}
            className={
              "py-3 relative transition " +
              (tab === "published" ? "text-gray-900" : "hover:text-gray-700")
            }
          >
            Published
            {tab === "published" && (
              <span className="absolute left-0 -bottom-[1px] h-[2px] w-12 bg-[#1d4ed8]" />
            )}
          </button>

          <button
            onClick={() => setTab("unpublished")}
            className={
              "py-3 relative transition " +
              (tab === "unpublished" ? "text-gray-900" : "hover:text-gray-700")
            }
          >
            Unpublished
            {tab === "unpublished" && (
              <span className="absolute left-0 -bottom-[1px] h-[2px] w-14 bg-[#1d4ed8]" />
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="py-16 text-sm text-gray-500">Loading...</div>}

      {/* ✅ Empty State (same center alignment like screenshot) */}
      {empty && (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center">
          {/* icon (4 squares + plus) */}
          <div className="text-[#0b157a]">
            <div className="grid grid-cols-2 gap-2">
              <span className="w-4 h-4 border-2 border-current rounded-sm" />
              <span className="w-4 h-4 border-2 border-current rounded-sm" />
              <span className="w-4 h-4 border-2 border-current rounded-sm" />
              <div className="w-4 h-4 relative">
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-current rounded" />
                <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-current rounded" />
              </div>
            </div>
          </div>

          <h3 className="mt-6 text-[14px] font-semibold text-gray-800">
            {tab === "published" ? "No Published Products" : "No Unpublished Products"}
          </h3>

          <p className="mt-2 text-[11px] text-gray-400 text-center leading-5 whitespace-pre-line">
            {tab === "published"
              ? "Your Published Products will appear here\nCreate your first product to publish"
              : "Your Unpublished Products will appear here\nCreate your first product to unpublish"}
          </p>
        </div>
      )}

      {/* ✅ Products grid (if items exist) */}
      {!loading && items.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <ProductCard
              key={p._id}
              item={p}
              onEdit={noop}
              onDelete={noop}
              onToggle={togglePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
}
