const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path'); 
const fs = require('fs'); 
const cors = require("cors"); 
var routes = require('./models/index');
// var sms = require('./plugins/sms');
const app = express();
// app.use(cors());
app.use(express.static('views/'));
app.use('/uploads/products', express.static('uploads/products'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization");
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/api', routes); 
app.get('/', (req,res) => { 
	 console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
 res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'It works ooo!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
})
 
// Define PORT
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port);
    // var dos = slug.split(" ").forEach()
})

 