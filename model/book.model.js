var mongoose = require("../config/dbConnect");


var Schema = mongoose.Schema ;

var bookSchema = new Schema({
    name : String
},{
    collection :"book"
})


var bookModel = mongoose.model("book",bookSchema);

// bookModel.create({
//     name:"onePiece"
// })

// bookModel.create({
//     name:"Conan"
// })

module.exports = bookModel;