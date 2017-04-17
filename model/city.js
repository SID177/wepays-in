const mong=require('./res/connection.js');
var citySchema=new mong.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	selectable: Boolean,
	deleted: Boolean,
});
citySchema.statics.listAllCities=function(cb){
	return this.find({},cb);
};
citySchema.statics.listCities=function(cb){
	return this.find({deleted:false},cb);
};
citySchema.statics.getCityById=function(id,cb){
	return this.find({_id: id.toString(), deleted: false, selectable: true},cb);
};
citySchema.statics.addCity=function(data,cb){
	return this.create({name: data.name, selectable: true, deleted: false},cb);
};
citySchema.statics.disableCity=function(id,status,cb){
	this.findOneAndUpdate({_id: id.toString()},{deleted:status},cb);
};
citySchema.statics.selectableCity=function(id,status,cb){
	this.findOneAndUpdate({_id: id.toString()},{selectable:status},cb);
};
var cityModel=mong.model('city',citySchema);
module.exports=cityModel;