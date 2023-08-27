const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.status(300).json(books))
    },6000)})
  return myPromise1 ;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(res.status(300).json(books[parseInt(req.params.isbn)]))
    },6000)})
  return myPromise1;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here 
  let response = {}
  for (const book in books){if(books[book]["author"]===req.params.author){response[book] = books[book]}}
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(response)
    },6000)})
  return myPromise1;
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let response = {}
  for (const book in books){if(books[book]["title"]===req.params.title){response[book] = books[book]}}
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(response)
    },6000)})
  return myPromise1;  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json(books[parseInt(req.params.isbn)]["reviews"]);
});

module.exports.general = public_users;
