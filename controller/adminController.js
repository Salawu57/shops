const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", { pageTitle: "Add-Product" ,path: "/admin/add-product",editing:false});
    // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  };
  
  exports.addProduct = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
     return res.redirect('/')
    }
    const prodId = req.params.productId;

  Product.findById(prodId)
  .then(([result]) => {
    res.render("admin/edit-product", {
      product:result[0],
      pageTitle: "Edit-Product",
      path: "/admin/edit-product",
      editing:editMode
    });
  })
  .catch(err => console.log(err));

  };

  exports.postEditProduct = (req, res, next) =>{

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);

    updatedProduct.updateProduct()
    .then(res.redirect('/admin/products')).catch(err => console.log(err));

  };
  
  exports.getProducts = (req, res, next) =>{

  Product.fetchAll()
  .then(result =>{
    res.render("admin/products", {
      prods: result[0],
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  })
  .catch(err => console.log(err));
    
  }

  exports.postDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId;

    Product.deleteById(prodId)
    .then(result => {
      console.log( result)
      res.redirect('/admin/products');
     })
    .catch(err => console.log(err))
   
  }

