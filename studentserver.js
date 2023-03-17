//studentserver.js

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")

 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));
app.set('view engine', 'ejs');


app.get('/addStudent', function(req, res) {
  res.render('addStudent');
  
}); //end post method


app.get('/displayStudent', function(req, res) {
  res.render('displayStudent');
}); 

app.get('/updateStudent', function(req, res) {
  res.render('updateStudent');
});


app.get('/deleteStudent', function(req, res) {

  res.render('deleteStudent');
}); //end put method

app.get('/listStudents', function(req, res) {
  res.render('listStudents');
  });
 //end delete method

 app.get('/', function(req, res) {
  res.render('index');
 });


app.listen(5678); //start the server
console.log('Server is running...');