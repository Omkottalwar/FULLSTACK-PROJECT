const listing=require("../models/listing")
module.exports.index=async (req,res)=>{
   const allListing= await listing.find({})
   res.render("listings/index.ejs",{allListing})
    }
module.exports.renderNewForm=(req,res)=>{
        res.render("listings/new.ejs")
    };
module.exports.showListings=async (req,res)=>{
  let {id}=req.params;
const data= await listing.findById(id)
.populate({path:"reviews",
    populate:{
        path:"author",
    },

});
if(!data){
   req.flash("error","Listing you requested for does not exist!");
  return res.redirect("/listings");
}
 res.render("listings/show.ejs",{data});
};

module.exports.createListing=async (req,res,next)=>{
async function getCoordinates(address) {
    if (!address) {
        console.log("Please provide an address.");
        return null;
    }

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            // Return coordinates in the desired format
            return { 
                type:"Point",
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)] };
        } else {
            console.log("Address not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching geocoding data:", error);
        return null;
    }
}
const coords=await getCoordinates(req.body.listing.location)

     let url=req.file.path;
     let filename=req.file.filename;
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    if(coords){
        newListing.geometry=coords;
    }
    let saved =await newListing.save();
    console.log(saved)
    req.flash("success","New Listing Created!")
    res.redirect("/listings");

};
module.exports.renderEdit=async (req,res)=>{
    let {id}=req.params;
    const  data= await listing.findById(id);
    if(!data){
   req.flash("error","Listing you requested for does not exist!");
  return res.redirect("/listings");
}
   let originalImageUrl=data.image.url;
   originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250")

    res.render("listings/edit.ejs",{data,originalImageUrl});

};
module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let Listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined" ){
     let url=req.file.path;
     let filename=req.file.filename;
    Listing.image={url,filename}
    await Listing.save();
    }
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`)

};
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
 await listing.findByIdAndDelete(id);
 req.flash("success","Listing Deleted!")
 res.redirect("/listings");
};