const mong=require('./res/connection.js');
var courseSchema=new mong.Schema({
	name: {
		type: String,
		required: true,
	},
	college: String,
	duration_month: Number,
	duration_year: Number,
	deleted: Boolean,
});
courseSchema.statics.listAllCourses=function(cb){
	return this.find({},cb);
};
courseSchema.statics.listCourses=function(cb){
	return this.find({deleted:false},cb);
};
courseSchema.statics.getCourseByNameAndCollege=function(name,clg,cb){
	return this.find({name:name,college:clg,deleted:false},cb);
};
courseSchema.statics.getCourseById=function(id,cb){
	return this.find({_id:id,deleted:false},cb);
};
courseSchema.statics.getCourseByCollege=function(clg,cb){
	return this.find({college:clg,deleted:false},cb);
};
courseSchema.statics.addCourse=function(data,cb){
	return this.create({name:data.name,college:data.college,duration_month:data.month,duration_year:data.year,deleted:false},cb);
};
var courseModel=mong.model('course',courseSchema);
module.exports=courseModel;