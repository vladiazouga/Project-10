//studentserver.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")
const mongoose = require('mongoose');



//sets the url
const mongoURI = "mongodb+srv://vzouga2021:$$Smileyvee2468$$@hw7.evep4ed.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//Connects to the database, informs the programmer if connection successful.
mongoose.connect(mongoURI);
const db = mongoose.connection;

//Creates schema to insert to the database, sets schema to a constant to be used in api calls.
const info = new mongoose.Schema({
  record_id: {
    required: true,
    type: Number
  },
  first_name: {
    required: true,
    type: String
  },
  last_name: {
    required: true,
    type: String
  },
  gpa: {
    required: true,
    type: String
  },
  enrolled: {
    required: true,
    type: String
  }
})
const Model = mongoose.model('Data', info)

app.post('/students', function (req, res) {
  var record_id = new Date().getTime();
  const data = new Model({

    record_id: record_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gpa: req.body.gpa,
    enrolled: req.body.enrolled
  })
  const dataToSave =  data.save();
  return res.status(200).send("Success");
});

  //Waits for the database to find the student, if it does not exist, it will save the data to the database.
  //var x =  Model.find({ record_id:record_id, first_name: req.body.first_name, last_name: req.body.last_name }).count()
  /*if (x != 0) {
    console.log("Student Already Exists")
    res.status(400).send("Error, student exists!");
  }
  else {
    console.log(data)
    try {
      console.log("Worked")
      //Saves the data to the database
      const dataToSave =  data.save();
      res.status(200).send("Success");
    }
    catch (error) {
      res.status(400).send("Error");
    }
  }
});*/


app.get('/students/:record_id', function(req, res){{
  console.log(req.params.record_id);
  {
    
  }
    const data = Model.findOne({record_id: req.params.record_id});
    res.status(200).send(data);
  
}});





app.get('/addStudent', function (req, res) {
  res.render('addStudent');

}); //end post method


app.get('/displayStudent', function (req, res) {
  res.render('displayStudent');
});

app.get('/updateStudent', function (req, res) {
  res.render('updateStudent');
});


app.get('/deleteStudent', function (req, res) {

  res.render('deleteStudent');
}); //end put method

app.get('/listStudents', function (req, res) {
  res.render('listStudents');
});
//end delete method

app.get('/', function (req, res) {
  res.render('index');
});





app.listen(5678); //start the server
console.log('Server is running...');