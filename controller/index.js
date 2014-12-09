var express = require('express');
var router = express.Router();
var db   = require('../models/db');

/* GET home page. */
router.get('/', function(req, res) {
	global.subtitle = 'Homepage';
    res.render('index', { title: 'Express' });
});

router.get('/AccountCreate', function(req, res) {
	global.subtitle = 'Create an Account';
    res.render('registerform', {action: '/AccountCreate'});
});
router.post('/AccountCreate', function (req, res) {
	if (req.body.UserType == 1) {
	    db.CreateStudent(
	    	req.body,
	    	function (err, result) {
	            if (err) throw err;
	            var placeHolderValues = {
	                Message: "Student Sucessfully Added!"
	            };
	            res.render('simplemessage', placeHolderValues);
	        }
	    );
    }
    else {
    	db.CreateInstructor(
	    	req.body,
	    	function (err, result) {
	            if (err) throw err;
	            var placeHolderValues = {
	                Message: "Instructor Sucessfully Added!"
	            };
	            res.render('simplemessage', placeHolderValues);
	        }
	    );
    }
});


router.get('/About', function(req, res) {
	global.subtitle = 'About this site';
	var message = [
		"This website was created by Dominic Nicholson.",
	   "It's main purpose is to store assignments that students submit\r\n",
	   "and allow instructors to grade them.\r\n",
	   "",
	   'Contact info:\n',
	   'Email: testemail@place.com'
   ];
	var placeHolderValues = {
        Message: message
    };
    res.render('multilinemessage', placeHolderValues);
});


//----Student functions ----------------------------------


router.get('/Enroll', function(req, res) {
	global.subtitle = 'Enroll in a course';
	db.GetAllClasses(
		function (err, result) {
			var placeHolderValues = {
        		action: '/Enroll',
        		rs: result
   			};
   			res.render('selectClass', placeHolderValues);
		}
	);
});
router.post('/Enroll', function (req, res) {
	res.render('finishenrollment.ejs', {CourseID: req.body.CourseID});
});
router.post('/EnrollmentComplete', function(req, res) {
	if (req.body.UserType == 1) {
		db.EnrollStudent(
			req.body,
			function (err, result) {
				if (err) {
					res.send("Student not enrolled");
					throw err;
				}
				if (result == false)
					res.render('simplemessage', {Message: "That login was incorrect!"});
				else 
		   			res.render('simplemessage', {Message: "Enrolment Sucessful!"});
			}
		);
	}
	else {
		db.EnrollInstructor(
			req.body,
			function (err, result) {
				if (err) {
					res.send("Instructor not enrolled");
					throw err;
				}
				if (result == false)
					res.render('simplemessage', {Message: "That login was incorrect!"});
				else 
		   			res.render('simplemessage', {Message: "Enrolment Sucessful!"});
			}
		);
	}
});


router.get('/Submit', function(req, res) {
	global.subtitle = 'Submit an assignment';
	db.GetAllAssignments(
		function (err, result) {
            if (err) throw err;
			var placeholder = { action: '/Submit', rs: result}
		    res.render('submitassignment', placeholder);
	    }
    );
});
router.post('/Submit', function (req, res) {
    db.InsertAssignmentSubmission(
    	req.body,
    	function (err, result) {
            //if (err) throw err;
            console.log('index.js ' + result.StudentID);
            if (result == false) {
            	res.render('simplemessage', {Message: "User does not exist!"});
        	}
            else {
            	res.render('simplemessage', {Message: "New Submission: " + result.SubmissionText});
        	}
        }
    );
});


router.get('/Edit', function(req, res) {
	global.subtitle = 'Edit an assignment submission';
    db.GetAllAssignments(
		function (err, result) {
            if (err) throw err;
			var placeholder = { action: '/Edit', rs: result}
		    res.render('selectassignment', placeholder);
	    }
    );
});
router.post('/Edit', function (req, res) {
	db.GetAssignmentSub(
		req.body,
		function (err, result) {
			if (result == false) {
				res.render('simplemessage', {Message: "Assignment does not exist!"});
			}
				
			else {
				var placeholder = {
					action: 		'/Submit',
					StudentID: 		result.StudentID,
					AssignmentID: 	result.AssignmentID,
					FName: 			result.FName,
					LName: 			result.LName,
					Password: 		result.Password,
					SubmissionText:	result.SubmissionText
				}
				res.render('editassignment.ejs', placeholder);
			}
		}
	);
});



router.get('/MyGrades', function(req, res) {
	global.subtitle = 'View your grades';
    res.render('simpleform', { action: '/MyGrades'});
});
router.post('/MyGrades', function (req, res) {
    db.GetGradesStudent(
    	req.body,
    	function (err, result) {
    		if (result == false)
				res.render('simplemessage', {Message: "No grades were found!"});
	        else res.render('mygrades', {rs: result});
	    }
    );
});


//----Instructor functions ----------------------------------


router.get('/CreateCourse', function(req, res) {
	global.subtitle = 'Set up a new course';
	var placeholder = {
		action: 		'/CreateCourse',
	}
    res.render('createcourse', placeholder);
});
router.post('/CreateCourse', function (req, res) {
    db.CreateCourse(
    	req.body,
    	function (err, result) {
            if (err) throw err;
            res.render('displaycourse.ejs', result);
        }
    );
});


router.get('/CreateAssignment', function(req, res) {
	global.subtitle = 'Create a new Assignment';
	db.GetAllClasses(
		function (err, result) {
    		res.render('createassignment', { action: '/CreateAssignment', rs: result });
		}
	);
});
router.post('/CreateAssignment', function (req, res) {
    db.CreateAssignment(
    	req.body,
    	function (err, result) {
            if (err) throw err;
            res.render('displayassignment.ejs', result);
        }
    );
});


router.get('/GradeAssignment', function(req, res) {
	global.subtitle = 'View all grades for a class';
	db.GetAllAssignments(
		function(err,result) {
			res.render('gradeassignment', { action: '/GradeAssignment', rs: result});
		}
	);
});
router.post('/GradeAssignment', function(req, res) {
	db.GradeOne(
		req.body,
		function(err, result) {
	        if (result == false)
				res.render('simplemessage', {Message: "Your login info was incorrect!"});
				
	        else res.render('simplemessage.ejs', {Message: 'Assignment Graded Sucessfuly'});
		}
	);
});

router.get('/ViewEnrollment', function(req, res) {
	global.subtitle = 'View all enrolled students';
	db.GetAllClasses(
		function (err, result) {
    		res.render('selectClass', { action: '/ViewEnrollment', rs: result});
		}
	);
    
});
router.post('/ViewEnrollment', function (req, res) {
    db.ViewEnrollment(
    	req.body,
    	function (err, result) {
            res.render('displayUserTable.ejs', {rs: result});
        }
    );
});




module.exports = router;

