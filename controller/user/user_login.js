module.exports.execute=function(resource){
	const router=resource.router;

	//ADD MODELS HERE
	const userModel=require('../../model/user.js');
	const cityModel=require('../../model/city.js');
	const collegeModel=require('../../model/college.js');
	const courseModel=require('../../model/course.js');

	router.get('/login',function(req,res){
		console.log("user Login");
		console.log(req.url);
		//res.end();
		res.render('page');
	});

	router.get('/logout',function(req,res){
		req.session.adminLogin=undefined;
		res.send({suc_msg:'success'});
		res.end();
	});

	router.post('/login',function(req,res){
		if(!req.body.username || !req.body.password){
			res.send({err_msg:'HTML CODE CHANGED!'});
			res.end();
			return;
		}
		
		userModel.loginUser(req.body.username,req.body.password,function(result){
			if(!result){
				console.log('invalid username or password');
				res.send({err_msg:'invalid username or password'});
				res.end();
				return;
			}
			console.log(result);
			res.send({data:result,suc_msg:'success'});
			res.end();
		});
	});

	router.post('/getCities',function(req,res){
		cityModel.listCities(function(err,result){
			if(err){
				console.log(err);
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:result,suc_msg:'success'});
			res.end();
		});
	});

	router.post('/getColleges',function(req,res){
		if(req.body.city){
			collegeModel.getcollegesByCity(req.body.city,function(err,result){
				if(err){
					console.log(err);
					res.send({err_msg:err});
					res.end();
					return;
				}
				res.send({data:result,suc_msg:'success',parameter:req.body.city});
				res.end();
				return;
			});
		}
		collegeModel.listColleges(function(err,result){
			if(err){
				console.log(err);
				res.send({err_msg:err});
				res.end();
				return;
			}
			res.send({data:result,suc_msg:'success'});
			res.end();
		});
	});

	router.post('/registration',function(req,res){
		if(!req.body.college_id || !req.body.college_email || !req.body.password || !req.body.first_name || !req.body.last_name || !req.body.city || !req.body.college || !req.body.course || !req.body.start_year || !req.body.end_year){
			res.send({err_msg:'HTML CODE CHANGED'});
			res.end();
			return;
		}

		cityModel.getCityById(req.body.city,function(err,city){
			if(err){
				console.log(err);
				res.send({err_msg: err});
				res.end();
				return;
			}
			if(city.length==0){
				console.log('invalid city');
				res.send({err_msg: 'Invalid city'});
				res.end();
				return;
			}

			collegeModel.getCollegeById(req.body.college,function(err,college){
				if(err){
					console.log(err);
					res.send({err_msg: err});
					res.end();
					return;
				}
				if(college.length==0){
					console.log('invalid college');
					res.send({err_msg: 'Invalid college'});
					res.end();
					return;
				}

				courseModel.getCourseById(req.body.course,function(err,course){
					if(err){
						console.log(err);
						res.send({err_msg: err});
						res.end();
						return;
					}
					if(course.length==0){
						console.log('invalid course');
						res.end({err_msg: 'Invalid course'});
						res.end();
						return;
					}
					var str=req.body.college_email.split('@');
					if(str[1]!==college[0].email_postfix){
						res.send({err_msg:'postfix mismatch'});
						res.end();
						return;
					}

					userModel.addUser({college_id:req.body.college_id,college_email:req.body.college_email,password:req.body.password,first_name:req.body.first_name,last_name:req.body.last_name,city:city[0]._id,college:college[0]._id,course:course[0]._id,start_year:req.body.start_year,end_year:req.body.end_year},function(err){
						if(err){
							console.log(err);
							res.send({err_msg:err});
							res.end();
							return;
						}
						res.send({suc_msg:'success'});
						res.end();
					});
				});
			});
		});
	});

	router.get('/registration',function(req,res){
		cityModel.listCities(function(err,cities){
			if(err){
				console.log(err);
				res.send({err_msg:err});
				res.end();
			}

			collegeModel.listColleges(function(err,colleges){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}

				courseModel.listCourses(function(err,courses){
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
};