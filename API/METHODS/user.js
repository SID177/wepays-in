const userModel=require('../../model/user.js');

module.exports.loginUser=function(username,password,cb){
	userModel.loginUser(username,password,function(result){
		if(!result){
			console.log('invalid username or password');
			cb('invalid username or password',null);
			return;
		}
		cb(null,result);
	});
};

module.exports.listUsers=function(cb){
	userModel.listAllUsers(function(err,result){
		if(err){
			console.log(err);
			cb(err,null);
			return;
		}
		cb(null,result);
	});
};

module.exports.addUser=function(data,cb){
	userModel.addUser(data,function(err){
		if(err){
			console.log(err);
			cb(err);
			return;
		}
		cb(null);
	});
};