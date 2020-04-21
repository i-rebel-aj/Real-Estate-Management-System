//Requiring Frameworks
var express =require("express");
var app=express();
const bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
//Setting routes
var indexRoutes=require("./routes/index");
var AgentRoute=require("./routes/Agent");
var PropertyRoute=require("./routes/Property");

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.use("/", indexRoutes);
app.use("/Agent", AgentRoute);
app.use("/Property", PropertyRoute);

app.listen(3000,function(){
    console.log("Server is Running");
})
