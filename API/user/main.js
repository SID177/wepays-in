module.exports.execute=function(app){
	var isLogin=function(req){
		if(!req.session.userLogin){
			console.log('not logged in');
			return false;
		}
		return true;
	}
	resource={
		app:app,
		isLogin:isLogin,
	};

	//ADD CONTROLLERS HERE
	require('./user_login.js').execute(resource);
};