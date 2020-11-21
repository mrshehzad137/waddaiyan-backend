const bcrypt = require("bcrypt");
const express = require("express");
const {Admin} = require("../models/adminModel");
const config = require("config");
const router = express.Router();

router.post("/signup", async (req, res) => {
  
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) return res.status(400).send("Admin already registered.");
  
    admin = new Admin({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      type:"Admin",
      status:"Active"
    });
  
    admin.password = await bcrypt.hash(admin.password, 10);
  
    await admin.save();
  
    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      message:"Admin created Success"
    });
});

router.post('/signin',(req,res)=>{

    console.log("someone trying to connect..");
    console.log(req.body);
    Admin.find({email:req.body.email}).exec()
        .then(admin=>{
            console.log(admin[0]);
            if(admin.length < 1){
                
                res.status(409).json({
                    error:"Admin doesnot exists "
                });
            }
            const hash=admin[0].password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
    
                    if(result){
                       const token= jwt.sign({
                            name:admin[0].name,
                            email:admin[0].email,
                            type:'Admin',
                            userId:admin[0]._id
  
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
  
module.exports = router;