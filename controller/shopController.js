const path = require("path");
const rootDir = require("../util/path");
const Product = require("../models/product");
const fs = require("fs");
const csv = require('fast-csv');
const pdfMake = require('../pdfmaker/pdfmake');
const vfsFonts = require('../pdfmaker/vfs_fonts');
const Cart = require("../models/cart");


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

  Product.fetchAll()
  .then(result =>{
    res.render("shop/product-list", {
      prods: result[0],
      pageTitle: "All Products",
      path: "/products",
    });
  })
  .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) =>{
  const prodId = req.params.productId

  Product.findById(prodId)
  .then(([result]) => {
    res.render(
      'shop/product-detail',
       {
         product: result[0],
         pageTitle:result[0].title,
          path:"/products"
       });
  }).catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(result =>{
    res.render("shop/index", {
      prods: result[0],
      pageTitle: "Shop/index",
      path: "/",
    });
  })
  .catch(err => console.log(err));
};

exports.getCart = async (req, res, next) =>{

  Cart.getCart(cart => {

    Product.fetchAll(products => {
      const cartProducts =[];
      for(product of products){
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if(cart.products.find(prod => prod.id === product.id)){
         cartProducts.push({productData: product, qty: cartProductData.qty})
        }
      }

    res.render('shop/cart',{
     path:'/cart',
     pageTitle:'Your Cart',
     products: cartProducts
   });
    
  });

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

  Product.findById(prodId, product => {
    
    Cart.addProduct(prodId, product.price);

  })

  res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) =>{
const prodId = req.body.productId;
Product.findById(prodId, product =>{
  Cart.deleteProduct(prodId, product.price);
  res.redirect('/cart');
});
};

exports.getOrders = async (req, res, next) =>{

  res.render('shop/orders',{
  
    path:'/orders',
    pageTitle:'Your Orders'
  });
}

exports.getCheckout = (req, res, next) =>{
  res.render('shop/checkout',{
    path:'/checkout',
    pageTitle:'Checkout'
  })
}
