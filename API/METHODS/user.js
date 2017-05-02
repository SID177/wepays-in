const userModel=require('../../model/user.js');

module.exports.loginUser=function(username,password,cb){
	userModel.loginUser(username,password,function(err,result){
		if(err){
			console.log(err);
			return cb(err,null);
		}
		cb(null,result);
	});
};

module.exports.listUsers=function(cb){
	userModel.listAllUsers(function(err,result){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		cb(null,result);
	});
};

module.exports.addUser=function(data,cb){
	userModel.addUser(data,function(err){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			var errmsg="";
			errmsg=err.code===11000?'User already exists!':prop.get('err.user');
			cb(errmsg);
			return;
		}
		cb(null);
	});
};