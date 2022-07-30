const path = require("path");

const express = require("express");

const adminData = require("./admin");

const rootDir = require("../util/path");

const shopController = require("../controller/shopController");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get('/products', shopController.getAllProduct);

router.get('/cart', shopController.getCart);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
