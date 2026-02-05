// ✅ Products.jsx (Same-to-same styling like your Figma screenshot)
// - Top "Products" title + "+ Add Products" right side
// - Empty state centered with 4-squares + plus icon + button
// - Products grid same spacing

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import ProductCard from "../../components/ProductCard";
import ProductFormModal from "../../components/ProductFormModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import Button from "../../components/ui/Button";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("add"); // add/edit
  const [active, setActive] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/products?status=all");
      setItems(res.data.products || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const empty = !loading && items.length === 0;

  const createProduct = async ({ form, newImages }) => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      newImages.forEach((f) => fd.append("images", f));

      await api.post("/api/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added Successfully");
      setOpenForm(false);
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Create failed");
    }
  };

  const updateProduct = async ({ form, newImages, keepImages }) => {
    try {
      const initialImages = active?.images || [];
      const removed = initialImages.filter((img) => !keepImages.includes(img));

      for (const img of removed) {
        await api.patch(`/api/products/${active._id}/remove-image`, { imageUrl: img });
      }

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      newImages.forEach((f) => fd.append("images", f));

      await api.put(`/api/products/${active._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated");
      setOpenForm(false);
      setActive(null);
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  const togglePublish = async (p) => {
    try {
      const url =
        p.status === "published"
          ? `/api/products/${p._id}/unpublish`
          : `/api/products/${p._id}/publish`;

      await api.patch(url);
      toast.success(p.status === "published" ? "Unpublished" : "Published");
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Action failed");
    }
  };

  const onEdit = (p) => {
    setMode("edit");
    setActive(p);
    setOpenForm(true);
  };

  const onDelete = (p) => {
    setActive(p);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/products/${active._id}`);
      toast.success("Product deleted");
      setOpenDelete(false);
      setActive(null);
      fetchAll();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px-48px)]">
      {/* ✅ Header row like screenshot */}
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-semibold text-gray-800">Products</div>

        <button
          onClick={() => {
            setMode("add");
            setActive(null);
            setOpenForm(true);
          }}
          className="text-[13px] font-semibold text-gray-500 hover:text-gray-700 transition"
        >
          + Add Products
        </button>
      </div>

      {loading && <div className="py-16 text-sm text-gray-500">Loading...</div>}

      {/* ✅ Empty state same-to-same */}
      {empty && (
        <div className="w-full h-[72vh] flex flex-col items-center justify-center text-center">
          {/* Icon (4 squares + plus) */}
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

          <div className="mt-6 text-[14px] font-semibold text-gray-800">
            Feels a little empty over here...
          </div>

          <div className="mt-2 text-[11px] text-gray-400 leading-5">
            You can create products without connecting store <br />
            you can add products to store anytime
          </div>

          <Button
            onClick={() => {
              setMode("add");
              setOpenForm(true);
            }}
            className="mt-6 bg-[#0b157a] text-white hover:bg-[#0a136a] w-[210px] h-10 rounded-md"
          >
            Add your Products
          </Button>
        </div>
      )}

      {/* ✅ Grid same spacing */}
      {!empty && !loading && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <ProductCard
              key={p._id}
              item={p}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={togglePublish}
            />
          ))}
        </div>
      )}

      <ProductFormModal
        open={openForm}
        mode={mode}
        initial={active}
        onClose={() => setOpenForm(false)}
        onSubmit={mode === "add" ? createProduct : updateProduct}
      />

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        name={active?.productName || ""}
      />
    </div>
  );
}
