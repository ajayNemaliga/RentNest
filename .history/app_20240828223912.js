const express = require('express');
const app = express();
const Listing =require("./models/listing")
const path=require('path');
const engine= require('ejs-mate');
// getting-started.js
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema");
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
const validateListing=(req,res,next)=>{
  let error= listingSchema.validate(req.body);
    if(error.error){
      throw new ExpressError(400, error.error);
    }
    else{
      next();
    }
}
app.listen(3000);
//index.ejs route
app.get("/Listing",wrapAsync(async (req,res)=>{
  
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
   
}))
//show route 
app.get("/Listing/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
}))

//create new route
app.get("/Listing/new/route",wrapAsync((req,res)=>{
  res.render("listings/createListing.ejs");
}))

//adding new list
app.post("/addListing",validateListing,wrapAsync(async(req,res)=>{
    let info=req.body;
    const newlisting= new Listing(info);
    
    let result= listingSchema.validate({ listing: req.body });
    if(result.error){
      throw new ExpressError(400, result.error.message);
    }

    newlisting.save().then((res)=>console.log(res)).catch((err)=>console.log(err));
    res.redirect("/Listing")
  
}))

//get update requset
app.get("/Listing/:id/edit",wrapAsync(async (req,res)=>{
  const { id }=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});

}))

//get update data
app.put("/Listing/:id",validateListing, wrapAsync(async(req,res)=>{
  let {id} =req.params;
  console.log(id);
  console.log({...req.body});
  const listing=await Listing.findByIdAndUpdate(id,req.body,{new:true});
  console.log(listing);
  res.redirect(`/Listing/${id}`);
}))

//delete route
app.delete("/Listing/:id", wrapAsync(async(req,res)=>{
  let {id} =req.params;
  console.log(id);
  const listing=await Listing.findByIdAndDelete(id);
  console.log(listing);
  res.redirect(`/Listing`);
}))

//error handling

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"))
})
app.use((err, req, res, next) => {
  console.error(err.stack)
 // let {statusCode=500, message='Somthing Went Wrong'}=err
  res.render("error.ejs",{err});
})