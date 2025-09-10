const mongoose=require("mongoose");
const listing=require("../models/listing.js");
const initData=require("./data.js")
main().then(()=>{
    console.log("database connected")
}).catch((err)=>{console.log(err)})

async function main() {
  await  mongoose.connect("mongodb://127.0.0.1:27017/wonderlust")
    
}

const initDB=async () =>{
    await listing.deleteMany({});
     initData.data=initData.data.map((obj)=>({...obj,owner:'6898cccc41215b7b74f57ef0'}))
    await listing.insertMany(initData.data);
    console.log("data was saved")
};

initDB();