const path = require("path");
const rootDir = require("../util/path");

const products = [];

exports.getProduct = (req, res, next) => {
    res.render('add-product',{ pageTitle:'Add-Product'})
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  }

exports.addProduct = (req, res, next) => {
    console.log(req.body);
    products.push({title:req.body.title});
    res.redirect('/');
}

exports.getAllProduct = (req, res, next) => {
   
    console.log(products);
  
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      activeShop: true,
      productCSS: true,
    });
  }