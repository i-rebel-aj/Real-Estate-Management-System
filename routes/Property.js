var express = require("express");
var router=express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'i_rebel_aj',
  password : 'AkshayJain1@',
  database : 'DBMS_Project2'
});
connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Connected For The Property Route");
    }
});
router.get("/", function(req,res){
    res.send("Property Landing Goes here");
});
router.get("/search", function(req,res){
    //res.send("Form To Search for property will be shown here");
    res.render("./Property/SearchProperty");
});
router.post("/search", function(req,res){
    var count=0;
    console.log(req.body);
    var queryMain="Select Property_ID from ";
    var queryAdd="Select Property_ID from Address "
    var queryProp="Select Property_ID from Property " 
    queryMain=queryMain+req.body.Type;
    console.log(query);
    if(req.body.Plot_Area!==null){
        if(count==0){
            queryProp=queryProp+"where Plot_Area = "+req.body.Plot_Area;
        }else{
            queryProp=queryProp+"AND Plot_Area = "+req.body.Plot_Area;
        }
    }
    //Write Remainin Code here
    if(req.body.District!=null){

    }

});
router.get("*", function(req,res){
    res.send("What You are looking for has not been found");
});
module.exports= router;