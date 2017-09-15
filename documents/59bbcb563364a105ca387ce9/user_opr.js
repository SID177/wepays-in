module.exports.execute=function(resource){
	const router=resource.app;
	const isLogin=resource.isLogin;
	const fileUpload=require('express-fileupload');
	const path_comp=require('path');
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
			method_user.getUserByIdNoJoin(user._id,function(err,result){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}
				result.documents=[];
				method_user.updateUser(result,function(err){
					if(err){
						res.send({err_msg:err});
						res.end();
						return;
					}

					var path='documents/'+user._id.toString()+'/';
					try{
						var files=fs.readdirSync(path);
						for(var i=0;i<files.length;i++)
							fs.unlinkSync(path+''+files[i]);
						fs.rmdirSync(path);
					}catch(err){console.log(err);}

					result.password='';
					req.session.user=result;
					res.send({data:result,suc_msg:'success'});
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
			method_user.getUserByIdNoJoin(user._id.toString(),function(err,result){
				if(err){
					console.log(err);
					res.send({err_msg:err});
					res.end();
					return;
				}

				result.documents.push(req.files.file.name);
				console.log(result.documents);

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

	router.get('/view_document/',function(req,res){
		var user=isLogin(req);
		if(!user){
			res.send({err_msg:'not logged in'});
			res.end();
			return;
		}
		console.log(user);

		if(!req.query.path){
			console.log('html code changed');
			res.send({err_msg:'html code changed'});
			res.end();
			return;
		}
		var path=__dirname+"/../../"+req.query.path;
		if(!fs.existsSync(path)){
			console.log('File doesn\'t exists: '+path);
			res.send({err_msg:'File doesn\'t exists: '+path});
			res.end();
			return;	
		}
		res.sendFile(path_comp.resolve(path));
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
		var requestObj={
			amt:req.body.amt,
			reason:req.body.reason?req.body.reason:null
		};
		if(req.params.what==='cash'){
			method_user.requestCash(user,requestObj,function(err){
				if(err){
					res.send({err_msg:err});
					res.end();
					return;
				}
				res.send({suc_msg:'success'});
				res.end();
			});
		}
	});
};