const express = require('express');
const knex = require('../config/knex').knex; 
const helper = require('../lib/helper');
const { getRandomNo } = require('../lib/function'); 
const { checkHeader, sellerAuth } = require('../middleware/valid'); 
const bcrypt = require("bcryptjs");

const router = express.Router();

  
//create bid
router.post("/bid",  checkHeader, (req, res) => {  
    const buyer_id = req.buyer.id; 
    const { product_id,  seller_id } = req.body;
    const bid_token = helper.generateOTP() + getRandomNo();    
    const created_at = new Date().toLocaleString(); 
    knex('bids')
    .insert({  product_id, buyer_id, seller_id, bid_token, created_at }).then( ( result ) => { 
    if(result) { 
         res.send({
                    status: 200,
                    message: 'Bid created successfully'
                    })
        } else {
            res.send({
                status: 404,
                message: 'Bid was not created'
            })
        }
    }).catch(err => {
      console.log(err);
    })
});

//fetch all bids seller

  router.get("/seller/bids", sellerAuth, (req, res) => {
     const seller_id = req.shop.shop_id;  
     knex('bids').where({seller_id})
     .join('products as p', 'bids.product_id', '=', 'p.id')
     .select('bids.*', 'p.product_name').then( (data) => {
       if(data) {
              res.send({
                  status: 200,
                  data
              })
          }
            
     }).catch(err => {
       console.log(err);
     })

  });
//fetch buyers bids
  router.get("/buyer/bids", checkHeader, (req, res) => {
     const buyer_id = req.buyer.id;  
     knex('bids').where({buyer_id})
     .join('products as p', 'bids.product_id', '=', 'p.id')
     .select('bids.*', 'p.product_name').then( (data) => {
       if(data) {
              res.send({
                  status: 200,
                  data
              })
          }
            
     }).catch(err => {
       console.log(err);
     })

  });

module.exports = router;