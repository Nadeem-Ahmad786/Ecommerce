const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/eCommerceDB", {useNewUrlParser: true});
const bcrypt = require("bcryptjs");
const User = require("./models/register");
const Product = require("./models/products");
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
app.post("/registerUser", async(req, res) => {
    const {name, email, password } = req.body;
    if(!name || !email || !password){
        res.status(400).send({error: "Please Enter all the Feilds"});
    }

    const userExits = await User.findOne({ email });
    if(userExits){
        res.status(400).send({error: "user already exists"});
    }
    else{
        const user =new User({
            name: name,
            email: email,
            password: password,
        });
                                                                                    
        const token = await user.generateToken();  
        console.log(token);                                                                                       
        user.save();
        res.status(200).send({message: "User Registed"});
    }
});

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
            res.status(201).send({message: "Login Successfully", userData: user});

        }
        else{
            res.status(400).send({message: "password is incorrect!"});
        }
    }
    else{
        res.status(404).send("User not found");
    }
});

app.get("/logout", auth, async(req, res) =>{
    try{
        //for single logout
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token != req.token;
         })
        // logout from all devices
        // req.user.tokens =[];
        res.clearCookie("NAEcommercetoken");
        console.log("logout succesfully");
        await req.user.save();
         res.status(200).send("user logout")
    }
    catch (error) {
        res.status(500).send({error});
    }
});


app.get("/cart",auth, async function(req, res){
//     const {user_id} =req.body;
//     const cartProducts = []
//     const user = await User.findOne({_id:user_id});
//     //console.log(user);
//         if(!(user==undefined || user == null)){
//             const cartProducts =  user.cart.map(async(cartItem) =>{
//            await Product.findOne({_id:cartItem.productid}, function(err, product){
//                 if(!err){
//                     const item = {
//                         productId: cartItem.productid,
//                         productName: product.productName,
//                         productImage: product.productImage,
//                         productPrice: product.productPrice,
//                         quantity: cartItem.quantity,
//                     }
//                     return item;
//                 }
//                 });
//             });
//             res.send(cartProducts);
//         }

//    // res.send(cartProducts);
    const user_id =req.user._id;
    const cartProducts = [];
    //find user by ID
    const user = await User.findById(user_id);
    //means user not found
    if(!user){
        res.send("User is not registered")
        return ;
    }
    for( const cartItem of user.cart) {
        const product = await Product.findById(cartItem.productid);
        const item = {
            productId: cartItem.productid,
            productName: product.productName,
            productImage: product.productImage,
            productPrice: product.productPrice,
            quantity: cartItem.quantity,
            }
            cartProducts.push(item);
    }
   // console.log(cartProducts);
    res.send(cartProducts);
});

app.post("/cart", async function(req, res){
    let {user_id, product_id, quantity} = req.body;
    //console.log(req.body);
    // console.log(user_id);
    // console.log(product_id);
    if(quantity>=1){
        const user = await User.findOne({_id: user_id}).select({ cart: {$elemMatch: {productid: product_id}}});
        user.cart[0].quantity = quantity;
        user.save();
        res.status(201).send({message: "quantity is changed"});
        return ;
    }
    if(quantity==undefined){
        const user = await User.findOne({_id: user_id}).select({ cart: {$elemMatch: {productid: product_id}}});
        if(user.cart.length ===1){
            user.cart[0].quantity += 1;
            user.save();
            res.status(201).send({message: "quantity is changed"});
            return ;
        }
        quantity= 1;
  //      User.update({_id: user_id}, {$push: {cart: {productid: product_id, quantity: quantity}}});

        User.findOneAndUpdate({_id:user_id},{$push: {cart: {productid: product_id, quantity: quantity}}}, function(err, foundUser){
            if(err)
                console.log("User not found");
        });
        res.status(201).send({message: "product added succesfully"});
        return ;
    }
    if(quantity==0){
        const user =await User.findById(user_id);
            if(!user){
                window.alert("User not found");
                res.status(400).send({message: "User not found"});
                return ;
            }
            user.cart = user.cart.filter((currentProduct) => {
                    return currentProduct.productid != product_id;
            });
           // console.log(user.cart);
            user.save();
            res.status(201).send({message:"product remove successfully"});
            return ;
    
        // User.findOneAndUpdate({_id:user_id},{$pull: {cart: {productid: product_id}}}, function(err, foundUser){
        //     if(!err)
        //         console.log(foundUser);
        // });
       // res.status(201).send({message: "product delete succesfully"});
       // return ;
        
    }
    
});

app.get("/products/all", async(req, res) => {
    const products = await Product.find({});
       console.log(products);
       res.status(200).send(products);
});

app.listen(5000, function(){
    console.log("Server Started");
})
