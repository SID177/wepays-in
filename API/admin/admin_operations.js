module.exports.execute=function(resource){
	const router=resource.app;
	var isLogin=resource.isLogin;

	const method_city=require('../METHODS/city.js');
	const method_college=require('../METHODS/college.js');
	const method_course=require('../METHODS/course.js');
	const method_user=require('../METHODS/user.js');

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
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		method_user.listUsers(function(err,result){
			res.send({data:result});
			res.end();
		});
	});

	router.get('/list_users/notapproved',function(req,res){
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
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
		if(!isLogin(req)){
			res.send({err_msg:'admin not logged in'});
			res.end();
			return;
		}
		var id=req.params.id;
		var status=req.params.status;

		method_user.getUserById(id,function(err,result){
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
};