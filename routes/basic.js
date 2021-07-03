var express = require('express');
var router  = express.Router();
var { check, validationResult } = require('express-validator');

var common  = require('../helper/common');
var mail  = require('../helper/mail');

var users   = require('../models/users');

exports.test = function (req,res) {
	res.send('Success');
}

exports.register = function (req,res) {

	try {

		let info = req.body;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {
			users.findOne({'email' : info.email},(err,checkmail) => {
				if(!checkmail) {

					let expire = new Date();
					expire.setDate(expire.getDate() + 2);

					let obj = {
						username    : info.username.toLowerCase(),
						email       : info.email,
						password    : common.encrypt(info.password),
						expiryAt    : expire, 

					}
					users.create(obj, function(err,resData){
						if(resData) {
							mail.sendMail('accountactivate',info.email,resData._id,function(value) {
								console.log(value);

								if(value) {
									return res.json({status : 1, msg : 'Registered Successfully.'});
								} else {
									return res.json({status : 0, msg : 'Failed to sent mail.'})
								}
							})
						} else {
							return res.json({status : 0, msg : 'Failed to create user detail.'});
						}
					})

				} else {
					return res.json({status : 0, msg : 'This email is already registered.'});
				}
			})
		}

	} catch (regErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.login = function (req,res) {

	try {
		
		let info = req.body;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {
			users.findOne({'email' : info.email},(err,checkmail) => {
				if(!checkmail) {
					return res.json({status : 0, msg : 'This email does not exists.'});
				} else {
					console.log(info.password,'passss')
					users.findOne({'email' : info.email,'password' : common.encrypt(info.password)},(err,user) => {
						console.log(user,'user')
						if(user) {
							if(user.accountStatus == 'deactive') {
								res.json({status:0, msg : 'Please verify your account.'})
							} else {
								let jwtToken = common.createPayload(user._id)
								return res.json({status : 1, token : jwtToken, msg : 'Logged in Successfully.'});
							}
						} else {
							return res.json({status : 0, msg : 'Invalid email or password.'});
						}
					})
				}
			})
		}

	} catch (logErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}	
};

exports.accountactivate = function (req,res) {

	try {

		let id = decodeURIComponent(req.params.id);

		users.findOne({'_id' : id},(err,checkid) => {
			if(checkid) {

				let currdate = new Date();
				let expdate  = checkid.expiryAt;

				if(expdate != null && currdate.getTime() > expdate.getTime()) {
					return res.json({status : 0, msg : 'Activation link has been expired.'})
				}

				if(checkid.accountStatus == 'active') {
					return res.json({status : 0, msg : 'Account already verified.'});
				} else {

					users.findOneAndUpdate({'_id' : id}, {'$set' : {'accountStatus' : 'active', 'expiryAt' : ''}}, (err,upddata) => {
						if(upddata) {
							return res.json({status : 1, msg : 'Account activated Successfully.'});
						} else {
							return res.json({status : 0, msg : 'Please try again later.'})
						}
					})

				}

			} else {
				res.json({status : 0, msg : 'Please try again later.'})
			}

		});

	} catch (accErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.forgot = function (req,res) {

	try {

		let info = req.body;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {

			users.findOne({'email' : info.email},(err,checkmail) => {
				if(checkmail) {

					if(checkmail.accountStatus == 'active') {

						let id = {
				            OTP    : common.generateRandomNumber(6),
				            USERID : encodeURIComponent(checkmail._id)
				    	};

						mail.sendMail('forgot',info.email,id,function(value) {

							if(value) {

								let expire = new Date();
								expire.setMinutes(expire.getMinutes() + 15);	

								users.findOneAndUpdate({'email' : info.email}, {'$set' : { 'otp' : id.OTP, 'expiryAt' : expire  }}, (err,updatedoc) => {
									if(updatedoc) {
										return res.json({status : 1, msg : 'Mail sent your registered mail.'});
									} else {
										return res.json({status : 0, msg : 'Please try again later.'})
									}
								} )
							} else {
								return res.json({status : 0, msg : 'Failed to sent mail.'})
							}
						})

					} else {
						return res.json({status : 0, msg : 'Please activate your account.'});
					}

				} else {
					return res.json({status : 0, msg : 'This email is not exists.'});
				}
			})

		}
		
	} catch (forgotErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.reset = function (req,res) {

	try {

		let info = req.body;
		let id   = decodeURIComponent(info.userId);

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {

			users.findOne({'_id' : id},(err,checkid) => {
				if(checkid) {

					if(checkid.otp != info.otp) {
						return res.json({status : 0, msg : 'Invalid OTP.'});
					} else {

						console.log(info.password,'password')

						let obj = {
							password : common.encrypt(info.password),
						}

						users.findOneAndUpdate({'_id' : id}, obj, (err,upddata) => {
							if(upddata) {
								return res.json({status : 1, msg : 'password changed Successfully.'});
							} else {
								return res.json({status : 0, msg : 'Please try again later.'})
							}
						})

					}

				} else {
					res.json({status : 0, msg : 'Please try again later.'})
				}

			});

		}

	} catch (accErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}

};

