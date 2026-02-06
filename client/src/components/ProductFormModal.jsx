import React, { useEffect, useMemo, useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";

const types = ["Foods", "Clothes", "Electronics", "Beauty", "Other"];

export default function ProductFormModal({
  open,
  mode = "add",
  initial,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    productName: "",
    productType: "",
    quantityStock: "",
    mrp: "",
    sellingPrice: "",
    brandName: "",
    isReturnable: "Yes",
  });

  const [newImages, setNewImages] = useState([]);
  const [keepImages, setKeepImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    setErrors({});
    if (isEdit && initial) {
      setForm({
        productName: initial.productName || "",
        productType: initial.productType || "",
        quantityStock: String(initial.quantityStock ?? ""),
        mrp: String(initial.mrp ?? ""),
        sellingPrice: String(initial.sellingPrice ?? ""),
        brandName: initial.brandName || "",
        isReturnable: initial.isReturnable ? "Yes" : "No",
      });
      setKeepImages(initial.images || []);
      setNewImages([]);
    } else {
      setForm({
        productName: "",
        productType: "",
        quantityStock: "",
        mrp: "",
        sellingPrice: "",
        brandName: "",
        isReturnable: "Yes",
      });
      setKeepImages([]);
      setNewImages([]);
    }
  }, [open, isEdit, initial]);

  const previews = useMemo(
    () => newImages.map((f) => URL.createObjectURL(f)),
    [newImages]
  );

  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImages]);

  const validate = () => {
    const e = {};
    const required = [
      "productName",
      "productType",
      "quantityStock",
      "mrp",
      "sellingPrice",
      "brandName",
    ];
    required.forEach((k) => {
      if (!String(form[k]).trim()) e[k] = "Required";
    });

    const total = (keepImages?.length || 0) + (newImages?.length || 0);
    if (total === 0) e.images = "At least 1 image required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFiles = (files) => {
    const arr = Array.from(files || []);
    if (arr.length === 0) return;
    setNewImages((prev) => [...prev, ...arr]);
    setErrors((p) => ({ ...p, images: "" }));
  };

  const removeNew = (idx) => setNewImages((prev) => prev.filter((_, i) => i !== idx));
  const removeKeep = (idx) => setKeepImages((prev) => prev.filter((_, i) => i !== idx));

  const submit = () => {
    if (!validate()) return;
    onSubmit({ form, newImages, keepImages });
  };

  const totalImages = (keepImages?.length || 0) + (newImages?.length || 0);

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Product" : "Add Product"}
      onClose={onClose}
      width="max-w-[620px]"
    >
      {/* ✅ This wrapper fixes deploy issue: scroll inside modal */}
      <div className="max-h-[80vh] overflow-y-auto pr-1">
        <div className="space-y-5 pb-24">
          {/* ✅ Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Input
                label="Product Name"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="h-10 rounded-lg"
              />
              {errors.productName && (
                <p className="text-[11px] text-red-500 mt-1">{errors.productName}</p>
              )}
            </div>

            <div>
              <Select
                label="Product Type"
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
                className="h-10 rounded-lg"
              >
                <option value="">Select product type</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
              {errors.productType && (
                <p className="text-[11px] text-red-500 mt-1">{errors.productType}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Quantity Stock"
                  type="number"
                  value={form.quantityStock}
                  onChange={(e) => setForm({ ...form, quantityStock: e.target.value })}
                  className="h-10 rounded-lg"
                />
                {errors.quantityStock && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.quantityStock}</p>
                )}
              </div>

              <div>
                <Input
                  label="MRP"
                  type="number"
                  value={form.mrp}
                  onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  className="h-10 rounded-lg"
                />
                {errors.mrp && <p className="text-[11px] text-red-500 mt-1">{errors.mrp}</p>}
              </div>

              <div>
                <Input
                  label="Selling Price"
                  type="number"
                  value={form.sellingPrice}
                  onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                  className="h-10 rounded-lg"
                />
                {errors.sellingPrice && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.sellingPrice}</p>
                )}
              </div>

              <div>
                <Input
                  label="Brand Name"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  className="h-10 rounded-lg"
                />
                {errors.brandName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.brandName}</p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Upload */}
          <div>
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-medium text-gray-700">
                Upload Product Images
              </div>

              <label className="text-[12px] font-semibold text-[#0b157a] cursor-pointer hover:opacity-80">
                {isEdit ? "Add More Photos" : "Browse"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
            </div>

            <div
              className={
                "mt-2 rounded-xl border border-dashed p-3 " +
                (errors.images ? "border-red-400" : "border-gray-200")
              }
            >
              {totalImages === 0 ? (
                <label className="block cursor-pointer">
                  <div className="py-6 text-center">
                    <div className="text-[12px] text-gray-500">
                      Drag & drop images here, or{" "}
                      <span className="text-[#0b157a] font-semibold">Browse</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      PNG, JPG up to ~5MB each
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keepImages.map((url, idx) => (
                    <div
                      key={url}
                      className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-white"
                    >
                      <img
                        src={`${import.meta.env.VITE_API_BASE}${url}`}
                        alt="existing"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeKeep(idx)}
                        className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-white/90 text-[11px] shadow hover:bg-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {previews.map((src, idx) => (
                    <div
                      key={src}
                      className="relative w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-white"
                    >
                      <img src={src} alt="new" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNew(idx)}
                        className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-white/90 text-[11px] shadow hover:bg-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.images && (
              <p className="text-[11px] text-red-500 mt-1">{errors.images}</p>
            )}
          </div>

          {/* ✅ Returnable */}
          <div>
            <Select
              label="Exchange or return eligibility"
              value={form.isReturnable}
              onChange={(e) => setForm({ ...form, isReturnable: e.target.value })}
              className="h-10 rounded-lg"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
        </div>
      </div>

      {/* ✅ Sticky footer (always visible, deploy safe) */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 pt-3 pb-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-[13px] border border-gray-200 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <Button
            onClick={submit}
            className="h-10 px-6 rounded-lg bg-[#0b157a] text-white hover:bg-[#0a136a]"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
