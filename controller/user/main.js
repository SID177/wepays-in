module.exports.execute=function(resource){
	const path=require('path');
	const router=resource.router;
	
	resource.app.set('views',path.join(__dirname,'../views/'));
	resource.app.use('/user',router);
	console.log(path.join(__dirname,'../views/'));

	var isLogin=function(req,res){
		if(!req.session.userLogin){
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
	require('./user_login.js').execute(resource1);
};