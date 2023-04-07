//studentserver.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//sets the url
const mongoURI = "mongodb+srv://vzouga2021:$$Smileyvee2468$$@hw7.evep4ed.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));
//Sets the view engine to ejs.
app.set('view engine', 'ejs');

//Connects to the database, using the url.
mongoose.connect(mongoURI);
const db = mongoose.connection;

//Creates schema to insert to the database, and sets the data types.
const info = new mongoose.Schema({
  _id: {
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

//Creates a model to be used in the api calls.
const Model = mongoose.model('Data', info)

//This post method will add a student to the database.
app.post('/students', async function (req, res) {
  var record_id = new Date().getTime();
  const data = new Model({

    _id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gpa: req.body.gpa,
    enrolled: req.body.enrolled

  })
  //Should check for duplicates before saving to the database.
  const existingStudent = await Model.findOne({ first_name: req.body.first_name, last_name: req.body.last_name, });
  console.log(existingStudent)
  if (existingStudent) {
    return res.status(200).send("Student already exists");
  };
  const dataToSave = await data.save();
  return res.status(200).send("Success");



});



//This get method will find a student by their id in the database and return the data.
app.get('/students/:record_id', async function (req, res) {
  {
    console.log(req.params.record_id);
    //This will find the student by their id in the database and return the data.
    const data = await Model.findOne({ _id: req.params.record_id });
    res.status(200).send(data);

  }
});

//This get method will find all the students in the database and return the data.
app.get('/students', async function (req, res) {
  {
    
    let { fname, lname } = req.query
    console.log(fname)
    console.log(lname)
    //This will find the student's first name and last name in the database using what the user typed in the search bar.
    //and return the data.
    if (fname && lname) {
      var match = new RegExp("^" + fname);
      var match2 = new RegExp("^" + lname);
      let search = await Model.find({ first_name: match, last_name: match2 });
      if (search.length > 0) {
        res.status(200).send(search);
      }
    }
    else {
      const data = await Model.find();
      res.status(200).send(data);
    }


  }
});

//This delete method will find a student by their id in the database and delete the data.
app.delete('/students/:record_id', async function (req, res) {
  {
    //This will find the student by their id in the database and delete the data.
    const data = await Model.deleteOne({ _id: req.params.record_id });
    res.status(200).send(data);

  }
});

//This put method will find a student by their id in the database and update the data.
app.put('/students/:record_id', async function (req, res) {
  {
    //This will find the student by their id in the database and update the data.
    const data = await Model.updateOne({ _id: req.params.record_id }, { first_name: req.body.first_name, last_name: req.body.last_name, gpa: req.body.gpa, enrolled: req.body.enrolled });
    res.status(200).send(data);
    console.log(data)

  }
});

//This http request will render the addStudent page. 
app.get('/addStudent', function (req, res) {
  res.render('addStudent');
});
//This http request will render the displayStudent page.
app.get('/displayStudent', function (req, res) {
  res.render('displayStudent');
});
//This http request will render the updateStudent page.
app.get('/updateStudent', function (req, res) {
  res.render('updateStudent');
});
//This http request will render the deleteStudent page.
app.get('/deleteStudent', function (req, res) {
  res.render('deleteStudent');
});
//This http request will render the listStudents page.
app.get('/listStudents', function (req, res) {
  res.render('listStudents');
});
//This http request will render the index page.
app.get('/', function (req, res) {
  res.render('index');
});


app.listen(5678); //start the server
console.log('Server is running...');