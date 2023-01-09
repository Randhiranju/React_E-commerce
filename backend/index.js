const express = require("express");
//npm i cors (middleware to resolve cors error)
const cors = require("cors");
require("./db/config");
const User = require("./db/User");
const Product= require("./db/Product")
const app = express();

//using middleware to control json data sent from postman or react

app.use(express.json());
app.use(cors()); // middleware used to resolve cors error

//creating route for api and inserting in database
//register route
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  //hiding password note: we can use select for save 
  result=result.toObject();
  delete result.password;
  res.send(result);
});
//login route
app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password"); // doesn't show password
    if (user) {
        res.send(user);
      }
    else {
      res.send({ result: "No user found" });
    }
  } else {
    res.send({ result: "No user found" });
  }
  //async await is used for promise
});

//product route
app.post("/add-product", async(req,res)=>{
  let product= new Product(req.body);
  let result= await product.save();
  res.send(result);
})
// whenever a function runs pormise we use await keyword 
// product list api (note* to send data we use post route , to get data we use get route)
app.get("/products", async(req,res)=>{
  // we use product model same as add product
  let products= await Product.find();
  if(products.length>0){
    res.send(products);
  }else{
    res.send({result:"No products found"});
  }
})

//delete product Api to delete we use delete method
app.delete("/product/:id", async (req,res)=>{
  const result= await Product.deleteOne({_id:req.params.id})
  //product model return promise hence use await
  res.send(result);
})

//api to prefill data of single product whose update link is clicked 

app.get("/product/:id", async(req,res)=>{
  let result=await Product.findOne({_id:req.params.id});
  if(result){
    res.send(result);
  } else{
    res.send({result:"No result Found"});
  }
})

// api to update button 
app.put("/product/:id", async(req,res)=>{
  let result= await Product.updateOne(
    {_id:req.params.id}, //basis of updation
    {
      $set : req.body //for updating we need $set method
    }
  )
  res.send(result);
});

// api to search a product , verifyToken is middleware
app.get("/search/:key", async(req,res)=>{
  let result=await Product.find({
    // or is used whenever we wanna search in more than 1 field
    "$or":[
      {name:{$regex:req.params.key}},
      {company:{$regex:req.params.key}},
      {price:{$regex:req.params.key}},
      {catogery:{$regex:req.params.key}}
    ]
  });
  res.send(result);
})
app.listen(5000);
