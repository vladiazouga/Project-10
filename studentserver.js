//studentserver.js

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")

 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public'));

/** 
 * @constructor Student
* @param {string} first_name - first name of student
* @param {string} last_name - last name of student
* @param {number} gpa - gpa of student
* @param {boolean} enrolled - enrolled status of student
* @returns {object} - record_id and message
*/


app.post('/students', function(req, res) {
  var record_id = new Date().getTime();

  var obj = {};
  obj.record_id = record_id;
  obj.first_name = req.body.first_name;
  obj.last_name = req.body.last_name;
  obj.gpa = req.body.gpa;
  obj.enrolled = req.body.enrolled;

  var str = JSON.stringify(obj, null, 2);

/**
 * @function writeFile
 * @param {string} fname - name of file to write
 * @param {string} str - string to write to file
 * @param {function} callback - callback function
 * @returns {object} - record_id and message
 * @description - writes a string to a file
 * 
 */

  fs.writeFile("students/" + record_id + ".json", str, function(err) {
    var rsp_obj = {};
    if(err) {
      rsp_obj.record_id = -1;
      rsp_obj.message = 'error - unable to create resource';
      return res.status(200).send(rsp_obj);
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'successfully created';
      return res.status(201).send(rsp_obj);
    }
  }); //end writeFile method
  
}); //end post method

//looks up one student by record id
/**
 * @constructor getStudent
 * @param {string} record_id - record id of student
 * @returns {object} - student object
 * @description - looks up a student by record id
 * 
 */
app.get('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;

  fs.readFile("students/" + record_id + ".json", "utf8", function(err, data) {
    if (err) {
      var rsp_obj = {};
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    } else {
      return res.status(200).send(data);
    }
  });
}); 

/**
 * @function readFiles
 * @param {array} files - array of files to read
 * @param {array} arr - array to store data
 * @param {object} res - response object
 * @returns {object} - list of students
 * @description - reads files and returns a list of students
 * 
 */

function readFiles(files,arr,res) {
  fname = files.pop();
  if (!fname)
    return;
  fs.readFile(fname, "utf8", function(err, data) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    } else {
      arr.push(JSON.parse(data));
      if (files.length == 0) {
        var obj = {};
        obj.students = arr;
        return res.status(200).send(obj);
      } else {
        readFiles(files,arr,res);
      }
    }
  });  
}

//get all students
/**
 * @constructor getStudents
 * @returns {object} - list of students
 * @description - looks up all students
 * 
 */
app.get('/students', function(req, res) {
  var obj = {};
  var arr = [];
  filesread = 0;
  /**
   * 
   * @function glob
   * @param {string} pattern - pattern to match
   * @param {object} options - options object
   * @param {function} callback - callback function
   * @returns {object} - list of students
   * @description - looks up all students
   * 
   */

  glob("students/*.json", null, function (err, files) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    }

    readFiles(files,[],res);
  
  });

});


/**
 * @constructor updateStudent
 * @param {string} record_id - record id of student
 * @returns {object} - record_id and message
 * @description - updates a student by record id
 * 
 */

app.put('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;
  var fname = "students/" + record_id + ".json";
  var rsp_obj = {};
  var obj = {};

  obj.record_id = record_id;
  obj.first_name = req.body.first_name;
  obj.last_name = req.body.last_name;
  obj.gpa = req.body.gpa;
  obj.enrolled = req.body.enrolled;

  var str = JSON.stringify(obj, null, 2);

  //check if file exists
  /**
   * @function stat
   * @param {string} fname - name of file to check
   * @param {function} callback - callback function
   * @returns {object} - record_id and message
   * @description - checks if a file exists
   * 
   */
  fs.stat(fname, function(err) {
    if(err == null) {

      //file exists
      /**
       * @function writeFile
       * @param {string} fname - name of file to write
       * @param {string} str - string to write to file
       * @param {function} callback - callback function
       * @returns {object} - record_id and message
       * @description - writes a string to a file
       * 
       */
      fs.writeFile("students/" + record_id + ".json", str, function(err) {
        var rsp_obj = {};
        if(err) {
          rsp_obj.record_id = record_id;
          rsp_obj.message = 'error - unable to update resource';
          return res.status(200).send(rsp_obj);
        } else {
          rsp_obj.record_id = record_id;
          rsp_obj.message = 'successfully updated';
          return res.status(201).send(rsp_obj);
        }
      });
      
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    }

  });

}); //end put method

/**
 * @constructor deleteStudent
 * @param {string} record_id - record id of student
 * @returns {object} - record_id and message
 * @description - deletes a student by record id
 * 
 */
app.delete('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;
  var fname = "students/" + record_id + ".json";
/**
 * @function unlink
 * @param {string} fname - name of file to delete
 * @param {function} callback - callback function
 * @returns {object} - record_id and message
 * @description - deletes a file
 * 
 */
  fs.unlink(fname, function(err) {
    var rsp_obj = {};
    if (err) {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'record deleted';
      return res.status(200).send(rsp_obj);
    }
  });

}); //end delete method


app.listen(5678); //start the server
console.log('Server is running...');