const config = require('config');
const jwt = require('jsonwebtoken');
// const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  type:{
    type:String,
    maxlength:50
  },
  status:{
    type:String,
    maxlength:50
  },
});

AdminSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, name:this.name,type:this.type,email:this.email}, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
}

const admin = mongoose.model('Admin', AdminSchema);

exports.Admin = admin; 