const path = require("path");

const express = require("express");

const adminData = require("./admin");

const rootDir = require("../util/path");

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.products;

  console.log(products);

  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
