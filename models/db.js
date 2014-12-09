var mysql   = require('mysql');


/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'cwolf.cs.sonoma.edu',
    user: 'dnicholson',
    
    password: '003794055'
    //user: 'your_username',
    //password: 'your_password'
});

var dbToUse = 'dnicholson';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

connection.query(useDatabaseQry);

var createviewqry = 'drop view if exists allsubmissions;';
console.log(createviewqry);
connection.query(createviewqry);

createviewqry = 'create view allsubmissions as ('
		+'select S.StudentID,A.AssignmentID,S.FName,A.AssignmentName,ASUB.SubmissionText, ASUB.Grade '
		+'from AssignmentSubmission ASUB '
		+'join Assignment A on A.AssignmentID = ASUB.AssignmentID '
		+'join Student S on S.StudentID = ASUB.StudentID'
+');';
console.log(createviewqry);
connection.query(createviewqry);

createviewqry = 'drop view if exists classroster;'
console.log(createviewqry);
connection.query(createviewqry);

createviewqry = 'create view classroster as ('
	+'select S.StudentID,S.FName, S.LName, C.CourseName, C.CourseID '
	+'from Student S '
	+'join CourseEnrollment CE on S.StudentID = CE.StudentID '
	+'join Course C on C.CourseID = CE.CourseID '
	+'order by C.CourseName'
+');';
console.log(createviewqry);
connection.query(createviewqry);

exports.CreateStudent = function(info,callback) {
	var qry = 'insert into Student values (null,\''
	+info.FName
	+'\',\''
	+info.LName
	+'\',\''
	+info.Password
	+'\');';
	console.log(qry);
	connection.query(qry,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            
            callback(false, result);
        }
    );
}
exports.CreateInstructor = function(info,callback) {
	var qry = 'insert into Instructor values (null,\''
	+info.FName
	+'\',\''
	+info.LName
	+'\',\''
	+info.Password
	+'\');';
	console.log(qry);
	connection.query(qry,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            
            callback(false, result);
        }
    );
}

exports.GetAllClasses = function(callback) {
    connection.query('select * from Course;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.EnrollStudent = function(info,callback) {
	var qry = 'select StudentID from Student where FName = \''
	+info.FName
	+'\' and LName = \''
	+info.LName
	+'\' and Password = \''
	+info.Password
	+'\';';
	console.log (qry);
	connection.query(
		qry,
		function (err,result) {
			if (err) throw err;
			console.log(result.length);
			if (result.length != 1) {
				callback(false,false);
			}
				
			else {
				
				qry = 'insert into CourseEnrollment values ('
				+result[0].StudentID
				+','
				+info.CourseID
				+');';
				console.log(qry);
			    connection.query(qry,
			        function (err, result) {
			            if(err) {
			                console.log(err);
			                callback(true);
			                return;
			            }
			            callback(false, result);
			        }
			    );
		    }
	    }
    );
}
exports.EnrollInstructor = function(info,callback) {
	var qry = 'select InstructorID from Instructor where FName = \''
	+info.FName
	+'\' and LName = \''
	+info.LName
	+'\' and Password = \''
	+info.Password
	+'\';';
	console.log (qry);
	connection.query(
		qry,
		function (err,result) {
			if (err) throw err;
			console.log(result.length);
			if (result.length != 1) {
				callback(false,false);
			}
				
			else {
				
				qry = 'insert into CourseInstuctor values ('
				+result[0].InstructorID
				+','
				+info.CourseID
				+');';
				console.log(qry);
			    connection.query(qry,
			        function (err, result) {
			            if(err) {
			                console.log(err);
			                callback(true);
			                return;
			            }
			            callback(false, result);
			        }
			    );
		    }
	    }
    );
}
exports.GetStudentID = function(info,callback) {
	var qry = 'select StudentID from Student where FName = \''
	+info.FName
	+'\' and LName = \''
	+info.LName
	+'\';';
	console.log (qry);
	connection.query(
		qry,
		function (err,result) {
			if (err) throw err;
			if (result.length != 1 || result[0] === 'undefined') {
				callback(false,false);
			}
			else {
				console.log('Got StudentID : ' + result[0].StudentID);
				callback(false, {StudentID: result[0].StudentID});
			}
		}
	);
}
exports.GetInstructorID = function(info,callback) {
	var qry = 'select InstructorID from Instructor where FName = \''
	+info.FName
	+'\' and LName = \''
	+info.LName
	+'\' and Password = \''
	+info.Password
	+'\';';
	console.log (qry);
	connection.query(
		qry,
		function (err,result) {
			if (err) throw err;
			if (result.length != 1 || result[0] === 'undefined') {
				callback(false,false);
			}
			else {
				console.log('Got InstructorID : ' + result[0].InstructorID);
				callback(false, {InstructorID: result[0].InstructorID});
			}
		}
	);
}
		

exports.InsertAssignmentSubmission = function(info,callback) {
	
	exports.GetStudentID(
		info,
		function(err, result) {
			console.log('DB1 ' + result.StudentID);
			if (typeof result.StudentID === 'undefined') callback(false,false);
			else {
				var StudentID = result.StudentID;
				var placeholder = {
					StudentID: StudentID,
					AssignmentID: info.AssignmentID,
					SubmissionText: info.SubmissionText
				}
				qry = 'select * from AssignmentSubmission where StudentID = '
				+StudentID
				+' and AssignmentID = '
				+info.AssignmentID
				+';'
				
				console.log(qry);
				
				connection.query(
					qry,
					function (err,result) {
						if (err) throw err;
						console.log(result);
						if (result.length > 0) {
							console.log("Do an update");
							
							var today = new Date();
							qry = 'update AssignmentSubmission set SubmissionText = '
							+'\''
							+info.SubmissionText
							+'\',SubmissionYear = '
							+today.getFullYear()
							+',SubmissionMonth = '
							+today.getMonth()+1
							+',SubmissionDay = '
							+today.getDate()
							+',SubmissionTime = '
							+today.getMinutes() + today.getHours()*100
							+' where StudentID = '
							+StudentID
							+' and AssignmentID = '
							+info.AssignmentID
							+';';
							
							console.log (qry);
							
							connection.query(
								qry,
								function (err,result) {
									if (err) throw err;
									console.log(result);
									
									callback(true,placeholder);
								}
							);
							callback(true,placeholder);
						}
						else {
							var today = new Date();
							qry = 'insert into AssignmentSubmission values('
							+info.AssignmentID
							+','
							+StudentID
							+',\''
							+info.SubmissionText
							+'\','
							+today.getFullYear()
							+','
							+today.getMonth()+1
							+','
							+today.getDate()
							+','
							+today.getMinutes() + today.getHours()*100
							+',null);';
							
							console.log (qry);
							
							connection.query(
								qry,
								function (err,result) {
									if (err) throw err;
									console.log(result);
									
									callback(true,placeholder);
								}
							);
						}
					}
		    	);
			}
		}
	);
}

exports.GetAllAssignments = function(callback) {
    connection.query('select * from Assignment;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetAssignmentSub = function(info,callback) {
	exports.GetStudentID(
		info,
		function(err, result) {
			console.log('DB1 ' + result.StudentID);
			if (typeof result.StudentID === 'undefined') callback(false,false);
			else {
				var StudentID = result.StudentID;
				
				qry = 'select * from AssignmentSubmission where StudentID = '
				+StudentID
				+' and AssignmentID = '
				+info.AssignmentID
				+';'
				
				console.log(qry);
				
				connection.query(
					qry,
					function (err,result) {
						if (err) throw err;
						console.log(result);
						if (result.length != 1) {
							console.log("Duplicates or none");
							callback(false,false);
						}
						else {
							var placeholder = {
								StudentID: 		StudentID,
								AssignmentID: 	info.AssignmentID,
								FName: 			info.FName,
								LName: 			info.LName,
								Password: 		info.Password,
								SubmissionText: result[0].SubmissionText
							}
							callback (true, placeholder);
						}
					}
		    	);
			}
		}
	);
}

exports.GetGradesStudent = function(info,callback) {
		
	
	exports.GetStudentID(
		info,
		function(err, result) {
			console.log('DB1 ' + result.StudentID);
			if (typeof result.StudentID === 'undefined') callback(false,false);
			else {
				var StudentID = result.StudentID;
	
				var qry = 'select A.AssignmentName, ASUB.Grade from AssignmentSubmission ASUB '
				+'join Assignment A on A.AssignmentID = ASUB.AssignmentID '
				+'where ASUB.StudentID = '
				+StudentID
				+';';
				console.log(qry);
			    connection.query(
			    	qry,
			        function (err, result) {			            
			            callback(false, result);
			        }
			    );
		    }
	    }
    );
}

exports.CreateCourse = function(info,callback) {
	var qry = 'insert into Course values (null,\''
	+info.DepartmentName
	+'\',\''
	+info.CourseName
	+'\','
	+info.CourseNumber
	+',\''
	+info.Tags
	+'\');';
	
	console.log(qry);
    connection.query(
    	qry,
        function (err, result) {	
        	var placeholder = {
	        	DepartmentName: info.DepartmentName,
				CourseName: info.CourseName,
				CourseNumber: info.CourseNumber,
				Tags: info.Tags        	
        	}	            
            callback(false, info);
        }
    );

}

exports.CreateAssignment = function(info,callback) {
	var today = new Date();
	var qry = 'insert into Assignment values (null,'
	+info.CourseID
	+',\''
	+info.AssignmentName
	+'\',\''
	+info.AssignmentDescription
	+'\','
	+today.getFullYear()
	+','
	+today.getMonth()+1
	+','
	+today.getDate()
	+','
	+today.getMinutes() + today.getHours()*100
	+');';
	console.log(qry);
    connection.query(
    	qry,
        function (err, result) {	
        	var placeholder = {
	        	AssignmentName: info.AssignmentName,
				AssignmentDescription: info.AssignmentDescription,
        	}	            
            callback(false, info);
        }
    );

}

exports.ViewGrades = function(info,callback) {
		
	
	exports.GetInstructorID(
		info,
		function(err, result) {
			console.log('DB1 ' + result.InstructorID);
			if (typeof result.InstructorID === 'undefined') callback(false,false);
			else {
				var InstructorID = result.InstructorID;
	
				var qry = 'select * from allsubmissions where AssignmentID in ('
				+'select AssignmentID from CourseInstuctor where InstructorID = '
				+InstructorID
				+');';
				console.log(qry);
			    connection.query(
			    	qry,
			        function (err, result) {	
			            callback(false, result);
			        }
			    );
		    }
	    }
    );
}

exports.GradeAll = function(info,callback) {

	for (var i = 0; i < 10; i++) {
		for (var k = 0; k < 10; k++) {
			if (info[i+'_'+k] === 'undefined') {}
			else { 
				console.log(i+'_'+k+' ' +info[i+'_'+k]);
			}
		}
    }
    
	callback(false, info);
}
exports.GradeOne = function(info,callback) {

	exports.GetInstructorID(
		info,
		function(err, result) {
			console.log('DB1 ' + result.InstructorID);
			if (typeof result.InstructorID === 'undefined') callback(false,false);
			else {
				var placeholder = {
					FName: info.SFName,
					LName: info.SLName
				}
				exports.GetStudentID(
					placeholder,
					function(err, result) {
						console.log('DB2 ' + result.StudentID);
						if (typeof result.StudentID === 'undefined') callback(false,false);
						else {
							var StudentID = result.StudentID;
							var qry = 'update AssignmentSubmission set Grade = \''
							+info.Grade
							+'\' where StudentID = '
							+StudentID
							+' and AssignmentID = '
							+info.AssignmentID
							+';';
							
							console.log(qry)
							
						    connection.query(
						    	qry,
						    	function(err, result) {
									callback(true, result);
								}
							);
						}
					}
				);
			};
		}
	);
}
exports.ViewEnrollment = function(info, callback) {
	var qry = 'select * from classroster where CourseID = '
	+info.CourseID
	+';';
	console.log(qry);
    connection.query(
    	qry,
        function (err, result) {	
        	if (err) throw err;
            callback(true, result);
        }
    );
	
}

exports.Test = function(info,callback) {
	callback(false);
}