var express=require("express");
var router=express.Router();
 router.get("/",function(req,res){
     res.render("./Index/LandingPage");
 });
 module.exports=router;