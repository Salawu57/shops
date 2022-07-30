const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", { pageTitle: "Add-Product" ,path: "/admin/add-product",activeShop: true,productCSS: true,});
    // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  };
  
  exports.addProduct = (req, res, next) => {
    console.log(req.body);
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
  };

  exports.getProducts = (req, res, next) =>{

    const products = Product.fetchAll((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/product",
          activeShop: true,
          productCSS: true,
        });
      });
  }

