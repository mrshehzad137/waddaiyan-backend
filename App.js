const config = require("config");
const mongoose = require("mongoose");
const body = require('body-parser');
const express = require("express");
const cors = require('cors');
const app = express();

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

//connect to mongodb
mongoose.connect(config.get("uri"), { 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true 
})
.then(() => {console.log("Connected to MongoDB...")})
.catch(err => console.error("Could not connect to MongoDB...",err));

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(body.json());
app.use(body.urlencoded({extended:false}));
app.use('/uploads', express.static('uploads'));
app.use('/api/user',require('./routes/User'));
app.use('/api/admin',require('./routes/Admin'));
app.use('/api/vendor',require('./routes/Customer'));


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
