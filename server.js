const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/eCommerceDB", {useNewUrlParser: true});
const bcrypt = require("bcryptjs");const User = require("./register");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/registerUser", function(req, res){
    res.sendFile(__dirname + "/public/register.html");
})
app.post("/registerUser", async(req, res) => {
    const {name, email, password } = req.body;
    if(!name || !email || !password){
        res.status(400).send("Please Enter all the Feilds");;
    }

    const userExits = await User.findOne({ email });
    if(userExits){
        res.status(400).send("user already exists");
    }
    const user =new User({
        name: name,
        email: email,
        password: password,
    });
                                                                                  
    const token = await user.generateToken();  
    console.log(token);                                                                                       
    user.save();
    res.send("User Registed");
});

app.get("/loginUser", function(req, res){
    res.sendFile(__dirname + "/public/login.html");
})
app.post("/loginUser", async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        const passwordMatchStatus = await bcrypt.compare(password, user.password);
        if(passwordMatchStatus){

            const token = await user.generateToken(); 
            res.cookie("NAEcommercetoken", token,{
                expire: new Date(Date.now + 864000000),
                httpOnly: true
            });
            //res.send(req.cookies.NAEcommercetoken);
            //res.status(201).send(user);
            res.sendFile(__dirname + "/public/index.html")
        }
        else{
            res.status(404).send("password is incorrect!");
        }
    }
    else{
        res.status(404).send("User not found");
    }
});

app.get("/logOut", auth, async(req, res) =>{
    try{
        //for single logout
        // req.user.tokens = req.user.tokens.filter((currentElement) => {
        //     return currentElement.token != req.token;
        // })
        // logout from all devices
        req.user.tokens =[];
        res.clearCookie("NAEcommercetoken");
        console.log("logout succesfully");
        await req.user.save();
        res.sendFile(__dirname + "/public/login.html")
    }
    catch (error) {
        res.status(500).send(error);
    }
})
app.listen(5000, function(){
    console.log("Server Started");
})