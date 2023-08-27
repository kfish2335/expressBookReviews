const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"user2","password":"password2"  }];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let temp = users.filter((user)=>{
  return user.username === username
});
if(temp.length > 0){
  return true;
} else { 
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let temp = users.filter((user)=>{
  return (user.username === username && user.password === password)
});
if(temp.length > 0){
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(req.session.authorization) {
    
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            if (books[parseInt(req.params.isbn)]["reviews"][user.data] !== undefined){
              books[parseInt(req.params.isbn)]["reviews"][user.data].push(req.body.review)
            }
            else{
              books[parseInt(req.params.isbn)]["reviews"][user.data] = [req.body.review]
            }
            res.status(200).send({message: user.data + "'s review has successfully added"});
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(req.session.authorization) {
    
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            if (books[parseInt(req.params.isbn)]["reviews"][user.data] !== undefined){
              books[parseInt(req.params.isbn)]["reviews"][user.data]=[]
              res.status(200).send({message: user.data + "'s review has successfully deleted"});
            }
            else{
              res.status(403).send({message: user.data + "'has no review"});
            }
            
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
