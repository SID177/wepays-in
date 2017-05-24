const mong=require('./res/connection.js');
const bcrypt=require('bcryptjs');
var userSchema=new mong.Schema({
	college_id: {
		type: String,
		required: true,
		unique: true,
	},
	college_email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	college: {
		type: String,
		required: true,
	},
	course: {
		type: String,
		required: true,
	},
	start_year: {
		type: Number,
		required: true,
	},
	end_year: {
		type: Number,
		required: true,
	},
	limit: {
		type: Number,
		required: true,
		default: 20000
	},
	documents: {
		type: [String]
	},
	docVerified: {
		type: Boolean,
		default: false
	}
});
userSchema.statics.listAllUsers=function(cb){
	return this.find({},cb);
};
userSchema.statics.findByParam=function(obj,cb){
	return this.find(obj,cb);
};
userSchema.statics.getUserById=function(id,cb){
	return this.find({_id: id.toString()},cb);
};
userSchema.statics.addUser=function(data,cb){
	var model=this;
	return bcrypt.genSalt(10, function(err, salt) {
	    return bcrypt.hash(data.password, salt, function(err, hash) {
	        data.password=hash;
	        return model.create(data,cb);
	    });
	});
};
userSchema.statics.updateUser=function(data,cb){
	return this.findOneAndUpdate({_id:data._id.toString()},data,{upsert:true},cb);
};
userSchema.statics.loginUser=function(email_id,password,cb){
	return this.findOne({college_email:email_id},function(err,result){
		if(err)
			return cb(err,null)
		if(!result)
			return cb('Invalid username or password',null)
		return bcrypt.compare(password, result.password, function(err, status) {
			if(err){
				return cb(err,null);
			}
			if(status)
				return cb(null,result);
			else
				return cb('Invalid username or password',null);
		});
	});
};
var userModel=mong.model('user_details',userSchema);
module.exports=userModel;