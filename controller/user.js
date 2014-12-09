var express = require('express');
var router  = express.Router();
var db   = require('../models/db');


/* View all users in a <table> */
router.get('/all', function (req, res) {
    db.GetAll(function (err, result) {
            if (err) throw err;
            res.render('displayUserTable.ejs', {rs: result});
        }
    );
});

/* View all posts in a <table> */
router.get('/showpostall', function (req, res) {
    db.GetAllPost(function (err, result) {
            if (err) throw err;
            res.render('displayPostTable.ejs', {rs: result});
        }
    );
});

/* Create a User */

// Create User Form
router.get('/create', function(req, res) {
    res.render('simpleform.ejs', {action: '/user/create'});
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.Insert(
    	req.body,
    	function (err, result) {
            if (err) throw err;

            if(result.UserID != 'undefined') {
                var placeHolderValues = {
                    Email: req.body.email,
                    Password: req.body.password
                };
                res.render('displayUserInfo.ejs', placeHolderValues);
            }
            else {
                res.send('User was not inserted.');
            }
        }
    );
});


// Create User Form
router.get('/post', function(req, res){
    res.render('postform.ejs', {action: '/user/post'});
});

// Save POST to the Database
router.post('/post', function (req, res) {
    db.Post(
    	req.body,
    	function (err, result) {
            if (err) throw err;

            if(result.AccountID != 'undefined') {
                var placeHolderValues = {
                    AccountID: req.body.accountid,
                    Post: req.body.post
                };
                res.render('displayPostInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Post was not made.');
            }
        }
    );
});

/* View a single user's information */
/* INCOMPLETE */
router.get('/', function (req, res) {
	console.log(req.query);
	db.GetUser(
		req.query,
		function (err, result) {
			if (err) throw err;
			
			if(result.UserID != 'undefined')
				res.send(result);
   		}
	);
});

/* View all users in a <table> */
router.get('/dropdown', function (req, res) {
    db.GetAllView(function (err, result) {
            if (err) throw err;
            res.render('displayUserDropDown.ejs', {rs: result});
        }
    );
});


router.post('/dropdown', function (req, res) {
	
    db.GetByID(req.body, function (err, result) {
            if (err) {
                throw err;
            }
            else if(typeof result[0].AccountID === 'undefined'){
                res.send('No user exists for that AccountID.');
            }
            else {
            	console.log (result[0].AccountID);
                res.render('displayUserPosts.ejs', {rs: result});
            }
        }
    );
});

router.post('/edit', function (req, res) {
	
    db.GetByID(req.body, function (err, result) {
            if (err) {
                throw err;
            }
            else if(typeof result[0].AccountID === 'undefined'){
                res.send('No user exists for that AccountID.');
            }
            else {
            	console.log (result[0].AccountID);
                res.render('displayUserPosts.ejs', {rs: result});
            }
        }
    );
});

module.exports = router;

