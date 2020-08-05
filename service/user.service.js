var userModel = require("../model/user.model")
var bookModel = require("../model/book.model")


function createBook(book){
    return bookModel.create(book);
}

function updateBookById(bookId,book){
    return bookModel.updateOne({
        _id : bookId
    },book)
}

function deleteBookById(bookId){
    return bookModel.deleteOne({
        _id : bookId
    })
}

function pagination(index,size){
    return userModel.find().skip((index-1)*size).limit(size);
}

function getAllBook(){
    return bookModel.find();
}

function getBookById(bookId){
    return bookModel.findOne({
        _id:bookId
    })
}

function createUser(user){
    return userModel.create(user)
}

function updateUserLogin(userID,isLogin){
    return userModel.updateOne({
        _id:userID
    },{
        isLogin:isLogin
    })
}

function updateUserById(userId,user){
    return userModel.updateOne({
        _id:userId
    },user)
}




module.exports = {
    createBook,
    updateBookById,
    deleteBookById,
    pagination,
    getAllBook,
    getBookById,
    createUser,
    updateUserLogin,
    updateUserById
}