import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

const requiredFields = (body) => {
  const keys = [
    "productName",
    "productType",
    "quantityStock",
    "mrp",
    "sellingPrice",
    "brandName",
    "isReturnable"
  ];

  for (const k of keys) {
    if (body[k] === undefined || body[k] === null || String(body[k]).trim() === "") {
      return `${k} is required`;
    }
  }
  return null;
};

// POST /api/products (multipart) (protected)
export const createProduct = asyncHandler(async (req, res) => {
  const err = requiredFields(req.body);
  if (err) {
    res.status(400);
    throw new Error(err);
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("At least 1 product image is required");
  }

  const images = req.files.map((f) => `/uploads/${f.filename}`);

  const product = await Product.create({
    productName: req.body.productName,
    productType: req.body.productType,
    quantityStock: Number(req.body.quantityStock),
    mrp: Number(req.body.mrp),
    sellingPrice: Number(req.body.sellingPrice),
    brandName: req.body.brandName,
    images,
    isReturnable: String(req.body.isReturnable).toLowerCase() === "true" || req.body.isReturnable === "Yes",
    status: "unpublished",
    createdBy: req.user.id
  });

  res.status(201).json({ message: "Product created", product });
});

// GET /api/products?status=published|unpublished|all (protected)
export const getProducts = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = { createdBy: req.user.id };
  if (status && status !== "all") filter.status = status;

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ products });
});

// GET /api/products/:id (protected)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ product });
});

// PUT /api/products/:id (multipart optional images) (protected)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const err = requiredFields(req.body);
  if (err) {
    res.status(400);
    throw new Error(err);
  }

  product.productName = req.body.productName;
  product.productType = req.body.productType;
  product.quantityStock = Number(req.body.quantityStock);
  product.mrp = Number(req.body.mrp);
  product.sellingPrice = Number(req.body.sellingPrice);
  product.brandName = req.body.brandName;
  product.isReturnable =
    String(req.body.isReturnable).toLowerCase() === "true" || req.body.isReturnable === "Yes";

  // If new images added, append
  if (req.files && req.files.length > 0) {
    const newImgs = req.files.map((f) => `/uploads/${f.filename}`);
    product.images = [...product.images, ...newImgs];
  }

  await product.save();
  res.json({ message: "Product updated", product });
});

// DELETE /api/products/:id (protected)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.deleteOne({ _id: product._id });
  res.json({ message: "Product deleted" });
});

// PATCH /api/products/:id/publish (protected)
export const publishProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.status = "published";
  await product.save();
  res.json({ message: "Published", product });
});

// PATCH /api/products/:id/unpublish (protected)
export const unpublishProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.status = "unpublished";
  await product.save();
  res.json({ message: "Unpublished", product });
});

// PATCH /api/products/:id/remove-image (protected)
// body: { imageUrl: "/uploads/abc.png" }
export const removeProductImage = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;

  const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.images = product.images.filter((img) => img !== imageUrl);

  if (product.images.length === 0) {
    res.status(400);
    throw new Error("At least 1 image is required");
  }

  await product.save();
  res.json({ message: "Image removed", product });
});
