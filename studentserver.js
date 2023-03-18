//studentserver.js
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
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
const Model = mongoose.model('Data', info)

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
   const existingStudent = await Model.findOne({ first_name: req.body.first_name, last_name: req.body.last_name,});
   console.log(existingStudent)
   if (existingStudent) {
    return res.status(200).send("Student already exists");
   };
  const dataToSave = await data.save();
  return res.status(200).send("Success");

  

});




app.get('/students/:record_id', async function (req, res) {
  {
    console.log(req.params.record_id);
    //This will find the student by their id in the database and return the data.
    const data = await Model.findOne({ _id: req.params.record_id });
    res.status(200).send(data);

  }
});

app.get('/students', async function (req, res) {
  {
    //This will find all the students in the database and return the data.
    //It will wait for the data to be returned before sending the data.
    const data = await Model.find();
    res.status(200).send(data);

  }
});

app.delete('/students/:record_id', async function (req, res) {
  {
    //This will find the student by their id in the database and delete the data.
    const data = await Model.deleteOne({ _id: req.params.record_id });
    res.status(200).send(data);

  }
});

app.put('/students/:record_id', async function (req, res) {
  {
    //This will find the student by their id in the database and update the data.
    const data = await Model.updateOne({ _id: req.params.record_id }, { first_name: req.body.first_name, last_name: req.body.last_name, gpa: req.body.gpa, enrolled: req.body.enrolled });
    res.status(200).send(data);
    console.log(data)

  }
});







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