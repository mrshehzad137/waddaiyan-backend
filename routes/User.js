const bcrypt = require("bcrypt");
const express = require("express");
const {User} = require("../models/userModel");
const config = require("config");
const router = express.Router();

router.post("/signup", async (req, res) => {
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
  
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      type:"User",
      status:"Active"
    });
  
    user.password = await bcrypt.hash(user.password, 10);
  
    await user.save();
  
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message:"User created Success"
    });
});

router.post('/signin',(req,res)=>{

    console.log("someone trying to connect..");
    console.log(req.body);
    User.find({email:req.body.email}).exec()
        .then(user=>{
            console.log(user[0]);
            if(user.length < 1){
                
                res.status(409).json({
                    error:"User doesnot exists "
                });
            }
            const hash=user[0].password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
    
                    if(result){
                       const token= jwt.sign({
                            name:user[0].name,
                            email:user[0].email,
                            type:'User',
                            userId:user[0]._id
  
                       },
                       config.get('myprivatekey')
                       ,
                       {
                           expiresIn:"1h"
                       }
                       );
                       console.log("login success "+token)
                        res.header("x-auth-token", token).status(200).json({
                            message:"login Successfuly...!!!",
                            token:token
                        });
                    }else{
  
                        res.status(404).json({
                            message:"Wrong Password"
                        });
                    }
                }); 
        })
        .catch(err=>{
          res.status(404).json({
            message:"Wrong email......!!!",
            error: err
        });  
        }); 
});

router.post('/create/event',(req,res)=>{
    res.status.json({message:"API under develop"});
});

module.exports = router;