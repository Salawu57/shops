const path = require("path");
const rootDir = require("../util/path");
const Product = require("../models/product");
const fs = require("fs");
const csv = require('fast-csv');
const pdfMake = require('../pdfmaker/pdfmake');
const vfsFonts = require('../pdfmaker/vfs_fonts');



pdfMake.vfs = vfsFonts.pdfMake;



const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "membership.csv"
);

const p2 = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "mem.json"
);

const convertToJson = () => {

}

let data = [];

const addValue =  object =>  {

  if (object) {
    if (data.filter(x => x.MEM_NO === object.MEM_NO).length === 0) {
      data.push(object);
    }
  }
}


// a promise
const readCsvFileAwait = new Promise(function (resolve, reject) {

  fs.createReadStream(p).pipe(csv.parse({ headers: true }))
  .on('error', error => reject(error))
  .on('data', row => {    
    data.push(row);  
  })
  .on('end', () => {

   resolve(data);
  
  });
 
});


const readJsonFileAwait = new Promise(function(resolve, reject){

  fs.readFile(p2, (err, fileContent) => {

    if (err) {
      reject(err);
    }
     resolve(JSON.parse(fileContent));
  });

})


const readFileAwait = async () => {

  let result = await readCsvFileAwait; 

  fs.writeFile(p2, JSON.stringify(result), (err) => {
    console.log(err);
  });

    console.log(result);
  
}

exports.getAllProduct = (req, res, next) => {

  Product.findAll()
  .then(products =>{
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  })
  .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) =>{
  const prodId = req.params.productId

  Product.findByPk(prodId)
  .then(product => {
    res.render(
      'shop/product-detail',
       {
         product: product,
         pageTitle:product.title,
          path:"/products"
       });
  }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products =>{
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop/index",
      path: "/",
    });
  })
  .catch(err => console.log(err));
};

exports.getCart = async (req, res, next) =>{

  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products => {

      res.render('shop/cart',{
             path:'/cart',
             pageTitle:'Your Cart',
             products: products
    });

  }).catch(err => console.log(err))

});

  
}


exports.getMember = async (req, res, next) =>{

  const members = await readJsonFileAwait;

 res.render('admin/membership',{
    mems: members,
   path:'/member',
   pageTitle:'member'
 });
}

exports.postCart = (req, res, next) =>{

  const prodId = req.body.productId;
  let fetchedCart
  let newQuantity = 1;

  req.user.getCart().
  then(cart => {
    fetchedCart = cart;
   return cart.getProducts({where:{id: prodId}})
  })
  .then(products =>{
    let product;
    if(products.length > 0){
      product = products[0];
    }
   
    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1
      return product
    }
    return Product.findByPk(prodId)
  })
  .then(product =>{
    return fetchedCart.addProduct(product,{through:{quantity: newQuantity}
    });
  })
  .then(() => {
    res.redirect('/cart');
  }).catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) =>{
const prodId = req.body.productId;
req.user.getCart()
.then(cart => {
  return cart.getProducts({where: {id:prodId}});
})
.then(products =>{
  const product = products[0];
  return product.cartItem.destroy();
}).then(result =>{
  res.redirect('/cart');
})
.catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
let fetchedCart;
req.user.getCart()
.then(cart => {
  fetchedCart = cart;
  return cart.getProducts();
}).then(products => {
  return req.user.createOrder()
  .then(order => {
    return order.addProducts(products.map(product =>{
      product.orderItem = {quantity: product.cartItem.quantity};
      return product
    }));
  }).catch(err => console.log(err))
}).then(result =>{
  return fetchedCart.setProducts(null);
}).then(result =>{
  res.redirect('/orders');
}).catch(err => console.log(err));
};

exports.getOrders = async (req, res, next) =>{

  req.user.getOrders({include:["products"]})
  .then(orders =>{
    res.render('shop/orders',{
      path:'/orders',
      pageTitle:'Your Orders',
      orders:orders
    });
  })
  
}


