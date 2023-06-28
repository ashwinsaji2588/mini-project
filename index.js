const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const firebase = require("firebase");
const firebaseConfig = require("./public/js/firebaseConfig");

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const app=express();

app.use(express.static("public"));
//app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/home.html");
})

app.get("/login.html",function(req,res){
    res.sendFile(__dirname+"/login.html");
})

app.get("/add_crop.html",function(req,res){
  res.sendFile(__dirname+"/add_crop.html");
})

app.get("/register.html",function(req,res){
    res.sendFile(__dirname+"/register.html");
})

app.get("/marketplace.html",function(req,res){
  res.sendFile(__dirname+"/marketplace.html");
})

app.listen(3000,function(){
    console.log("Server started on port 3000");
})

app.post("/register",function(req,res)
{
  const name=req.body.name;
  const email=req.body.username;
  const password=req.body.password;
  const address=req.body.address;
  try {
    // Create a new user entry in the database
    const newUserRef = db.ref("users").push();
    // Set the user data
    newUserRef.set({
      name: name,
      email: email,
      password: password,
      address: address
    });
    console.log("User data saved to Firebase");
    res.sendFile(__dirname + "/dashboard.html");
  } catch (err) {
    console.log(err);
  }
  res.sendFile(__dirname+"/dashboard.html");
})

app.post("/dashboard", async function(req, res) {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const usersRef = db.ref("users");
    usersRef.once("value", function(snapshot) {
      const users = snapshot.val();
      const foundUser = Object.values(users).find(
        user => user.email === email && user.password === password
      );
      if (foundUser) {
        res.sendFile(__dirname + "/dashboard.html");
      } else {
        // Username or password is incorrect
        res.status(401).send("Invalid username or password");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});


app.post("/add_crop.html",function(req,res){
  let title=req.body.crops;
  let quantity=req.body.quantity;
  let amount=req.body.price;
  let address=req.body.address;
  try {
    // Create a new user entry in the database
    const newUserRef = db.ref("crops").push();
    const currentDate = new Date();
    console.log(currentDate);
  // Calculate the future date by adding 24 hours (86400000 milliseconds)
    const futureDate = new Date(currentDate.getTime() + 86400000);
    console.log(futureDate);
    // Set the user data
    newUserRef.set({
      title: title,
      subtitle:"",
      detail:"",
      quantity:quantity,
      amount:amount,
      address:address,
      endTime:futureDate.toISOString()
    });
    console.log("User data saved to Firebase");
    res.sendFile(__dirname+"/add_crop.html");
  } catch (err) {
    console.log(err);
  }
  console.log(title,quantity,amount,address);
})