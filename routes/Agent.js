var express=require("express");
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
        console.log("Connected For The Agent Route");
    }
});
router.get("/",function(req,res){
    //Run The Required Queries
    connection.query("select * from Agent order by Agent_ID", function(err, result){
        if(err){
            console.log(err);
        }else{
            //Note you cant copy arrays in javascript using 
            //= operator, use slice method
            //console.log(result);
            connection.query("select * from Agent_Ph_NO order by Agent_ID", function(err, result2){
                if(err){
                    console.log(err);
                }else{
                    //console.log(result2);
                    //agent_phno=result.slice();
                    res.render("./Agents/LandingAgent",{Agents:result, phno:result2});
                }
            });
        }
    });
});
router.get("/login", function(req,res){
    res.render("./Agents/AgentLogin");
});
router.post('/login', function(req, res) {
    var username = req.body.Agent_ID;
    var password = req.body.Password;
    if (username && password) {
        connection.query('SELECT * FROM Agent WHERE Agent_ID = ? AND Password = ?', [username, password], function(error, results, fields) {
        	if(error){
        		console.log(error);
        	}
        	console.log(results);
            if (results.length > 0) 
            {
                //request.session.loggedin = true;
                //request.session.username = username;
                res.send("Login Succcessfull");
            } else {
                res.send('Incorrect UserId and/or Password!');
            }
        });
    } else {
        res.send('Please enter UserId and Password!');
    }
});
router.get("/Profile/:id", function(req,res){
    //Make this code clearer by making deep copies in js
    connection.query("Select * from Agent where Agent_ID= ?",[req.params.id], function(err,foundAgent){
        if(err){
            console.log(err);
        }else{
            //console.log("Selected Agent is ");
            //console.log(result);
            connection.query("Select Property_ID,Price, Date_Of_Deal from Sale where Property_ID in (Select Property_ID from Property where Agent_ID= ?)",[req.params.id], function(err, foundSale){
                if(err){
                    console.log(err);
                }else{
                    connection.query("Select Property_ID,Rent_PM, Date_Of_Deal from Rent where Property_ID in (Select Property_ID from Property where Agent_ID= ?)",[req.params.id], function(err, foundRent){
                        if(err){
                            console.log(err);
                        }else{
                                //Add Utility Queries
                                res.render("./Agents/Profile",{Agent:foundAgent, ForSale: foundSale, ForRent:foundRent});
                        }
                    });
                }
            });
        }
    });
});
//connection.end();
module.exports=router;