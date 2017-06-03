const mong=require('./res/connection.js');
var requestSchema=new mong.Schema({
	user_id: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true,
	},
	reason: {
		type: String
	},
	request_time: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	request_status: {
		type: String,
		required: true,
	},
	action_reason: {
		type: String
	}
});
requestSchema.statics.listAllRequests=function(cb){
	return this.find({},cb);
};
requestSchema.statics.findByParam=function(obj,cb){
	return this.find(obj,cb);
};
requestSchema.statics.getRequestById=function(id,cb){
	return this.find({_id: id.toString()},cb);
};
requestSchema.statics.addRequest=function(data,cb){
	return this.create(data,cb);
};
requestSchema.statics.updateRequest=function(data,cb){
	return this.findOneAndUpdate({_id:data._id.toString()},data,{upsert:true},cb);
};
var RequestModel=mong.model('Request_details',requestSchema);
module.exports=RequestModel;