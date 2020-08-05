const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper');
const {validate, checkHeader, sellerAuth} = require('../middleware/valid'); 
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const util = require('../config/util').get(process.env.NODE_ENV);
const mailer = require("../plugins/mailer");
// const router = require('express').Router;

const router = express.Router();

//check if 
router.get("/:email/exist", (req, res) => { 
   try {
	 const email = req.params.email;  
	 db('staffs').where({email}).select('email').then( ( data ) => {  
	 if(data.length > 0) {
	  res.send({exist: true});
	} else {
	   res.send({exist: false});
	 } 
	
	}); 
  } catch (err) {
	console.log(err);
  }

});
 

//extend seller 
router.post("/extend/seller", checkHeader, (req, res) => {  
	const {  login_id, email, firstname, lastname, phone_number } = req.buyer; 
	const created_at = new Date().toLocaleString();  
	db('shops').returning('id')
	.insert({created_at}).then((auth) => {
	  if(auth.length > 0) {
		var shop_id = auth[0];
		 db('sellers')
	.insert({   email, firstname, lastname, shop_id, phone_number, created_at }).then( ( result ) => { 
	if(result.length > 0) {   
		db('logins').where('id', login_id)
		.update('shop_id', result).then( reply => {  
		if(reply > 0)  { 
		   res.send({  status: 200,  message: 'Account created successfully' });
		} else {
		   res.send({  status: 404,  message: 'Account not created' });
		}
	});
	   
	  }  else {
			res.send({
				status: 404,
				message: 'Account was not created'
			})
		}
	}); 
	  } else {
		res.send({
		  status: 400,
		  message: "Account not created"
		})
	  }
	});
   
});


//extend buyer 
router.post("/extend/buyer", sellerAuth, (req, res) => {  
	const {  login_id, email, firstname, lastname, phone_number } = req.shop; 
	const created_at = new Date().toLocaleString();  

	 db('buyers')
	.insert({   email, firstname, lastname, phone_number, created_at }).then( ( result ) => { 
	if(result.length > 0) {   
		db('logins').where('id', login_id)
		.update('user_id', result).then( reply => {  
		if(reply > 0)  { 
		   res.send({  status: 200,  message: 'Account created successfully' });
		} else {
		   res.send({  status: 404,  message: 'Account not created' });
		}
	});
	   
	  }  else {
			res.send({
				status: 404,
				message: 'Account was not created'
			})
		}
	}); 

});

  
//register buyer 
router.post("/create/buyer", validate('logins'),  (req, res) => {   
	const { email} = req.body; 
	const password = helper.hash(req.body.password);
	const created_at = new Date().toLocaleString(); 
	const preferred = "BUYER";
	db('buyers')
	.returning('id')
	.insert({   email, created_at }).then( ( result ) => { 
	if(result.length > 0) {   
        const buyer_id = result[0];
		db('logins').insert({ buyer_id, preferred, email, password }).then( reply => {   
		if(reply)  {
		   res.send({  status: 200,  message: 'Account created successfully' });
		} else {
		   res.send({  status: 404,  message: 'Account not created' });
		}
	});
	   
	  }  else {
			res.send({
				status: 404,
				message: 'Account was not created'
			})
		}
	}).catch(err => {
	  console.log(err);
	}) 
});

//register seller
router.post("/create/seller", validate('logins'),  (req, res) => {   
	const { email, referrer} = req.body; 
	const password = helper.hash(req.body.password);
	const created_at = new Date().toLocaleString();  
	const preferred = "SELLER";
	 db('shops').returning('id')
	.insert({created_at}).then((shop) => {
	  if(shop.length > 0) {
		  db('sellers').returning('id')
		  .insert({ shop_id:shop[0], email, created_at }).then( ( result ) => { 
		  if(result.length > 0) {  
		db('logins').insert({shop_id: result[0], preferred,  email,  password}).then( reply => { 
		if(reply.length > 0)  {
		   res.send({  status: 200,  message: 'Account created successfully' });
		} else {
		   res.send({  status: 404,  message: 'Account not created' });
		}
	});
	   
	  }  else {
			res.send({
				status: 404,
				message: 'Account was not created'
			})
		}
	}); 
	  } else {
		res.send({
		  status: 404,
          message: 'Account was not created'
		})
	  }
	})

});

 
router.post("/auth", (req, res) => {
   const { email, referred, goto } = req.body; 
	db('logins').where({email}).select().then( (user ) => {
		if(user.length > 0) {
		const data = user[0];
		if (bcrypt.compareSync(req.body.password, data.password)) {
			  const token = helper.generateToken(data);  
			  let took = '';
			  let tbl = '';
			  let id = 0;			  
			   // const took = preferred === "BUYERS" ? 'buyer_token' : 'seller_token';
			   if (referred === true) { 
				//if user intends to go to shop or user account
			   tbl = goto === "BUYERS" ? 'buyers' : 'sellers';
			   id = goto === "BUYERS" ? 'buyer_id' : 'seller_id';
				took = goto === "BUYERS" ? 'buyer_token' : 'seller_token';
			  } else { // goto default page
				const preferred = data.preferred;
				tbl = preferred === "BUYER" ? 'buyers' : 'sellers';
				id = preferred === "BUYER" ? 'buyer_id' : 'seller_id';
				took = preferred === "BUYER" ? 'buyer_token' : 'seller_token'; 
			  } 
			  helper.setSignature( data.id, took, token).then(rep => {
				user.token = token;
			  if( rep === true ) {
				const payload = db(tbl).where('id', data[id]).select().then(payload => {
				 if (tbl === "sellers") {
				  // res.cookie('access_token', token, {httpOnly: true}).json({
					 res.cookie('access_token', token).json({
					status: 200,
					payload,
					token,
					user,
					goto,
					msg: "Login successful", 
				  })
				 } else {
				  res.json({
					status: 200,
					payload,
					user,
					token,
					goto,
					msg: "Login successful", 
				  })
				 }
				})
			//     console.log('foreign', data[id], payload)
			  }
			// console.log('rep', rep); 
			})
 
	 
		} else {
			 res.send({
		  status: 400,
		  msg: "wrong email or password"
		});
		}
		}
	})
   
});


module.exports = router;

  