//product api
const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
    name:String,
    price:String,
    catogery:String,
    userId:String,
    company:String
});

module.exports= mongoose.model("products",productSchema);
// collection,schema

//import product schema in index.js