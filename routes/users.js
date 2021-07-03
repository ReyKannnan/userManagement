var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var { check, validationResult } = require('express-validator');

var common  = require('../helper/common');

var users   = require('../models/users');
var details   = require('../models/usersdetail');
var project   = require('../models/usersproject');

exports.adddetails = function (req,res) {

	try {

		let info   = req.body;
		let userid = req.userId;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {
			details.findOne({$and : [{ "userId" : {$ne : userid}}, {"phone" : info.phone}]},(err,checkphone) => {
				if(!checkphone) {
					let obj = {
						"userId"     : userid,      
						"firstname"  : info.firstname,
						"lastname"   : info.lastname,
						"dob"        : info.dob,
						"phone"      : info.phone,
						"city"       : info.city,
						"state"      : info.state, 
						"country"    : info.country,
					}

					details.create(obj,function(err,data) {
						if(data) {
							return res.json({status : 1, msg : 'User details added successfully.'})
						} else {
							return res.json({status : 0, msg : 'Failed to add user details.'})
						}
					})
				} else {
					return res.json({status : 0, msg : 'This phone number already exists.'})
				}
			})
		}

	} catch (addErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.viewdetails = function (req,res) {

	try {

		let userid = req.userId;

		details.findOne({'userId' : mongoose.Types.ObjectId(userid)},{ _id : 0, userId : 0 },(err,userData) => {
			if(userData) {
				return res.json({status : 1, data : userData});
			} else {
				return res.json({status : 0, data : [], msg : 'No data found.'});
			}
		})

	} catch (viewErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.editdetails = function (req,res) {

	try {

		let info   = req.body;
		let userid = req.userId;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {
			details.findOne({$and : [{ "userId" : {$ne : userid}}, {"phone" : info.phone}]},(err,checkphone) => {
				if(!checkphone) {
					let obj = {
						"userId"     : userid,      
						"firstname"  : info.firstname,
						"lastname"   : info.lastname,
						"dob"        : info.dob,
						"phone"      : info.phone,
						"city"       : info.city,
						"state"      : info.state, 
						"country"    : info.country,
					}

					details.findOneAndUpdate({'userId' : mongoose.Types.ObjectId(userid)},obj,function(err,data) {
						if(data) {
							return res.json({status : 1, msg : 'User details updated successfully.'})
						} else {
							return res.json({status : 0, msg : 'Failed to update user details.'})
						}
					})
				} else {
					return res.json({status : 0, msg : 'This phone number already exists.'})
				}
			})
		}

	} catch (editErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.addproject = function (req,res) {

	try {

		let info   = req.body;
		let userid = req.userId;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {

			let obj = {
				"userId"      : userid,      
				"title"       : info.title,
				"startDate"   : info.startDate,
				"endDate"     : info.endDate,
				"description" : info.description,
				"teamcount"   : info.teamcount,
				"stack"       : info.stack, 
			}

			project.create(obj,function(err,data) {
				if(data) {
					return res.json({status : 1, msg : 'User project details added successfully.'})
				} else {
					return res.json({status : 0, msg : 'Failed to add user project details.'})
				}
			})
				
		}

	} catch (addErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.viewproject = function (req,res) {

	try {

		let userid = req.userId;

		project.find({'userId' : mongoose.Types.ObjectId(userid)},{ userId : 0 },(err,projectData) => {
			if(projectData.length > 0) {
				return res.json({status : 1, data : projectData});
			} else {
				return res.json({status : 0, data : [], msg : 'No data found.'});
			}
		})

	} catch (viewErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.editproject = function (req,res) {

	try {

		let info      = req.body;
		let userid    = req.userId;
		let projectid = info.projectId;

		let validationErr = validationResult(req);

		if(!validationErr.isEmpty()) {
			return res.json({status : 0, msg : validationErr.array()[0].msg});
		} else {
			
			let obj = {
				"userId"      : userid,      
				"title"       : info.title,
				"startDate"   : info.startDate,
				"endDate"     : info.endDate,
				"description" : info.description,
				"teamcount"   : info.teamcount,
				"stack"       : info.stack, 
				"status"      : info.status
			}

			project.findOneAndUpdate({'_id' : mongoose.Types.ObjectId(projectid)},obj,function(err,data) {
				if(data) {
					return res.json({status : 1, msg : 'User project details updated successfully.'})
				} else {
					return res.json({status : 0, msg : 'Failed to update project details.'})
				}
			})
				
		}

	} catch (editErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}
};

exports.deleteproject = function (req,res) {

	try {

		let projectid = req.params.id;

		project.deleteOne({'_id' : mongoose.Types.ObjectId(projectid)},(err,projectData) => {
			if(projectData.deletedCount == 1) {
				return res.json({status : 1, msg : 'Project details deleted successfully.'});
			} else {
				return res.json({status : 0, msg : 'Failed to delete project details.'});
			}
		})

	} catch (delErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}

};

exports.viewalldetails = function (req,res) {

	try {

		let userid = req.userId;

		users.aggregate([
		    { $match: { _id: mongoose.Types.ObjectId(userid) } },
		    { $project : { '_id' : 1, 'username' : 1 } },
		    {
		        $lookup:
		        {
		            from: "user_detail",
		            localField: "_id",
		            foreignField: "userId",
		            as: "detail"
		        }
		    },
		    {
		        $unwind: "$detail"
		    },
		    {
		        $lookup:
		        {
		            from: "user_project",
		            localField: "detail.userId",
		            foreignField: "userId",
		            as: "project"
		        }
		    },

		]).then(result => {
			res.json({status: 1,data : result});
		}).catch(err => {
			res.json({status: 0,data : [], msg : 'No data found'})		
		});

	} catch (viewErr) {
		return res.json({status : 0, msg : 'Something went wrong.'});
	}	
}
