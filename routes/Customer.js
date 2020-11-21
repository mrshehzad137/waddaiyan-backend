const bcrypt = require("bcrypt");
const express = require("express");
const {Customer} = require("../models/customerModel");
const config = require("config");
const router = express.Router();

router.post("/signup", async (req, res) => {
  
    let customer = await Customer.findOne({ email: req.body.email });
    if (customer) return res.status(400).send("Customer already registered.");
  
    customer = new Customer({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      role:req.body.role,
      type:"Customer",
      status:"Active"
    });
  
    customer.password = await bcrypt.hash(customer.password, 10);
    await customer.save();
  
    res.status(200).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      message:"Customer created Success"
    });
});

router.post('/signin',(req,res)=>{

    console.log("someone trying to connect..");
    console.log(req.body);
    Customer.find({email:req.body.email}).exec()
        .then(customer=>{
            console.log(admin[0]);
            if(admin.length < 1){
                
                res.status(409).json({
                    error:"Customer does not exists "
                });
            }
            const hash=customer[0].password;
            bcrypt.compare(req.body.password, hash, function(err, result) {
    
                    if(result){
                       const token= jwt.sign({
                            name:customer[0].name,
                            email:customer[0].email,
                            type:'Customer',
                            userId:customer[0]._id
  
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
  