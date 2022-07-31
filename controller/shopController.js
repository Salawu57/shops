const path = require("path");
const rootDir = require("../util/path");
const Product = require("../models/product");
const fs = require("fs");
const csv = require('fast-csv');


const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "membership.csv"
);


const p2 = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "membership.json"
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
  const products = Product.fetchAll((products) => {
    
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
      
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

exports.getCart = async (req, res, next) =>{

  // const members = await readJsonFileAwait;

  res.render('shop/cart',{
    // mems: members,
    path:'/cart',
    pageTitle:'Your Cart'
  });
}

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
