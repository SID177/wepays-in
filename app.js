const express=require('express');
const parser=require('body-parser');
const session=require('express-session');
const app=express();
app.set('view engine','ejs');
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(session({
	secret: 'anything',
	resave: false,
	saveUninitialized: false
}));
const user_router=express.Router();
const admin_router=express.Router();

var user_resource={
	app:app,
	router:user_router,
};
var admin_resource={
	app:app,
	router:admin_router,
};

require('./controller/admin/main.js').execute(admin_resource);
require('./controller/user/main.js').execute(user_resource);

app.listen(process.env.port || 4200);