var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userManagement', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify : false },(err) => {
	if(!err) {
		console.log('MongoDB Connection Succeed!');
	} else {
		console.log(err);
	}
});
