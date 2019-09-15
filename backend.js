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

function loginUser(req,res,next){
  
  console.log("Login petition")
  userModel.find({username: req.body.username},'username password -_id',
  function(err, userInfo){
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
  console.log("Favourite petition")
  userModel.find({username: req.body.username},'username favouriteProducts -_id',
  function(err, userInfo){
  if (err || userInfo[0] === undefined) {
    return res.sendStatus(600)
  } else {
    products = [].concat(userInfo[0].favouriteProducts);

    products.push(String(req.body.productId))
    if(products.length > 1) {
      products = new Set(products);
      products = Array.from(products)
    }
    userModel.updateOne({username:req.body.username}, {favouriteProducts: products}, 
      function(err,result){
        if (err){ 
           console.log(err)
           return res.sendStatus(400)
        }
        return res.sendStatus(200)
      })
  }
  })
}

function getFavourites(req,res,next){
  console.log("Get Favourites Petition")
  userModel.find({username: req.query.username},'username favouriteProducts -_id',
  function(err, userInfo){
    console.log(userInfo)
  if (err || userInfo[0] === undefined) {
    return res.sendStatus(600)
  } else {
    res.json({data:userInfo[0].favouriteProducts})
  }
})
}

function removeFavourite(req,res,next){

}
router.post('/loginUser', loginUser);
router.post('/registerUser', registerUser);
router.post('/saveFavourite', saveFavourite);
router.post('/removeFavourite', removeFavourite);
router.get('/getFavourites', getFavourites);




app.use('/', router);

app.listen(9000, function () {
  console.log('App listening on port 9000!');
});