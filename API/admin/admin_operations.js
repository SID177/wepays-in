module.exports.execute=function(resource){
	const router=resource.app;
	var isLogin=resource.isLogin;
	const path_comp=require('path');
	const fs=require('fs');

	const method_city=require('../METHODS/city.js');
	const method_college=require('../METHODS/college.js');
	const method_course=require('../METHODS/course.js');
	const method_user=require('../METHODS/user.js');
	const method_request=require('../METHODS/request.js');

	router.get('/admin_islogin',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		res.send({suc_msg:'success'});
		res.end();
	});

	router.get('/list_users',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		method_user.listUsers(function(err,result){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:result,suc_msg:'success'});
			res.end();
		});
	});

	router.get('/getUser/:id',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		var id=req.params.id;
		method_user.getUserById(id,function(err,result){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:result,suc_msg:'success'});
			res.end();
		});
	});

	router.get('/list_requests',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		method_request.getRequests(function(err,result){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			result[0].request_time=new Date(Number(result[0].request_time));
			res.send({data:result,suc_msg:'success'});
			res.end();
		});
	});

	router.get('/list_users/notapproved',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		method_user.listNotApprovedUsers(function(err,result){
			res.send({data:result});
			res.end();
		});
	});

	router.get('/list',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		
		method_city.getCities(function(err,cities){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			
			method_college.getColleges(function(err,colleges){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}

				method_course.getCourses(function(err,courses){
					if(err){
						res.send({err_msg:err});
						res.end();
						return;
					}

					res.send({cities:cities,colleges:colleges,courses:courses,suc_msg:'success'});
					res.end();
				});
			});
		});
	});

	router.post('/addCity',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		if(!req.body.city){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}
		method_city.addCity(req.body.city,function(err){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({suc_msg:'success'});
			res.end();
		});
	});

	router.post('/addCollege',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		if(!req.body.name || !req.body.email_postfix || !req.body.city){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var data={name: req.body.name, email_postfix: req.body.email_postfix, city: req.body.city};
		method_college.addCollege(data,function(err){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({suc_msg:'success'});
			res.end();
		});
	});

	router.post('/addCourse',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		if(!req.body.name || !req.body.month || !req.body.year || !req.body.college){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}
		var data={name: req.body.name,month: req.body.month,year: req.body.year,college: req.body.college};
		method_course.addCourse(data,function(err){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({suc_msg:'success'});
			res.end();
		});
	});

	router.post('/city_enable',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		if(!req.body.id || !req.body.status){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var id=req.body.id;
		var status=req.body.status==="true"?false:true;
		method_city.enableCity(id,status,function(err){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({suc_msg:'success'});
			res.end();
		});
	});

	router.get('/approveDocuments/:id/:status',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		var id=req.params.id;
		var status=req.params.status;

		method_user.getUserByIdNoJoin(id,function(err,result){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}

			if(status=='true')
				result.docVerified=true;
			else
				result.docVerified=false;

			method_user.updateUser(result,function(err){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}
				res.send({suc_msg:'success'});
				res.end();
			});
		});
	});

	router.get('/approveRequest/:id',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		var id=req.params.id;
		var obj={
			status:'approved',
			setReason:false,
			reason:null
		}
		method_request.updateRequestStatus(id,obj,function(err,request){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:request,suc_msg:'success'});
			res.end();
		});
	});
	router.get('/cancelRequest/:id',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		var id=req.params.id;
		var obj={
			status:'cancelled',
			setReason:true,
			reason:req.query.reason
		}
		method_request.updateRequestStatus(id,obj,function(err,request){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:request,suc_msg:'success'});
			res.end();
		});
	});
	router.get('/setRequestStatus/:id/:status',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		var id=req.params.id;
		var obj={
			status:req.params.status,
			setReason:false
		}
		method_request.updateRequestStatus(id,obj,function(err,request){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:request,suc_msg:'success'});
			res.end();
		});
	});

	router.get('/getRequests/user/:id',function(req,res){
		/*if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}*/
		var id=req.params.id;
		method_request.getRequestsByUser(id,function(err,requests){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:requests,suc_msg:'success'});
			res.end();
		});
	});

	router.get('/admin/view_document/',function(req,res){
		/*var user=isLogin(req);
		if(!user){
			res.send({err_msg:'not logged in'});
			res.end();
			return;
		}
		console.log(user);*/

		if(!req.query.path){
			console.log('html code changed');
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}
		var path=__dirname+"/../../"+req.query.path;
		if(!fs.existsSync(path)){
			console.log('File doesn\'t exists: '+path);
			res.send({err_msg:'File doesn\'t exists: '+path});
			res.end();
			return;	
		}
		res.sendFile(path_comp.resolve(path));
	});
};