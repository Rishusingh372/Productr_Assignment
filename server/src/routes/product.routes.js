import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
  removeProductImage
} from "../controllers/product.controller.js";

const router = Router();

router.use(requireAuth);

// list
router.get("/", getProducts);

// create (multiple images)
router.post("/", upload.array("images", 8), createProduct);

// read one
router.get("/:id", getProductById);

// update (optional new images)
router.put("/:id", upload.array("images", 8), updateProduct);

// delete
router.delete("/:id", deleteProduct);

// publish/unpublish
router.patch("/:id/publish", publishProduct);
router.patch("/:id/unpublish", unpublishProduct);

// remove single image
router.patch("/:id/remove-image", removeProductImage);

export default router;
