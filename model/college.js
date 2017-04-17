const mong=require('./res/connection.js');
var collegeSchema=new mong.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	email_postfix: String,
	city: String,
	deleted: Boolean,
});
collegeSchema.statics.listAllColleges=function(cb){
	return this.find({},cb);
};
collegeSchema.statics.listColleges=function(cb){
	return this.find({deleted:false},cb);
};
collegeSchema.statics.getCollegeByName=function(name,cb){
	return this.find({name: name,deleted:false},cb);
};
collegeSchema.statics.getCollegeById=function(id,cb){
	return this.find({_id: id.toString(),deleted:false},cb);
};
collegeSchema.statics.listCollegesByCity=function(city,cb){
	return this.find({city:city,deleted:false},cb);
};
collegeSchema.statics.addCollege=function(data,cb){
	return this.create({name: data.name,email_postfix:data.email_postfix,city:data.city,deleted:false},cb);
};
var collegeModel=mong.model('college',collegeSchema);
module.exports=collegeModel;