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

module.exports.getUserById=function(id,cb){
	userModel.getUserById(id,function(err,result){
		if(err){
			console.log(err);
			return cb(err,null);
		}
		if(result.length==0){
			console.log('no user found');
			return cb('No User Found',null);
		}
		cb(null,result[0]);
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

module.exports.updateUser=function(data,cb){
	userModel.updateUser(data,function(err){
		if(err){
			console.log(err);
			cb(err);
			return;
		}
		cb(null);
	});
};

module.exports.requestCash=function(user,amt,cb){
	userModel.getUserById(user._id,function(err,result){
		if(err){
			console.log(err);
			return cb(err,null);
		}
		if(result.length==0){
			console.log("Invalid user ID");
			return cb("Invalid user ID",null);
		}
		if(!user.docVerified){
			err="Document verification is not done!";
			err+=user.documents.length==0?" (You haven't uploaded any documents yet)":"";
			console.log(err);
			return cb(err,null);
		}
		if(amt>user.limit){
			console.log("Limit exceed, only "+user.limit+" available");
			return cb("Limit exceed, only "+user.limit+" available",null);
		}
		result[0].limit-=amt;
		return cb(null,result[0]);
	});
}