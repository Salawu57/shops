const path = require("path");
const rootDir = require("../util/path");
const Product = require("../models/product");



exports.getAllProduct = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      activeShop: true,
      productCSS: true,
    });
  });
};


exports.getIndex = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop/index",
      path: "/",
    });
  });
};


exports.getCart = (req, res, next) =>{
  res.render('shop/cart',{
    path:'/cart',
    pageTitle:'Your Cart'
  });
}

exports.getCheckout = (req, res, next) =>{
  res.render('shop/checkout',{
    path:'/checkout',
    pageTitle:'Checkout'
  })
}