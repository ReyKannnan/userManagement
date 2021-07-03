var express = require('express');
var router  = express.Router();

/*Common file*/
var common 	    = require('../helper/common');
var validation 	= require('../helper/validation');

var Basic 	= require('./basic');
var User 	= require('./users');

/*Basic API Routes*/
router.get('/test',Basic.test);
router.post('/register',validation.Register,Basic.register);
router.post('/login',validation.Login,Basic.login);
router.get('/accountactivate/:id',Basic.accountactivate);

router.post('/forgot',validation.forgot,Basic.forgot);
router.post('/reset',validation.reset,Basic.reset);

/*User details API Routes*/
router.post('/adddetails',validation.adddetails,common.jwtVerify,User.adddetails);
router.get('/viewdetails',common.jwtVerify,User.viewdetails);
router.post('/editdetails',validation.adddetails,common.jwtVerify,User.editdetails);


/*User project API Routes*/
router.post('/addproject',validation.addproject,common.jwtVerify,User.addproject);
router.get('/viewproject',common.jwtVerify,User.viewproject);
router.post('/editproject',validation.editproject,common.jwtVerify,User.editproject);
router.get('/deleteproject/:id',User.deleteproject);

/*GET API to fetch data from multiple collections*/
router.get('/viewalldetails',common.jwtVerify,User.viewalldetails);


module.exports = router;
