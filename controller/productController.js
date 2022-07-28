const path = require("path");
const rootDir = require("../util/path");
const Product = require('../models/product');

exports.getProduct = (req, res, next) => {
    res.render('add-product',{ pageTitle:'Add-Product'})
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  }

exports.addProduct = (req, res, next) => {
    console.log(req.body);
    const product = new Product(req.body.title);
     product.save();
    res.redirect('/');
}

exports.getAllProduct = (req, res, next) => {
   
  const products = Product.fetchAll((products) =>{

    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      activeShop: true,
      productCSS: true,
    });

  });
  
    
  }