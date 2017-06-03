const requestModel=require('../../model/request.js');

module.exports.getRequests=function(cb){
	requestModel.listAllRequests(function(err,requests){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		cb(null,requests);
	});
};

module.exports.getRequestById=function(id,cb){
	requestModel.getRequestById(id,function(err,request){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		if(request.length===0){
			console.log('invalid request id');
			cb('invalid request id',null);
			return;
		}
		cb(null,request);
	});
};

module.exports.addRequest=function(request,cb){
	var user=require('./user.js');
	user.getUserById(request.user_id,function(err,user){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		requestModel.addRequest(request,function(err){
			if(err){
				console.log(err);
				const reader=require('properties-reader');
				const prop=reader('./API/files/admin.ini');
				cb(prop.get('err.user'));
				return;
			}
			cb(null);
		});
	});
};

module.exports.updateRequestStatus=function(id,obj,cb){
	requestModel.getRequestById(id,function(err,request){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'),null);
			return;
		}
		if(request.length===0){
			console.log('invalid request id');
			cb('invalid request id',null);
			return;
		}
		request=request[0];
		request.request_status=obj.status;
		request.action_reason=obj.reason;

		requestModel.updateRequest(request,function(err){
			if(err){
				console.log(err);
				const reader=require('properties-reader');
				const prop=reader('./API/files/admin.ini');
				cb(prop.get('err.user'),null);
				return;
			}
			cb(null,request);
		});
	});
};

module.exports.getRequestsByUser=function(user_id,cb){
	requestModel.findByParam({user_id:user_id},function(err,requests){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'),null);
			return;
		}
		cb(null,requests);
	});
};