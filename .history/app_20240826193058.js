const express = require('express');
const app = express();
const Listing =require("./models/listing")
const path=require('path');
const engine= require('ejs-mate');
// getting-started.js
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const wrapAsync=require("./utils/wrapAsync");

main().then(()=>console.log("connection succesfull")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/rentnest');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.engine('ejs',engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
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
  try {
    /* let {title,description,image,price,loaction,country}=req.body; */
    let info=req.body;
    const newlisting= new Listing(info);
    newlisting.save().then((res)=>console.log(res)).catch((err)=>console.log(err));
    res.redirect("/Listing")
  } catch (error) {
    next(error)
  }
})

//get update requset
app.get("/Listing/:id/edit",async (req,res)=>{
  const { id }=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});

})

//get update data
app.put("/Listing/:id", async(req,res)=>{
  let {id} =req.params;
  console.log(id);
  console.log({...req.body});
  const listing=await Listing.findByIdAndUpdate(id,req.body,{new:true});
  console.log(listing);
  res.redirect(`/Listing/${id}`);
})
app.delete("/Listing/:id", async(req,res)=>{
  let {id} =req.params;
  console.log(id);
  const listing=await Listing.findByIdAndDelete(id);
  console.log(listing);
  res.redirect(`/Listing`);
})

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})