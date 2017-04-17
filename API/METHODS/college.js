const collegeModel=require('../../model/college.js');

module.exports.getColleges=function(cb){
	collegeModel.listAllColleges(function(err,colleges){
		if(err){
			console.log(err);
			cb(err,null);
			return;
		}
		cb(null,colleges);
	});
};

module.exports.getCollegeById=function(id,cb){
	collegeModel.getCollegeById(id,function(err,college){
		if(err){
			console.log(err);
			cb(err,null);
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

module.exports.addCollege=function(college,cb){
	var city=require('./city.js');
	city.getCityById(college.city,function(err,city){
		if(err){
			console.log(err);
			cb(err);
			return;
		}
		collegeModel.addCollege(college,function(err){
			if(err){
				console.log(err);
				cb(err);
				return;
			}
			cb(null);
		});
	});
};