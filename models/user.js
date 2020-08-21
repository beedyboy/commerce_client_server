const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper');  
const router = express.Router(); 
const mailer = require("../plugins/mailer"); 
const {validate, checkHeader, sellerAuth} = require('../middleware/valid');  
 

 router.post("/invite", (req, res) => {
   try {
     const subject = "Invitation to join";
    let body = "Your friend invited you to join this online shopping platform."; 
    console.log(req.body, body);
    mailer.inviteFriend(subject,req.body.email,body);
    res.send({
      status: 200,
      message: "User invited successfully"
    });
  } catch(error) {
    console.log('error', error);
    res.send({
      status: 400,
      message: error
    })
  }
   });
 
  router.post("/create/staff", sellerAuth, (req, res) => {
     const shop_id = req.shop.shop_id;  
     const { email, account_type} = req.body; 
  const password = helper.hash(req.body.password);
  const created_at = new Date().toLocaleString();  
  const preferred = "SELLER"; 
     db('sellers').returning('id')
          .insert({ shop_id, email, account_type, created_at }).then( ( result ) => {  
          if(result.length > 0) {
             db('logins').insert({seller_id: result[0], preferred,  email,  password}).then( reply => {  
        if(reply)  {
           res.send({  status: 200,  message: 'Staff created successfully' });
        } else {
           res.send({  status: 404,  message: 'Staff not created' });
        }
    });
          }              
     }).catch(err => {
       console.log(err);
     })

  });
 
  router.get("/staff/list", sellerAuth, (req, res) => {
     const id = req.shop.shop_id;  
     db('sellers as u').where({
      seller_id: id,
      account_type: "Secondary"
    })
     .join('login as l', 'l.seller_id', '=', 'u.id') 
     .select('u.*', 'l.id as loginId').then( (data) => {
      // console.log(data)
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

  router.get("/seller/profile", sellerAuth, (req, res) => {
     const id = req.shop.shop_id;  
     db('sellers as u').where('u.id', id)
     .join('settings as s', 's.seller_id', '=', 'u.id') 
     .select('u.*', 's.sms', 's.email as seller_email', 's.id as settingsId').then( (data) => {
      // console.log(data)
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

  router.get("/buyer/profile", checkHeader, (req, res) => {
     const id = req.buyer.id;  
     db('buyers as u').where('u.id', id)
     .join('settings as s', 's.buyer_id', '=', 'u.id') 
     .select('u.*', 's.sms', 's.email as buyer_email as buyer_email', 's.id as settingsId').then( (data) => { 
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

//update buyer
router.post("/update/buyer",checkHeader, (req, res) => {
  try {
     const id = req.buyer.id;  
    const {firstname, lastname, phone_number, gender, nickname, location} = req.body ;
    const updated_at = new Date().toLocaleString();
  db('buyers').where('id', id).update( { firstname, lastname, phone_number, gender, nickname, location,  updated_at })
  .then( ( data ) => {  
    if(data) {
      res.send({
      status: 200, 
      message: "Account updated successfully" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error updating info" 
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

//update seller
router.post("/update/seller",sellerAuth, (req, res) => {
  try {
     const id = req.shop.id;  
    const {firstname, lastname, phone_number, location} = req.body ;
    const updated_at = new Date().toLocaleString();
  db('sellers').where('id', id).update( { firstname, lastname, phone_number, location,  updated_at })
  .then( ( data ) => {
    console.log(data)  
    if(data) {
      res.send({
      status: 200, 
      message: "Account updated successfully" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error updating info" 
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

//shop details
router.post("/update/shop",sellerAuth, (req, res) => {
  try {
     const id = req.shop.id;  
    const {shop_name, currency, description} = req.body ;
    const updated_at = new Date().toLocaleString();
  db('sellers').where('id', id).update( { shop_name, currency, description,  updated_at })
  .then( ( data ) => {  
    if(data) {
      res.send({
      status: 200, 
      message: "Shop info updated successfully" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error updating info" 
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
 
router.post("/verify", (req, res) => { 
    const {email} = req.body; 
    db('company').where('email', email).update( 'status', 'Active').then( user => {
        if (!user) {
            res.json({
               status: 204, 
               msg: "Error activating account"
            });
           }  
           res.json({
               status: 200, 
               msg: "Account activated successfully"
            });
    })
  
   
}); 
module.exports = router;