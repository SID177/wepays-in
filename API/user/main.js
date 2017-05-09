module.exports.execute=function(app){
	var isLogin=function(req){
		if(!req.session.userLogin){
			console.log('not logged in');
			return null;
		}
		return req.session.userLogin;
	}
	resource={
		app:app,
		isLogin:isLogin,
	};

	//ADD CONTROLLERS HERE
	require('./user_login.js').execute(resource);
	require('./user_opr.js').execute(resource);
};