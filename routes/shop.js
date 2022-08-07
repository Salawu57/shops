const path = require("path");

const express = require("express");

const adminData = require("./admin");

const rootDir = require("../util/path");

const shopController = require("../controller/shopController");
const { route } = require("./admin");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get('/products', shopController.getAllProduct);

router.get("/products/:productId", shopController.getProduct);

// router.post("/toPdf", shopController.toPdf);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
