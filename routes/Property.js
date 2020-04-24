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
/*==========================================
    Route To Display Landing Page
============================================*/
router.get("/", function(req,res){
    res.send("Property Landing Goes here");
});
/*==========================================
    Route To Display Property Search Form
============================================*/
router.get("/search", function(req,res){
    //res.send("Form To Search for property will be shown here");
    res.render("./Property/SearchProperty");
});

/*==========================================
    Route To Display Seach Results
============================================*/
router.get("/search/result", function(req,res){
    //res.send("Search Results Are Displayed here");
    var str=req.query.valid;
    var Type;
    if((str.match(/Sale/g) || []).length===0){
        //console.log("This contains Rent");
        Type="Rent";
    }else{
        console.log("This Contains Sale");
        Type="Sale";
    }
    connection.query(req.query.valid, function(err, foundProperty){
        if(err){
            console.log(err);
        }else{
            console.log(foundProperty);
            res.render("./Property/ShowProperty",{Property: foundProperty, Type:Type});
        }
    });
    //console.log(req.query.valid);
});
/*===============================================================
    Post Request To Handle Search And Generate A Dynamic Query 
=================================================================*/
router.post("/search", function(req,res)
{
    //Constructing A Dynamic Query all the fiven blocks much be synchronous

    var countprop=0,countadd=0, countDeal=0;
    console.log(req.body);
    var queryMainSale="select Property.*, Address.*,BHK_Det.* ,Sale.* from Property, Address, BHK_Det, Sale where Sale.Property_id = Property.Property_id AND Sale.Property_id=Address.Property_id AND Sale.Property_id=BHK_Det.Property_id AND Sale.Property_id in "
    var queryMainRent="select Property.*, Address.*,BHK_Det.* ,Rent.* from Property, Address, BHK_Det, Rent where Rent.Property_id = Property.Property_id AND Rent.Property_id=Address.Property_id AND Rent.Property_id=BHK_Det.Property_id AND Rent.Property_id in "
    var querySaleRent="Select Property_id from ";
    var queryAdd="Select Property_id from Address "
    var queryBHK="Select Property_id from BHK_Det "
    var queryProp="Select Property_id from Property "
    /*==============================================
        Dealing with main string
    ===============================================*/
    if(req.body.Type==="Rent"){
        queryMain=queryMainRent;
    }else{
        queryMain=queryMainSale;
    }
    /*==============================================
        Dealing with Sale/Rent
    ==============================================*/
    querySaleRent=querySaleRent+req.body.Type;
    if(req.body.Price!==''){
        if(req.body.Type==="Sale"){
            querySaleRent=querySaleRent+" where Price <= "+req.body.Price;
        }else if(req.body.Type==="Rent"){
            querySaleRent=querySaleRent+" where Rent_PM <= "+req.body.Price;
        }
        countDeal++;
    }
    //This statement should come at last
    if(countDeal===0){
        querySaleRent=querySaleRent+" where Property_id in ";
    }else if(countDeal>0){
        querySaleRent=querySaleRent+" AND Property_id in ";
    }
    /*===============================================
        Dealing with BHK Details
    ================================================*/
    if(req.body.Bed_Count!==''){
        queryBHK=queryBHK+"where No_of_Bedrooms >= "+req.body.Bed_Count;
    }
    /*===============================================
        Dealing With Property Types Only
    ================================================*/
    if(req.body.Plot_Area!==''){
        if(countprop==0){
            queryProp=queryProp+"where Plot_Area = "+req.body.Plot_Area;
        }else{
            queryProp=queryProp+" AND Plot_Area = "+req.body.Plot_Area;
        }
        countprop++;
    }
    if(req.body.Face_Direction!=="No Choice"){
        if(countprop==0){
            queryProp=queryProp+"where Facing_Direction = \""+req.body.Face_Direction+"\"";
        }else{
            queryProp=queryProp+" AND Facing_Direction = \""+req.body.Face_Direction+"\"";
        }
        countprop++;
    }
    /*===============================================
        Dealing With Address Type Only
    ================================================*/
    if(req.body.District!==''){
        if(countadd==0){
            queryAdd=queryAdd+"where district = \""+req.body.District+"\"";
        }else{
            queryAdd=queryAdd+" AND district = \""+req.body.District+"\"";
        }
        countadd++;
    }
    if(req.body.State!==''){
        if(countadd==0){
            queryAdd=queryAdd+"where State = \""+req.body.State+"\"";
        }else{
            queryAdd=queryAdd+" AND State = \""+req.body.State+"\"";
        }
        countadd++;
    }
    if(req.body.Street!==''){
        if(countadd==0){
            queryAdd=queryAdd+"where Street = \""+req.body.Street+"\"";
        }else{
            queryAdd=queryAdd+" AND Street = \""+req.body.Street+"\"";
        }
        countadd++;
    }
    if(req.body.Postal_Code!==''){
        if(countadd==0){
            queryAdd=queryAdd+"where Postal_code = "+req.body.Postal_Code;
        }else{
            queryAdd=queryAdd+" AND Postal_code = "+req.body.Postal_Code;
        }
        countadd++;
    }
    queryProp="("+queryProp+")";
    queryBHK="("+queryBHK+")";
    queryAdd="("+queryAdd+")";
    //console.log(querySaleRent);
    //console.log(queryProp);
    //console.log(queryBHK);
    //console.log(queryAdd);
    var ans=querySaleRent+queryProp+" AND Property_id in "+queryBHK+" AND Property_id in "+queryAdd;
    ans=queryMain+"("+ans+")";
    //console.log(ans);
    /*===========================================================
            BIG SECURITY ISSUE FIX IT
    ============================================================*/
    //Use Session dont send back stuff via URL, Security Issue must Fix This
    var search=encodeURIComponent(ans);
    res.redirect("/Property/search/result?valid="+search);
});
module.exports= router;