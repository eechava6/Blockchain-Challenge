const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

mongoose.connect('mongodb+srv://metausers:metausers123@metastore-fittf.mongodb.net/Users?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true});

var Schema = mongoose.Schema;

  var userSchema = new Schema({
    username:  String,
    password: String,
    favouriteProducts: [String],
  });


var userModel = mongoose.model('users', userSchema);

app.use(bodyParser.json());


function savePurchase(purchase){
  
}

function loginUser(req,res,next){
  
  console.log("Login petition")
  console.log(req.body)
  userModel.find({username: req.body.username},'username password -_id',
  function(err, userInfo){

  console.log(userInfo)
  console.log(userInfo[0])
  if (err || userInfo[0] === undefined) {
    return res.sendStatus(600)
  } else {
    if(req.body.password === userInfo[0].password){
      return res.sendStatus(200)
    }
    return res.sendStatus(600)
  }
 });
}

function registerUser(req,res,next){
  console.log("User creation petition")
  console.log(req.body)
  userModel.create({ 
    username: req.body.username, 
    password: req.body.password,
    favouriteProducts: []
  },      
    function (err, result) {
    if (err){ 
      console.log(err)
       return res.sendStatus(400)
    }else
      console.log(result)
       return res.sendStatus(200)
    });
}

function saveFavourite(req,res,next){

}

function removeFavourite(req,res,next){

}

router.post('/savePurchase', savePurchase);
router.post('/loginUser', loginUser);
router.post('/registerUser', registerUser);
router.post('/saveFavourite', saveFavourite);
router.post('/removeFavourite', removeFavourite);




app.use('/', router);

app.listen(9000, function () {
  console.log('App listening on port 9000!');
});