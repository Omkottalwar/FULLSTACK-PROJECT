const mongoose=require("mongoose");
const review = require("./review");
const { ref, string, required } = require("joi");
const Schema=mongoose.Schema;
const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description: String,
    image:{
       url: String,
       filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },

        
        coordinates:{
            type:[Number],
            required:true
        }
    }

});
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
       await review.deleteMany({_id:{$in:Listing.reviews}});
    }
});

const listing= mongoose.model("listing",listingSchema);
module.exports=listing;
