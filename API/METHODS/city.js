const cityModel=require('../../model/city.js');

module.exports.getCities=function(cb){
	cityModel.listAllCities(function(err,cities){
		if(err){
			console.log(err);
			cb(err,null);
			return;
		}
		cb(null,cities);
		return;
	});
};

module.exports.getCityById=function(id,cb){
	cityModel.getCityById(id,function(err,city){
		if(err){
			console.log(err);
			cb(err,null);
			return;
		}
		if(city.length===0){
			console.log('invalid city id');
			cb('invalid city id',null);
			return;
		}
		cb(null,city);
	});
};

module.exports.addCity=function(city,cb){
	cityModel.addCity(city,function(err){
		if(err){
			console.log(err);
			cb(err);
			return;
		}
		cb(null);
	});
};

module.exports.enableCity=function(id,status,cb){
	cityModel.disableCity(id,status,function(err){
		if(err){
			console.log(err);
			cb(err);
			return;
		}
		cb(null);
	});
};