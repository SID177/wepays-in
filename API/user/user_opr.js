module.exports.execute=function(resource){
	const router=resource.app;
	const isLogin=resource.isLogin;
	const fileUpload=require('express-fileupload');
	const fs=require('fs');
	router.use(fileUpload());

	const method_city=require('../METHODS/city.js');
	const method_college=require('../METHODS/college.js');
	const method_course=require('../METHODS/course.js');
	const method_user=require('../METHODS/user.js');

	router.post('/upload_docs/:mode',function(req,res){
		var user=isLogin(req);
		if(!user){
			res.send({err_msg:'not logged in'});
			res.end();
			return;
		}
		if(req.params.mode==='remove'){
			method_user.getUserById(user._id,function(err,result){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}
				result[0].documents=[];
				method_user.updateUser(result[0],function(err){
					if(err){
						res.send({err_msg:err});
						res.end();
						return;
					}
					result.password='';
					req.session.user=result[0];
					res.send({data:result[0],suc_msg:'success'});
					res.end();
				});
			});
			return;
		}

		if(!req.files.file){
			console.log("html code changed");
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}
		var path='documents/'+user._id.toString()+'/';
		try{
			fs.mkdirSync(path);
			console.log('directory created: '+path);
		}catch(err){console.log('directory exists: '+path);}

		req.files.file.mv(path+''+req.files.file.name,function(err){
			if(err){
				try{
					fs.unlinkSync(path+''+req.files.file.name);
				}catch(err){}
				console.log('err while moving file, changes reverted!');
				res.send({err_msg:'err while moving file, changes reverted!'});
				res.end();
				return;
			}
			method_user.getUserById(user._id.toString(),function(err,result){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}

				if(req.params.mode==='new')
					result.documents=path+''+req.files.file.name;
				else
					result.documents.push(path+''+req.files.file.name);

				result.docVerified=false;
				method_user.updateUser(result,function(err){
					if(err){
						res.send({err_msg:err});
						res.end();
						return;
					}
					result.password='';
					req.session.user=result;

					console.log('success');
					res.send({data:result,suc_msg:'success'});
					res.end();
				});
			});
		});
	});


	router.get('/list_users',function(req,res){
		method_user.listUsers(function(err,result){
			res.send({data:result});
			res.end();
		});
	});

	router.post('/request/:what',function(req,res){
		var user=isLogin(req);
		if(!user){
			res.send({err_msg:'not logged in'});
			res.end();
			return;
		}
		if(!req.body.amt){
			res.send({err_msg:'html code changed!'});
			res.end();
			return;
		}
		if(req.params.what==='cash'){
			method_user.requestCash(user,req.body.amt,function(err,result){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}
				res.send({data:result,suc_msg:'success'});
				res.end();
			});
		}
	});
};