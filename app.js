const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride("__method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")
const session=require("express-session");
const MongoStore=require("connect-mongo");
const { cookie } = require("express/lib/response.js");
const flash=require("express-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user.js")
const dbUrl=process.env.ATLASDB_URL;
async function main() {
  await  mongoose.connect(dbUrl);   
}
main().then(()=>{
    console.log("database connected")
}).catch((err)=>{console.log(err)})
const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600,

});
store.on("error",()=>{
    console.log("ERROR i MONGO SESSION STORE",err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use((err,req,res,next)=>{
let {statusCode=500,message="somethiing went wrong!"}=err;
res.status(statusCode).render("error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("listing to port 8080");
});
