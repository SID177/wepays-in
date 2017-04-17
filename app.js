const express=require('express');
const parser=require('body-parser');
const session=require('express-session');
const app=express();
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
require('./API/admin/main.js').execute(app);
require('./API/user/main.js').execute(app);

app.listen(process.env.port || 4300);