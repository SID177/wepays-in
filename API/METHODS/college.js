const collegeModel=require('../../model/college.js');

module.exports.getColleges=function(cb){
	collegeModel.listAllColleges(function(err,colleges){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		cb(null,colleges);
	});
};

module.exports.getCollegeById=function(id,cb){
	collegeModel.getCollegeById(id,function(err,college){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		if(college.length===0){
			console.log('invalid college id');
			cb('invalid college id',null);
			return;
		}
		cb(null,college);
	});
};

module.exports.getCollegeByCity=function(city,cb){
	collegeModel.listCollegesByCity(city,function(err,colleges){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		if(colleges.length===0){
			console.log('no colleges found');
			cb('no colleges found',null);
			return;
		}
		cb(null,colleges);
	});
};

module.exports.addCollege=function(college,cb){
	var city=require('./city.js');
	city.getCityById(college.city,function(err,city){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		collegeModel.addCollege(college,function(err){
			if(err){
				console.log(err);
				const reader=require('properties-reader');
				const prop=reader('./API/files/admin.ini');
				cb(prop.get('err.user'));
				return;
			}
			cb(null);
		});
	});
};