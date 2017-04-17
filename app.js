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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
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

app.listen(process.env.port || 4300);