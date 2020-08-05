var express = require('express');
var router = express.Router();
var userService = require("../service/user.service");
var bcrypt = require("bcryptjs");
var userModel = require("../model/user.model")
var jwt = require("jsonwebtoken")
var cookieParser = require('cookie-parser')
var fs = require("fs");
const bookModel = require('../model/book.model');



router.get("/login-giao-dien",(req,res)=>{
  res.render("login1");
})

var checkLogin = (req,res,next)=>{
  var token = req.cookies.token;
  var decodeId = jwt.verify(token,"nodemyK6");
  
  userModel.find({
    _id:decodeId.id
  }).then((data)=>{
    
    if(data.length>0){
      res.data = data;
      next();
    }else{
      res.json({
        err:true,
        message:'You have not been login ever'
      })
    }
  })
}
/* GET admin page. */
router.get('/admin',checkLogin, function(req,res,next){
 
  try {

      
      
      var user =  res.data
      
      // console.log(res.data.role);
      if(user && user[0].role === "admin"){
        
          userModel.find({
            role:"manager"
          }).populate("bookId")
          .then((data)=>{
            
            res.render("admin",{data:data});
          })
        
         
          
          
      }else {
        res.json("ban ko co quyen")
      }
  } catch (error) {
      if(error.message === "jwt must be provided"){
          return res.json("ma token khong duoc cung cap");
      }

      if(error.message === "invalid signature"){
          return res.json("token sai hoac da het han");
      }

      if(error.message === "jwt malformed"){
          return res.json("token sai hoac da het han")
      }

      if(error.message === "jwt expired"){
          return res.json("token sai hoac da het han")
      }

      if(error.message === "invalid token"){
          return res.json("token khong ton tai");
      }
  }


});


//manager
router.get('/manager',checkLogin, function(req,res,next){
 
  try {
      var user = res.data
      
      if(user && user[0].role === "manager"){
          userModel.find({
            _id:user[0]._id,
            role:"manager"
          }).populate("bookId").then((data)=>{
            console.log(data);
            res.render("manager",{data:data});
          })    
      }else {
        res.json("ban ko co quyen")
      }
  } catch (error) {
      if(error.message === "jwt must be provided"){
          return res.json("ma token khong duoc cung cap");
      }

      if(error.message === "invalid signature"){
          return res.json("token sai hoac da het han");
      }

      if(error.message === "jwt malformed"){
          return res.json("token sai hoac da het han")
      }

      if(error.message === "jwt expired"){
          return res.json("token sai hoac da het han")
      }

      if(error.message === "invalid token"){
          return res.json("token khong ton tai");
      }
  }


});


router.get("/register",(req,res)=>{
  res.render("register");
})


//register
router.post("/register",function(req,res,next){
  
  var obj = {};
  


  if(req.body.username){
    userModel.findOne({
      username:req.body.username
    }).then((data)=>{
      if(data>0){
        res.json({
          err:true,
          message:'Username is existed'
        })
      }else{
        obj.username = req.body.username;
        if(req.body.email) obj.email = req.body.email
        if(req.body.password){
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                obj.password = hash
                userService.createUser(obj).then(data=>{
                  
                  res.json({
                    err:false,
                    message:"dang ky thanh cong",
                    data:data
                    
                  })
                })
            });
          });
        }
      }
    })
  }
 
  
})



router.post("/login", (req,res,next)=>{
  userModel.find({
    username:req.body.username
  }).then((data)=>{
    if(data.length > 0){
      var payload = {id:data[0]._id};
      
      var token = jwt.sign(payload,"nodemyK6",{expiresIn:"2d"});
      res.cookie("token",token,{maxAge:60*60*1000*2*24});
      res.data = data ;
      next();
    }
    else{
      res.json({
        err:true,
        message:"this account is not exist"
      })
    }
  })
},(req,res,next)=>{
  bcrypt.compare(req.body.password, res.data[0].password, function(err, value) {
    if(value == true){  
        userService.updateUserLogin(res.data[0]._id, true).then((user) => {
          var data = res.data;
            return res.json({
                data: data,
                err: false,
                message: "Login successful!!!"
            })
            
        }).catch((err) => {
            
        });          
    }else{
        return res.json({
            err: true,
            message: "Wrong password or username!!!"
        })
    }
  });
})


router.post("/",(req,res)=>{
  var obj = {}
  if(req.body.name) obj.name = req.body.name;
  userService.createBook(obj).then((data)=>{
    return res.json({
      err : false,
      message:'create a book success'
    })
  })
})

router.put("/:idUser",(req,res)=>{
  var obj = {};
  if(req.body.username) obj.username = req.body.username ;
  if(req.body.emai) obj.email = req.body.email;
  if(req.body.password)  obj.password = req.body.password;
  userService.updateUserById(req.params.idUser,obj),then(()=>{
    res.json({
      err : false,
      message:"update manager thanh cong"
    })
  })  
})

router.put("/:idBook",(req,res)=>{
  var obj = {}; 
  if(req.body.name)  obj.name = req.body.name;
  userService.updateBookById(req.params.idBook,obj),then(()=>{
    res.json({
      err : false,
      message:"update book thanh cong"
    })
  })  
})

router.get("/",(req,res)=>{
  
  userModel.find().then((data)=>{
    console.log(data[0].bookId);
    res.json({
      err : false,
      message:"xxx",
      data:data
    })
  })  
})

router.delete("/:idBook",(req,res)=>{
 
  userService.deleteBookById(req.params.idBook),then(()=>{
    res.json({
      err : false,
      message:"delete book thanh cong"
    })
  })  
})


router.delete("/:idUser",(req,res)=>{
 
  userService.deleteBookById(req.params.idUser),then(()=>{
    res.json({
      err : false,
      message:"delete user thanh cong"
    })
  })  
})







module.exports = router;
