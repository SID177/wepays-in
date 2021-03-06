const courseModel=require('../../model/course.js');

module.exports.getCourses=function(cb){
	courseModel.listAllCourses(function(err,courses){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		cb(null,courses);
	});
};

module.exports.getCourseById=function(id,cb){
	courseModel.getCourseById(id,function(err,course){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		if(course.length===0){
			console.log('invalid course id');
			cb('invalid course id',null);
			return;
		}
		cb(null,course);
	});
};

module.exports.getCourseByCollege=function(college,cb){
	courseModel.listCoursesByCollege(college,function(err,course){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		if(course.length===0){
			console.log('no courses found');
			cb('no courses found',null);
			return;
		}
		cb(null,course);
	});
};

module.exports.addCourse=function(course,cb){
	const college=require('./college.js');
	college.getCollegeById(course.college,function(err,college){
		if(err){
			console.log(err);
			const reader=require('properties-reader');
			const prop=reader('./API/files/admin.ini');
			cb(prop.get('err.user'));
			return;
		}
		courseModel.addCourse(course,function(err){
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