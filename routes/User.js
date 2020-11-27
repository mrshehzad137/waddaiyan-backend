const bcrypt = require("bcrypt");
const express = require("express");
const {User} = require("../models/userModel");
const {Token} = require("../models/tokenModel");
const {Venue} = require("../models/venueModel");
const {Event} = require("../models/eventModel");
const {Review} = require("../models/reviewSchema");
const {Booking} = require("../models/cvBookingModel");
var crypto = require('crypto');
const config = require("config");
const router = express.Router();
const multer = require('multer');
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null,'./uploads/User');
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

router.post('/create/event',async (req,res)=>{
    
    const event = await Event.findOne({timeanddate:req.body.date,location:req.body.location});

    if(event){
        res.status(404).json({message:"Event already exists "});
    }

    const newevent = new Event({
        name:req.body.name,
        description:req.body.description,
        location:req.body.location,
        timeanddate:req.body.timeanddate,
        eventCategory:req.body.eventCategory,
        user:req.body.userid,
        status:"Created",
    });

    const resEvent = await newevent.save();

    res.status(200).json({message:"Event created success",resEvent});
});

router.post('/add/vendor', async (req,res) => {
    
    const event = await Event.findById({_id:req.body.eid});

    if(event){

        const booking = new Booking({
            location:event.location,
            timeanddate:event.timeanddate,
            vendor: (req.body.vendor)?req.body.vendor:undefined,
            venue: (req.body.venue)?req.body.venue:undefined,
            user: req.body.user,
            event: event._id,
            status: "Created"
        });

        const newbooking = await booking.save();

        res.status(200).json({message:"Booking created success",newbooking});
    } else {
        res.status(404).json({
            message:"Event not found"
        })
    }

});

router.post('/booking/accept-reject',async (req,res)=>{

    console.log("body",req.body);

    const booking = await Booking.findById({_id:req.body.bookingid});
    
    if(booking){

        booking.status = req.body.status;  
     
        const newbooking = await booking.save();
 
         res.status(200).json({message:"Booking update success",newbooking});
     } else {
         res.status(404).json({
             message:"Booking not found"
         });
     }

});


router.post('/add/venue', async (req,res) => {
    
    const booking = await Booking.findById({_id:req.body.bookingid});

    if(booking){

       booking.venue = req.body.venue;  
    
       const newbooking = await booking.save();

        res.status(200).json({message:"Booking update success",newbooking});
    } else {
        res.status(404).json({
            message:"Booking not found"
        });
    }

});


router.get('/getall/booking/:UserId', async (req,res)=>{

    const bookingList = await Booking.find({user : req.params.UserId})
    .populate('vendor')
    .populate('event')
    .populate('venue');

    if(bookingList && bookingList.length > 0){
        res.status(200).json({message:"Booking List found success",bookingList});
    }else {
        res.status(404).json({
            message:"Booking not found"
        });
    }
});

router.get('/getall/bookingVendor/:vendorId', async (req,res)=>{

    const bookingList = await Booking.find({vendor : req.params.vendorId})
    .populate('vendor')
    .populate('event')
    .populate('user')
    .populate('venue');

    if(bookingList && bookingList.length > 0){
        res.status(200).json({message:"Booking List found success",bookingList});
    }else {
        res.status(404).json({
            message:"Booking not found"
        });
    }
});


router.get('/getall/bookings', async (req,res)=>{

    const bookingList = await Booking.find({})
    .populate('vendor')
    .populate('event')
    .populate('venue')
    .populate('user');

    if(bookingList && bookingList.length > 0){
        res.status(200).json({message:"Booking List found success",bookingList});
    }else {
        res.status(404).json({
            message:"Booking not found"
        });
    }
});


router.get('/get/booking/:bookingID', async (req,res)=>{

    const booking = await  Booking.findOne({_id : req.params.bookingID})
    .populate('vendor')
    .populate('event')
    .populate('venue')
    .populate('user')
    ;

    if(booking){
        res.status(200).json({message:"Booking found success",booking});
    }else {
        res.status(404).json({
            message:"Booking not found"
        });
    }
});

router.get('/getall/event/:UserId', async (req,res)=>{

    const eventList = await  Event.find({user : req.params.UserId}).populate('user');

    if(eventList && eventList.length > 0){
        res.status(200).json({message:"event List found success",eventList});
    }else {
        res.status(404).json({
            message:"event List  not found"
        });
    }
});


router.get('/get/event/:EventId', async (req,res)=>{

    const event = await  Event.findOne({_id : req.params.EventId}).populate('user');

    if(event){

        res.status(200).json({message:"event found success",event})

    } else {
        res.status(404).json({
            message:"event not found"
        });
    }
});

router.get('/getall/events', async (req,res)=>{

    const eventList = await  Event.find({}).populate('user');

    if(eventList && eventList.length > 0){

        res.status(200).json({message:"Event list found success",eventList});

    } else {
        res.status(404).json({
            message:"Event list not found"
        });
    }
});

router.get('/getall', async (req,res)=>{

    const userList = await  User.find({});

    if(userList && userList.length > 0){

        res.status(200).json({message:"Users found success",userList});

    } else {
        res.status(404).json({
            message:"User not found"
        });
    }
});

router.post('/add/review/event',async (req,res)=>{

    const review = new Review({
        rating: req.body.rating,
        comments: req.body.comments,
        user: req.body.user
    })

    const newreview = await review.save();

    const event = await Event.findById({_id:req.body.event});

    if(event){
        event.reviews.push(newreview._id);
        await event.save();
        res.status(200).json({message:"Review created success",newreview});
    } else {
        res.status(404).json({
            message:"event not found"
        });
    }
});

router.post('/add/review/venue',async (req,res)=>{

    const review = new Review({
        rating: req.body.rating,
        comments: req.body.comments,
        user: req.body.user
    })

    const newreview = await review.save();

    const venue = await Venue.findById({_id:req.body.venue});

    if(venue){
        venue.reviews.push(newreview._id);
        await venue.save();
        res.status(200).json({message:"Review created success",newreview});
    }else {
        res.status(404).json({
            message:"event not found"
        });
    }
});

router.put('/update/event',async (req,res)=>{
    
    const event = await Event.findOneAndUpdate({_id:req.body.id},req.body,{new:true});
    
    res.status(200).json({message:"Event Update success",event});

});


router.put('/update',upload.single('profilePicture'), async (req,res)=>{
    
    const user = await User.findOne({_id:req.body.id});

    if(user){
          
        if(req.body.name){
            user.name=req.body.name;
          }
          if(req.body.email){
            user.email=req.body.email;
          }
          if(req.body.status){
            user.status=req.body.status;
          }
          if(req.body.password)
          {
            user.password = await bcrypt.hash(req.body.password, 10);
          }
          if(req.file){
            user.profileUrl=req.file.path;
          }
          
        
        const newuser = await user.save();


        res.status(200).json({message:"User Update success",newuser});

    } else {
        res.status(404).json({
            message:"User not found"
        });
    }
    
});

router.post('/forget',async (req,res)=>{
    const result = await User.findOne({_id:req.body.id});
    var token = new Token({ _userId: result._id, token: crypto.randomBytes(16).toString('hex') });
    token.save();


});

router.post('/reset/password',async (req,res)=>{
    Token.findOne({token:req.body.token})
    .then(async result=>{
        User.findById(result._userId)
        .then(async result2=>{
            result2.password = await bcrypt.hash(req.body.password, 10);
            result2.save()
            .then(result3=>{
                res.status(200).json({
                  message:'User Password Changed Confirm',
                  user:result3
                })
            }).catch(err=>{
          res.status(404).json({
            error:err
          })
        })
        }).catch(err=>{
          res.status(404).json({
            error:err
          })
        })
    })
    .catch(err=>{
      res.status(404).json({
        error:err,
        message:'Invalid token'
      })
    })
});


module.exports = router;