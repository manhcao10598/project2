var mongoose = require("../config/dbConnect");
var bookModel = require("./book.model")

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    role:{
        type:String,
        default:"manager"
    },
    bookId :[{
        type:String,

        ref:"book"
        
    }],
    isLogin:{
        type:String,
        default:false
    }
},{
    collection : "user"
})

var userModel = mongoose.model("user",userSchema);

// userModel.create({
//     username:"manh",
//     email:"manh1@gmail.com",
//     password:"1"
// }).then(data=>{
//     console.log(data);
// })

// userModel.updateOne({
//     _id:"5f28c9706060ee180c1e0055"
// },{
//     $push : {bookId : ["5f28cc30a860553e549acd5d"]}
// }).then(data=>{
//     console.log(data);
// })

// userModel.updateOne({
//     _id:"5f28c9706060ee180c1e0055"
// },{
//     $push : {bookId : ["5f28cc41a860553e549acd5e"]}
// }).then(data=>{
//     console.log(data);
// })

// userModel.updateMany({},{isLogin : false}).then((data)=>{
//     console.log(data);
// })

// userModel.find({
//     username:"manh",
//     password:"123"
// })
// .populate("bookId")
// .then(data=>{
//     console.log(data[0]);
// })

// userModel.find({
//     role:"manager"
//   }).populate("bookId")
//   .then((data)=>{
//     console.log(data[0]);
    
//   })

module.exports = userModel;