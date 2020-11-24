const bcrypt = require("bcrypt");
const express = require("express");
const {Customer} = require("../models/customerModel");
const {User} = require("../models/userModel");
const {Event} = require("../models/eventModel");
const {Review} = require("../models/reviewSchema");
const {Booking} = require("../models/cvBookingModel");
const config = require("config");
const { Venue } = require("../models/venueModel");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null,'./uploads/Vendors');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });



  const storage1 = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null,'./uploads/Venues');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter1 = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload1 = multer({
    storage: storage1,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter1
  });


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
            upload1console.log(admin[0]);
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

router.post('/create/venue',async (req,res)=>{
    
    const venue = await Venue.findOne({name : req.body.name,location:req.body.location});

    if(venuupload1e){
        res.status(404).Bookingjson({message:"Venue already exists "});
    }

    const newvenue = new Event({
        name:req.body.name,
        description:req.body.description,
        location:req.body.location,
        vendor:req.body.vendor,
        status:"Created",
    });

    const resVenue = await newvenue.save();

    res.status.json({message:"Venue created success",resVenue});
});

router.put('/update/venue',async (req,res)=>{
    
    const venue =  Venue.findOneAndUpdate({_id:req.body.id},req.body,{new:true});
    
    res.status.json({message:"Venue Update success",venue});

});

router.get('/getall/venue/:vendorId',(req,res)=>{
    const venueList =  await Venue.find({vendor:req.params.vendorId});
    
    if(venueList && venueList.length > 0){
        res.status.json({message:"Venue List  found success",venueList});
    }else {
        res.status(404).json({
            message:"Venue not found"
        });
    }

});


router.get('/get/venue/:vendorId',(req,res)=>{
    const venue =  await Venue.findOne({vendor:req.params.vendorId});
    
    if(venue){
        res.status.json({message:"Venue   found success",venue});
    }else {
        res.status(404).json({
            message:"Venue not found"
        });
    }

});

router.get('/get/:vendorId',(req,res)=>{
    const vendor =  await Customer.findOne({_id:req.params.vendorId});
    
    if(vendor){
        res.status.json({message:"vendor found success",vendor});
    }else {
        res.status(404).json({
            message:"vendor not found"
        });
    }

});

router.get('/getall/venue',(req,res)=>{
    const venueList =  await Venue.find({});
    
    if(venueList && venueList.length > 0){
        res.status.json({message:"Venue List  found success",venueList});
    }else {
        res.status(404).json({
            message:"Venue not found"
        });
    }

});

router.get('/getall/vendors',(req,res)=>{
    const vendorList =  await Customer.find({});
    
    if(vendorList){
        res.status.json({message:"Vendor List  found success",vendorList});
    }else {
        res.status(404).json({
            message:"Vendor List not found"
        });
    }

});

router.put('/update',upload.single('profilePicture'), async (req,res)=>{
    
    const vendor =  Customer.findOne({_id:req.body.id});

    if(vendor){
          
        if(req.body.name){
            vendor.name=req.body.name;
          }
          if(req.body.email){
            vendor.user=req.body.user;
          }
          if(req.body.status){
            vendor.status=req.body.status;
          }
          if(req.body.type){
            vendor.type=req.body.type;
          }
          if(req.body.role){
            vendor.role=req.body.role;
          }
          if(req.body.password)
          {
            vendor.password = await bcrypt.hash(req.body.password, 10);
          }
          if(req.file){
            vendor.profileUrl=req.file.path;
          }
          
          
        const newuser = await user.save();


        res.status.json({message:"Vendor Update success",newuser});

    } else {
        res.status(404).json({
            message:"Vendor not found"
        });
    }
    
});



router.put('/upload/venue/pics', upload1.single('picture'),async (req,res)=>{
    
    const venue =  Venue.findOne({_id:req.body.id});

    if(venue){
        venue.pictures.push(req.file.path);
        const newVenue = await venue.save();
        res.status.json({message:"Venue Update success",newVenue});
    }else{
        res.status(404).json({
            message:"Venue not found"
        });
    }
});

  
module.exports = router;