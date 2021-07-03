var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var handlebars = require('handlebars');
var fs = require('fs');

const common = require('./common');


const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: '',
        pass: ''
    }
});

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = {
	sendMail : function(tempname, to, id, callback) {

		let path,replacements,subject;

		if(tempname == 'accountactivate') {

			path = '../userManagement/public/pages/activation.html';
			replacements = {
		         URLLINK: "http://localhost:3000/accountactivate/"+encodeURIComponent(id)
		    };
		    subject = 'Account Activation';

		} else {
			path = '../userManagement/public/pages/otp.html';
			replacements = id;
		    subject = 'Forgot OTP';
		}

		readHTMLFile(path, function(err, html) {
		    var template = handlebars.compile(html);
		    
		    var htmlToSend = template(replacements);

			let mailOptions = {
				from: '',
				to: to,
				subject: subject,
				html: htmlToSend
			}; 			

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log('error ' + error);
					callback(false);
				} else {
					console.log('Email sent: ' + info.response);
					callback(true);
				}
			});
			
		});
	}
};
