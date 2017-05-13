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

		/*var docs=[],temp=[];
		//path='documents/'+user._id.toString()+'/';
		path='documents/tempuser/';
		try{
			fs.mkdirSync(path);
		}catch(err){}
		
		for(var i=0;i<req.files.file.length;i++){
			temp.push(i);
			req.files.file[i].mv(path+''+req.files.file[i].name,function(err){
				if(err){
					for(var j=i;j>=0;j--){
						try{
							fs.unlinkSync(path+''+req.files.file[i].name);
						}catch(err){}
					}

					console.log('err while moving file, changes reverted!');
					res.send({err_msg:'err while moving file, changes reverted!'});
					res.end();
					return;
				}
				docs.push(req.files.file[temp[0]].name);
				temp.splice(0,1);
				if(temp.length==0){
					console.log(docs);
					method_user.getUserById(user._id,function(err,result){
						if(err){
							res.send({err_msg:err});
							res.end();
							return;
						}

						if(req.params.mode==='new')
							result[0].documents=docs;
						else
							result[0].documents=docs.concat(result[0].documents);

						result[0].docVerified=false;
						console.log(result[0]);
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
				}
			});
		}*/
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