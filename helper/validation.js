var { check, validationResult } = require('express-validator');

exports.Register = [
	check('username').notEmpty().withMessage('Username is required'),
	check('email').notEmpty().withMessage('Email is required')
	.isEmail().withMessage('Invalid email'),
	check('password').notEmpty().withMessage('Password is required')
	.isLength({min : 8}).withMessage('Enter atleast 8 characters'),
	check('confirmpassword').notEmpty().withMessage('Confirm Password is required')
	.custom((value, {req}) => (value === req.body.password)).withMessage('Please enter same password')
];

exports.Login = [
	check('email').notEmpty().withMessage('Email is required')
	.isEmail().withMessage('Invalid email'),
	check('password').notEmpty().withMessage('Password is required')
	.isLength({min : 8}).withMessage('Enter atleast 8 characters')
];

exports.forgot = [
	check('email').notEmpty().withMessage('Email is required')
	.isEmail().withMessage('Invalid email')
];

exports.reset = [
	check('userId').notEmpty().withMessage('User id is required'),
	check('otp').notEmpty().withMessage('OTP is required'),
	check('password').notEmpty().withMessage('Password is required')
	.isLength({min : 8}).withMessage('Enter atleast 8 characters'),
	check('confirmpassword').notEmpty().withMessage('Confirm Password is required')
	.custom((value, {req}) => (value === req.body.password)).withMessage('Please enter same password')
];


exports.adddetails = [
	check('firstname').notEmpty().withMessage('Firstname is required'),
	check('lastname').notEmpty().withMessage('Lastname is required'),
	check('dob').notEmpty().withMessage('DOB is required'),
	check('phone').notEmpty().withMessage('Phone is required'),
	check('city').notEmpty().withMessage('City is required'),
	check('state').notEmpty().withMessage('State is required'),
	check('country').notEmpty().withMessage('Country is required')
];

exports.addproject = [
	check('title').notEmpty().withMessage('Project title is required'),
	check('startDate').notEmpty().withMessage('Startdate is required'),
	check('endDate').notEmpty().withMessage('Enddate is required'),
	check('description').notEmpty().withMessage('Description is required'),
	check('teamcount').notEmpty().withMessage('Teamcount is required'),
	check('stack').notEmpty().withMessage('Project stack is required')
];

exports.editproject = [
	check('projectId').notEmpty().withMessage('Project id is required'),
	check('title').notEmpty().withMessage('Project title is required'),
	check('startDate').notEmpty().withMessage('Startdate is required'),
	check('endDate').notEmpty().withMessage('Enddate is required'),
	check('description').notEmpty().withMessage('Description is required'),
	check('teamcount').notEmpty().withMessage('Teamcount is required'),
	check('stack').notEmpty().withMessage('Project stack is required'),
	check('status').notEmpty().withMessage('Project status is required')
];
