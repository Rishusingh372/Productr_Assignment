import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    productType: { type: String, required: true, trim: true }, // dropdown
    quantityStock: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    brandName: { type: String, required: true, trim: true },

    images: { type: [String], required: true }, // file urls
    isReturnable: { type: Boolean, required: true },

    status: { type: String, enum: ["published", "unpublished"], default: "unpublished" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
