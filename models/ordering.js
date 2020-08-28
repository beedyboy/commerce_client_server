const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper');
const { getRandomNo } = require('../lib/function'); 
const { checkHeader, sellerAuth } = require('../middleware/valid'); 
const bcrypt = require("bcryptjs");

const router = express.Router();

  
//create bid
router.post("/bid",  checkHeader, (req, res) => {  
    const buyer_id = req.buyer.id; 
    const { stock_id,  shop_id } = req.body;
    const bid_token = helper.generateOTP() + getRandomNo();    
    const created_at = new Date().toLocaleString(); 
    db('bids')
    .insert({  stock_id, buyer_id, shop_id, bid_token, created_at }).then( ( result ) => { 
    if(result) { 
         res.send({
                    status: 200,
                    message: 'Bid created successfully'
                    })
        } else {
            res.send({
                status: 400,
                message: 'Bid was not created'
            })
        }
    }).catch(err => {
      console.log(err);
    })
});

//fetch all bids seller

  router.get("/seller/bids", sellerAuth, (req, res) => {
     const shop_id = req.shop.shop_id;  
     db('bids as b').where({shop_id})
     .join('stocks as s', 'b.stock_id', '=', 's.id')
     .join('products as p', 's.product_id', '=', 'p.id').
     join('shops as sh', 'b.shop_id', '=', 'sh.id')
     .join('buyers as by', 'b.buyer_id', '=', 'by.id')
     .select('b.*', 's.stock_name', 'p.product_name', 'sh.shop_name', 'by.email').then( (data) => {
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
    try {
      const buyer_id = req.buyer.id;  
      db('bids as b').where({buyer_id})
      .join('stocks as s', 'b.stock_id', '=', 's.id')
      .join('products as p', 's.product_id', '=', 'p.id').
      join('shops as sh', 'b.shop_id', '=', 'sh.id')
      .join('buyers as by', 'b.buyer_id', '=', 'by.id')
      .select('b.*', 's.stock_name', 'p.product_name', 'sh.shop_name', 'by.email').then( (data) => {
      console.log({data})
        if(data) {
               res.send({
                   status: 200,
                   data
               })
           } else {
            res.send({
              status: 400,
              msg: "Data not found!!!"
            });
          } 
      }).catch(err => {
        console.log(err);
      })
    } catch (error) {
      res.status(500).send({
        status: 500,
        msg: "Server error"
      })
    }

  });
  
  //get bid details in full
router.get("/bid/:id", (req, res) => {  
  try {
     const id = parseInt(req.params.id);
     console.log({id})
   db('bids as b').where({id})
   .join('stocks as s', 'b.stock_id', '=', 's.id')
   .join('products as p', 's.product_id', '=', 'p.id').
   join('shops as sh', 'b.shop_id', '=', 'sh.id')
   .join('buyers as by', 'b.buyer_id', '=', 'by.id')
   .select('s.*', 'b.stock_id', 'b.buyer_id', 'b.bid_token', 'b.shop_id', 'p.product_name', 'sh.shop_name', 'by.email').then( ( data ) => {  
     if(data) {
             res.send({
                 status: 200,
                 data
             })
         } else {
          res.send({
            status: 400,
            msg: "Data not found!!!"
          });
        }
      }).catch(err => {
             console.error('bid full details', err);
           })
   } catch(error) {
      console.log(error);
      res.status(500).json({
     message: "Something went wrong with the request"
      })
    }        
 });
 
  router.get("/bid/:id/auction", (req, res) => { 
    try {
      const bid_id = parseInt(req.params.id);
      db('auctions as a').where({bid_id}) 
    join('shops as s', 'a.shop_id', '=', 's.id')
    .join('buyers as b', 'a.buyer_id', '=', 'b.id')
    .select('a.*', 'b.email', 's.shop_name').then( (data) => {
      if(data) {
             res.send({
                 status: 200,
                 data
             });
         } else {
           res.send({
             status: 400,
             msg: "Data not found!!!"
           });
         }
           
    }).catch(err => {
      console.log(err);
    })
    } catch (error) {
      console.log({error});
    }
 });
//create or counter bid
router.post("/buyer/auction",  checkHeader, (req, res) => {  
  const buyer_id = req.buyer.id; 
  const { bid_id,  shop_id, first_delivery, second_delivery,
    third_delivery, within_distance, within_charge,
    beyond_distance, beyond_charge, quantity, packed, bid_token,
    price } = req.body; 
  const created_at = new Date().toLocaleString(); 
  db('bids')
  .insert({  bid_id, buyer_id, shop_id, bid_token, first_delivery, second_delivery,
    third_delivery, within_distance, within_charge, beyond_distance, beyond_charge,
     quantity, packed, price, created_at }).then( ( result ) => { 
  if(result) { 
       res.send({
                  status: 200,
                  message: 'Bid created successfully'
                  })
      } else {
          res.send({
              status: 400,
              message: 'Bid was not created'
          })
      }
  }).catch(err => {
    console.log(err);
  })
});

router.post("/buyer/toggle/buyer", checkHeader, (req, res) => {
  try { 
    const {id, buyer} = req.body ;
    const updated_at = new Date().toLocaleString();      
  db('auctions').where('id', id).update( { buyer,  updated_at })
  .then( ( data ) => {  
    if(data) {
      res.send({
      status: 200, 
      message: "You have accepted the offer" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error accepting offer" 
      });
      } 
     });
             
  } catch(error) {
    console.log('error', error);
    res.send({
      status: 400,
      message: error
    })
  }
});

router.post("/seller/toggle/seller", checkHeader, (req, res) => {
  try { 
    const {id, seller} = req.body ;
    const updated_at = new Date().toLocaleString();      
  db('auctions').where('id', id).update( { seller,  updated_at })
  .then( ( data ) => {  
    if(data) {
      res.send({
      status: 200, 
      message: "You have accepted the offer" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error accepting offer" 
      });
      } 
     });
             
  } catch(error) {
    console.log('error', error);
    res.send({
      status: 400,
      message: error
    })
  }
});
module.exports = router;