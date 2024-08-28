const express = require('express');
const app = express();
const Listing =require("./models/listing")
const path=require('path');
// getting-started.js
const mongoose = require('mongoose');
const methodOverride = require('method-override');

main().then(()=>console.log("connection succesfull")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/rentnest');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extends:true}));
app.use(methodOverride('_method'))
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000);
//index.ejs route
app.get("/Listing",async (req,res)=>{
  
    let allListings=await Listing.find({});
    /* console.log(allListings);
    await Listing.countDocuments({}).then((resl)=>console.log(resl))
   .catch((err)=>console.log(err))  */
    res.render("listings/index.ejs",{allListings});
   
})

app.get("/Listing/:id",async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
})

//create new route
app.get("/Listing/new/route",(req,res)=>{
  res.render("listings/createListing.ejs");
})

//adding new list
app.post("/addListing",(req,res)=>{
  /* let {title,description,image,price,loaction,country}=req.body; */
  let info=req.body;
  const newlisting= new Listing(info);
  newlisting.save().then((res)=>console.log(res)).catch((err)=>console.log(err));
  res.redirect("/Listing")
})

//get update requset
app.get("/Listing/:id/edit",async (req,res)=>{
  const { id }=req.params;
  const listing=await Listing.findById(id);
  console.log(listing);
  res.render("listings/edit.ejs",{listing});

})

//get update data
app.put("/Listing/:id", async(req,res)=>{
  const {id} =req.params;
  console.log(req.body)
  const {data}=req.body;
  const listing=await Listing.findOneAndUpdate(id, {data},{new:true});
  console.log(listing);
  res.redirect("/Listing/:id");
})