module.exports.execute=function(resource){
	const router=resource.router;
	var isLogin=resource.isLogin;


	//ADD MODELS HERE
	const cityModel=require('../../model/city.js');
	const collegeModel=require('../../model/college.js');
	const courseModel=require('../../model/course.js');

	router.get('/authenticate',function(req,res){
		if(!isLogin(req,res)){
			res.send({err_msg:'not logged in'});
			res.end();
			return;
		}
		res.send({suc_msg: "logged in",user:req.session.userLogin});
		res.end();
	});

	router.get('/listAllCities',function(req,res){
		if(!isLogin(req,res)){
			//res.send({err_msg:'login first'});
			//res.end();
			//return;
		}

		console.log("LOGGED IN");
		cityModel.listAllCities(function(err,cities){
			if(err){
				console.log(err);
				res.send({err_msg:err});
				res.end();
				return;
			}

			collegeModel.listAllColleges(function(err,colleges){
				if(err){
					console.log(err);
					res.send({err_msg:err});
					res.end();
					return;
				}

				courseModel.listAllCourses(function(err,courses){
					if(err){
						console.log(err);
						res.send({err_msg:err});
						res.end();
						return;
					}

					res.send({cities: cities, colleges: colleges, courses: courses,suc_msg:'success'});
					res.end();
					return;
				});
			});
		});
	});

	router.post('/addCity',function(req,res){
		//if(!isLogin(req,res))
		//	return;
		if(!req.body.city){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var data={name: req.body.city};
		cityModel.addCity(data,function(err){
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

	router.post('/addCourse',function(req,res){
		//if(!isLogin(req,res))
		//	return;
		if(!req.body.name || !req.body.month || !req.body.year || !req.body.college){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var data={name: req.body.name,month: req.body.month,year: req.body.year,college: req.body.college};
		courseModel.addCourse(data,function(err){
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

	router.post('/addCollege',function(req,res){
		//if(!isLogin(req,res))
		//	return;
		if(!req.body.name || !req.body.email_postfix || !req.body.city){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var data={name: req.body.name, email_postfix: req.body.email_postfix, city: req.body.city};
		cityModel.getCityById(req.body.city,function(err,city){
			if(err){
				console.log(err);
				res.send({err_msg:err});
				res.end();
				return;
			}
			if(city.length===0){
				console.log('invalid city id');
				res.send({err_msg:'invalid city id'});
				res.end();
				return;
			}

			collegeModel.addCollege(data,function(err){
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

	router.post('/city_enable',function(req,res){
		if(!isLogin(req,res)){
			res.send({err_msg:'login first'});
			res.end();
			return;
		}
		if(!req.body.id){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var id=req.body.id;
		var status=req.body.status==="true"?false:true;
		cityModel.disableCity(id,status,function(err){
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

	router.post('/city_selectable',function(req,res){
		if(!isLogin(req,res)){
			res.send({err_msg:'login first'});
			res.end();
			return;
		}
		if(!req.body.id){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var id=req.body.id;
		var status=req.body.status==="true"?false:true;
		cityModel.selectableCity(id,status,function(err){
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
};