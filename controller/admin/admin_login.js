module.exports.execute=function(resource){
	const router=resource.router;

	router.get('/authenticate',function(req,res){
		res.send({login: 'login page'});
		res.end();
		//res.render('hello');
	});

	router.get('/logout',function(req,res){
		req.session.adminLogin=undefined;
		res.send({suc_msg:'success'});
		res.end();
	});

	router.post('/login',function(req,res){
		console.log(req.body);
		if(!req.body.username || !req.body.password){
			console.log('HTML CODE CHANGED');
			res.send({err_msg:'HTML CODE CHANGED'});
			res.end();
			return;
		}
		const reader=require('properties-reader');
		const prop=reader('./controller/admin/files/admin.ini');
		var username=prop.get('login.admin.username');
		var password=prop.get('login.admin.password');
		
		if(username===req.body.username && password===req.body.password){
			req.session.adminLogin=true;
			console.log('login success');
			res.send({suc_msg:"success"});
			res.end();
			return;
		}
		res.send({err_msg:'invalid username or password'});
		res.end();
	});
};