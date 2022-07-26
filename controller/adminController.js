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
    req.user.createProduct(
      {
      title: title,
      price:price,
      imageUrl:imageUrl,
      description:description
      }
    )
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))

  };

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
     return res.redirect('/')
    }
    const prodId = req.params.productId;
  req.user.getProducts({where:{id:prodId}})
  .then(products => {
    res.render("admin/edit-product", {
      product:products[0],
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
    
     Product.findByPk(prodId)
     .then(product => {
       product.title = updatedTitle;
       product.price = updatedPrice;
       product.description = updatedDesc;
       product.imageUrl = updatedImageUrl;
       return product.save();
     })
    .then(result => res.redirect('/admin/products')).catch(err => console.log(err));
  };
  
  exports.getProducts = (req, res, next) =>{

 req.user.getProducts()
  .then(products =>{
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  })
  .catch(err => console.log(err));
  }

  
  exports.postDeleteProduct = (req, res, next) =>{
    const prodId = req.body.productId;

    Product.findByPk(prodId)
    .then(product =>{
      product.destroy();
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

    // Product.destroy()
    // .then(result => {
    //   console.log( result)
    //   res.redirect('/admin/products');
    //  })
    // .catch(err => console.log(err))
   
  }

