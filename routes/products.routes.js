const express = require("express");
const productModel = require("../models/product.model");
const upload = require("../config/multer.config");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);

router.post("/create-product", upload.any(), productController.createProduct);

module.exports = router;

//router.use function in Express is used to apply middleware functions
