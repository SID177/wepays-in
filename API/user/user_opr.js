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
		if(!req.files.docs){
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}

		var docs=[],temp=[];
		path='documents/'+user._id.toString()+'/';
		try{
			fs.mkdirSync(path);
		}catch(err){console.log(err);}
		
		for(var i=0;i<req.files.docs.length;i++){
			temp.push(i);
			req.files.docs[i].mv(path+''+req.files.docs[i].name,function(err){
				if(err){
					for(var j=i;j>=0;j--){
						try{
							fs.unlinkSync(path+''+req.files.docs[i].name);
						}catch(err){}
					}

					res.send({err_msg:'err while moving file, changes reverted!'});
					res.end();
					return;
				}
				docs.push(req.files.docs[temp[0]].name);
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
		}
	});


	router.get('/list_users',function(req,res){
		method_user.listUsers(function(err,result){
			res.send({data:result});
			res.end();
		});
	});
};