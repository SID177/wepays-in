const mong=require('mongoose');
mong.connect('mongodb://nameuser:wordpass@ds161400.mlab.com:61400/wepay');
mong.connection.once('open',function(){
	console.log('connection with db established');
}).on('error',function(error){
	console.log(error);
});
module.exports=mong;