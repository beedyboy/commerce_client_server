const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper'); 
const fs = require('fs');

const router = express.Router();
 
//get stocks details by id
router.get("/:id", (req, res) => {
	const id = req.params.id;
	const result = db('stocks').where({id}).select().then( ( data ) => { 
	  if(data) {
		  res.send({
			  status: 200,
			  data
		  })
	  } else {
		res.send({
		  status: 400,
		  message: "Wrong information provided"
		});
	  
		}
	  
		});
});


//get all stocks in a product
router.get("/product/:id", (req, res) => {  
  const product_id = req.params.id;
  db('stocks').where({product_id})
  .select().then( ( data ) => {    
	   res.status(200).json({
		 status: 200,
		 data
	   })
		});
});

//create a new stocks
router.post("/", (req, res) => {   
  try {
	const { stock_name, first_delivery, second_delivery,
			third_delivery, within_distance, within_charge,
			beyond_distance, beyond_charge, quantity, weight, packed,
			price, product_id } = req.body; 
  const created_at = new Date().toLocaleString();  

  db('stocks').insert({  stock_name, first_delivery, second_delivery, third_delivery, within_distance, within_charge, beyond_distance, beyond_charge, quantity, weight, packed, price, product_id, created_at }).then( ( result ) => {  
  if(result) { 
	  res.send( {
		  status: 200,
		  message: 'Stock created successfully'
		  } );
  } else {
	  res.send({
		  status: 204,
		  message: 'Stock was not created'
	  })
  }
  });
  } catch(err) {
  console.log({err});
  res.status(500).json({
	message: "Something went wrong!!!"
  })
  } 
}); 

// feature stock
router.post("/feature", (req, res) => {   
	 try {
		 const {status, id, product_id} = req.body;  
	  const updated_at = new Date().toLocaleString(); 
	 db('stocks').where({product_id}).update('featured', 'No')
	 .update('updated_at', updated_at)
	.then( ( data ) => {  
	  if(data > 0) {
		  db('stocks').where({id}).update('featured', 'Yes').then( (featured) => {
			if(featured > 0) {
			   res.send({
				   status: 200, 
				   message: "Stock now featured" 
				});
			}
			 else {
		  res.send({
		  status: 400,
		  message: "Error updating status"  
		});
		}
		  }) 
	  }
		else {
		  res.send({
		  status: 400,
		  message: "Error updating status" 
		});
		} 
	  
	   }).catch(error =>  {
		console.log('error', error);
		res.send({
		  status: 400,
		  message: error
		})
	  });
	 } catch(error) {
	   console.log(error);
	   res.status(500).json({
		message: "Something went wrong with the request"
	   })
	 }               
	});
  

//check whether stocks exist
router.post("/update", (req, res) => {  
if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  console.log('token', req.headers.authorization.split(' ')[1]);
} 
	const {id, name: mod_name} = req.body ;
	const updated_at = new Date().toLocaleString();
  db('stocks').where('id', id).update( { mod_name,  updated_at })
  .then( ( data ) => {  
	if(data) {
	  res.send({
	  status: 200, 
	  message: "Stock updated successfully" 
	 });
	}
	  else {
		res.send({
		status: 400,
		message: "Error updating stocks" 
	  });
	  }
	
	
	 });
			 
});

stocks.exports = router;