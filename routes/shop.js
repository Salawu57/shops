const path = require("path");

const express = require("express");

const adminData = require("./admin");

const rootDir = require("../util/path");

const productController = require("../controller/productController");

const router = express.Router();

router.get("/", productController.getAllProduct);

module.exports = router;
