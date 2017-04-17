module.exports.execute=function(resource){
	const path=require('path');
	const router=resource.router;
	resource.app.use('/admin',router);

	var isLogin=function(req,res){
		if(!req.session.adminLogin){
			console.log('not logged in');
			return false;
		}
		return true;
	}
	resource1={
		router:router,
		isLogin:isLogin,
	};

	//ADD CONTROLLERS HERE
	require('./admin_login.js').execute(resource1);
	require('./admin_operations.js').execute(resource1);
};