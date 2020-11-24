const config = require('config');
const jwt = require('jsonwebtoken');
// const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
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
  reviews:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'Review' 
  }],
  status:{
    type:String,
    maxlength:50
  },
  profileUrl:{
    type:String
  },
});

UserSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id,type:this.type,name:this.name,email:this.email}, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
}

const user = mongoose.model('User', UserSchema);

exports.User = user; 