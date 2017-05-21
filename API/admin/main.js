module.exports.execute=function(app){
	var isLogin=function(req){
		if(!req.session.adminLogin){
			console.log('not logged in');
			return false;
		}
		return true;
	}
	resource={
		app:app,
		isLogin:isLogin
	};

	//ADD CONTROLLERS HERE
	require('./admin_login.js').execute(resource);
	require('./admin_operations.js').execute(resource);
};