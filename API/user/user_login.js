module.exports.execute=function(resource){
	const router=resource.app;

	const method_city=require('../METHODS/city.js');
	const method_college=require('../METHODS/college.js');
	const method_course=require('../METHODS/course.js');
	const method_user=require('../METHODS/user.js');

	router.get('/user_logout',function(req,res){
		req.session.userLogin=undefined;
		res.send({suc_msg:'success'});
		res.end();
	});

	router.post('/user_login',function(req,res){
		if(!req.body.username || !req.body.password){
			res.send({err_msg:'HTML CODE CHANGED!'});
			res.end();
			return;
		}
		method_user.loginUser(req.body.username,req.body.password,function(err,user){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			req.session.userLogin=user;
			res.send({data:user,suc_msg:'success'});
			res.end();
		});
	});

	router.post('/registration',function(req,res){
		if(!req.body.college_id || !req.body.college_email || !req.body.password || !req.body.first_name || !req.body.last_name || !req.body.city || !req.body.college || !req.body.course || !req.body.start_year || !req.body.end_year){
			res.send({err_msg:'HTML CODE CHANGED'});
			res.end();
			return;
		}

		method_city.getCityById(req.body.city,function(err,city){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			method_college.getCollegeById(req.body.college,function(err,college){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}
				method_course.getCourseById(req.body.course,function(err,course){
					if(err){
						res.send({err_msg:err});
						res.end();
						return;
					}

					var str=req.body.college_email.split('@');
					if(str[1]!==college[0].email_postfix){
						res.send({err_msg:'postfix mismatch'});
						res.end();
						return;
					}
					var data={college_id:req.body.college_id,college_email:req.body.college_email,password:req.body.password,first_name:req.body.first_name,last_name:req.body.last_name,city:city[0]._id,college:college[0]._id,course:course[0]._id,start_year:req.body.start_year,end_year:req.body.end_year};
					method_user.addUser(data,function(err){
						res.send({suc_msg:'success'});
						res.end();
					});
				});
			});
		});
	});

	router.post('/getCities',function(req,res){
		method_city.getCities(function(err,cities){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:cities,suc_msg:'success'});
			res.end();
		});
	});

	router.post('/getCollegeByCity',function(req,res){
		if(!req.body.city){
			console.log('city id not found');
			res.send({err_msg:'city ID not found'});
			res.end();
			return;
		}

		method_college.getCollegeByCity(req.body.city,function(err,colleges){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:colleges,suc_msg:'success'});
			res.end();
		});
	});

	router.post('/getCourseByCollege',function(req,res){
		if(!req.body.college){
			console.log('college id not found');
			res.send({err_msg:'college ID not found'});
			res.end();
			return;
		}

		method_course.getCourseByCollege(req.body.college,function(err,courses){
			if(err){
				res.send({err_msg:err});
				res.end();
				return;
			}

			res.send({data:courses,suc_msg:'success'});
			res.end();
		});
	});
};