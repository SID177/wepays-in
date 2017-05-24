const express=require('express');
const parser=require('body-parser');
const session=require('express-session');
const reader=require('properties-reader');
const app=express();
app.use(express.static('documents'));
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));
app.use(session({
	secret: 'anything',
	resave: false,
	saveUninitialized: false
}));
app.use(function (req, res, next) {

    const prop=reader('headers.ini');
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', prop.get('Access-Control-Allow-Origin'));

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', prop.get('Access-Control-Allow-Methods'));

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', prop.get('Access-Control-Allow-Headers'));

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', prop.get('Access-Control-Allow-Credentials'));

    // Pass to next layer of middleware
    next();
});
require('./API/admin/main.js').execute(app);
require('./API/user/main.js').execute(app);

app.listen(process.env.port || 4300);