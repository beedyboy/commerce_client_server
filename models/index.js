const express = require('express'); 
const routes = express.Router();
const company = require('./company');
const auth = require('./auth');
const location = require('./location');
const category = require('./category');
const user = require('./user');
const shop = require('./shop');
const product = require('./product');



routes.use("/company", company);
routes.use("/auth", auth);
routes.use("/location", location);
routes.use("/category", category);
routes.use("/user", user);
routes.use("/shop", shop);
routes.use("/product", product);

module.exports = routes;

// const account = require('./company');
// const cors = require("cors"); 


// const API_URL = "http://commerce.devprima.com";
// const corsOptions = {
//     allowedHeaders: ["Origin"," X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
//     credentials: true,
//     methods: "GET,HEAD,OPTIONS,PUT,PATH,POST,DELETE",
//     origin: API_URL,
//     preflightContinue: false
// };

// var whitelist = ['http://192.168.43.13', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin) {
//     if (whitelist.indexOf(origin) !== -1) {
//       console.log("Allowed");
//     } else {
//       console.log('Not allowed by CORS');
//     }
//   }
// }

// routes.use(cors(corsOptions));

// routes.options("*", cors(corsOptions));
