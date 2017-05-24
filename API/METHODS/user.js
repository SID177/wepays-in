const userModel=require('../../model/user.js');
const method_college=require('./college.js');
const method_course=require('./course.js');
const method_city=require('./city.js');

module.exports.loginUser=function(username,password,cb){
	userModel.loginUser(username,password,function(err,result){
		if(err){
			console.log(err);
			return cb(err,null);
		}
		return joinUser(result,cb);
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
		return joinUser(result,cb);
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
		return joinUser(result,cb);
	});
};

module.exports.listNotApprovedUsers=function(cb){
	userModel.findByParam({docVerified:false},function(err,result){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		return joinUser(result,cb);
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
		return joinUser(result,cb);
	});
}


function joinUser(result,cb){
	var list1=[],list2=[],list3=[];
	for(var i=0;i<result.length;i++){
		list1.push(i);
		list2.push(i);
		list3.push(i);
		method_city.getCityById(result[list1[0]].city,function(err,city){
			if(err){
				console.log(err);
				return cb(err,null);
			}
			result[list1[0]].city=city[0];
			list1.shift();
			method_college.getCollegeById(result[list2[0]].college,function(err,college){
				if(err){
					console.log(err);
					return cb(err,null);
				}
				result[list2[0]].college=college[0];
				list2.shift();
				method_course.getCourseById(result[list3[0]].course,function(err,course){
					if(err){
						console.log(err);
						return cb(err,null);
					}
					result[list3[0]].course=course[0];
					list3.shift();
					
					if(list3.length==0)
					{
						return cb(null,result);
					}
				});
			});
		});
	}
}