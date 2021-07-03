var jwt = require('jsonwebtoken');
var jwtSecret = 'BookApplicationJWTsecret';

var CryptoJS = require("crypto-js");
var key = "#keyuserapp@user!";
var iv  = "BtarigaTcIroNiynbeiOoK";
		   		
key = CryptoJS.enc.Base64.parse(key);
iv = CryptoJS.enc.Base64.parse(iv);

exports.createPayload = function (key) {
  let payload = { secret : key }
  let token = jwt.sign(payload, jwtSecret, { expiresIn: '3600s' }); //expired 1 hour
  return token;    
}

exports.jwtVerify = function (req,res,next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if(!token){
    return res.json({status : 0, msg : "Unauthorized"});
  }
  token = token.split(' ')[1];
  if(token === 'null'){
    return res.json({status : 0, msg : "Unauthorized"});
  } else {
    let payload = jwt.verify(token, jwtSecret);
    if(!payload){
      return res.json({status : 0, msg : "Unauthorized"});
    }
    req.userId = payload.secret;
    next();
  }
};

exports.encrypt = function (txt) {
	return CryptoJS.AES.encrypt(txt, key,{iv:iv}).toString();
};

exports.decrypt = function (txt) {
	let bytes  = CryptoJS.AES.decrypt(txt.toString(), key, {iv:iv});
	return bytes.toString(CryptoJS.enc.Utf8);
};

exports.generateRandomNumber = function(len){
  let text = "";
  let possible = "0123456789";
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
