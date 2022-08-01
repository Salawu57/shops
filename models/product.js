const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFIle = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.id = (Math.floor(Math.random()*90000) + 10000).toString();
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price
  }




  save() {

    getProductsFromFIle((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
     
  }

  static fetchAll(cb) {
    getProductsFromFIle(cb);
  }

  static findById(id, cb){
    getProductsFromFIle(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
