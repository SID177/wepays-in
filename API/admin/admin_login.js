module.exports.execute=function(resource){
	const router=resource.app;

	router.get('/admin_logout',function(req,res){
		req.session.adminLogin=undefined;
		res.send({suc_msg:'success'});
		res.end();
	});

	router.post('/admin_login',function(req,res){
		console.log(req.body);
		if(!req.body.username || !req.body.password){
			console.log('HTML CODE CHANGED');
			res.send({err_msg:'HTML CODE CHANGED'});
			res.end();
			return;
		}
		const reader=require('properties-reader');
		const prop=reader('./API/files/admin.ini');
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