const express = require("express");

const adminController = require("../controller/adminController");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", adminController.addProduct);

router.get('/products', adminController.getProducts)

module.exports = router;
