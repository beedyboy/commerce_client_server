const express = require('express');
const knex = require('../config/knex').knex; 
const helper = require('../lib/helper');
const {validate, checkHeader, sellerAuth} = require('../middleware/valid'); 
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require('fs');
// const mailer = require("../plugins/mailer");
// const router = require('express').Router;

const router = express.Router(); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/products')
  },
  // destination: 'http://cloud.devprima.com/uploads',
  filename: function (req, file, cb) {
    const ob = file.originalname.split("."); 
    cb(null, file.fieldname + '-' + Date.now() + '.'+ob[1])
    // cb(null, file.fieldname + '-' + Date.now())
    // cb(null, Date.now() + file.originalname);
  }
});
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({ storage: storage, limits: {
  fileSize: 1024 * 1024 * 2
}});
 


 
//get all product
router.get("/all", (req, res) => {  
  knex('products') 
  .join('sellers as s', 'products.shop_id', '=', 's.id')
  .join('categories as c', 'products.cat_id', '=', 'c.id')
.select('products.*', 'c.name as catName',
   's.shop_name as shopName').then( ( data ) => {  
         res.send( data ).status(200); 
         }).catch(err => {
           console.log('all ', err);
         })
});

router.get("/myproduct", sellerAuth, (req, res) => {   
  const shop_id = req.shop.shop_id ;  
      const result = knex('products').where({shop_id})
       .join('sellers as s', 'products.shop_id', '=', 's.id')
      .join('categories as c', 'products.cat_id', '=', 'c.id')
   .select('products.*', 'c.name as catName',
       's.shop_name as shopName').then( ( data ) => {             
          if(data) {
              res.send({
                  status: 200,
                  data
              })
          } 
          
           }).catch(err => {
            console.error('my product', err);
          })
}); 
 
 
router.get("/:id", (req, res) => {  
    const pid = req.params.id ; 
        knex('products as p').where('p.id', pid)
       .join('sellers as s', 's.id', '=', 'p.shop_id')
       .join('categories as c', 'c.id', '=', 'p.cat_id')
       .join('cities as l', 'l.id', '=', 'p.location')
       .select('p.*', 'c.name as catName', 'l.name as locationName', 
       's.shop_name as shopName', 's.id as seller').then( ( data ) => {     
         if(data) {
            res.send({
                status: 200,
                data
            })
        } else {
           res.send({
             status: 400
          });
        }   }).catch(err => {
            console.error(' product details', err);
          })
}); 

  
//create new product
router.post("/",  sellerAuth, upload.fields([{
  name: 'main_image', maxCount: 1
}, {  name: 'first_image', maxCount: 1 }, {  name: 'middle_image', maxCount: 1 }
  ]), (req, res) => {  
    const shop_id = req.shop.shop_id ;  
    const {name: product_name,  first_delivery, second_delivery, third_delivery, within_distance, within_charge,
     beyond_distance, beyond_charge,
     available, packed, description, location, price, cat_id} = req.body;  
    const created_at = new Date().toLocaleString();
    let response = null;  
    let { tags } = req.body;
    tags = JSON.parse(tags).toString();
    var image = req.files;
    const main_image = image['main_image'] && image['main_image'][0].path;
    const first_image = image['first_image'] && image['first_image'][0].path;
    const middle_image = image['middle_image'] && image['middle_image'][0].path;
    const last_image = image['last_image'] && image['last_image'][0].path; 
    knex('products')
    .insert({ product_name, first_delivery, second_delivery, third_delivery, within_distance, within_charge,
     beyond_distance, beyond_charge,  available, packed, description, tags, location, price, cat_id, shop_id,
      main_image, first_image, middle_image, last_image, created_at }).then( ( result ) => {  
    if(result.length > 0) {   
         res.send({
                        status: 200,
                        message: 'New product created successfully'
                    })
        } else {
            res.send({
                status: 404,
                message: 'Product was not created'
            })
        }
    }).catch(err => {
      console.log(err);
    })
});

router.post("/update", (req, res) => {   
    const {fullname,  role, username, id} = req.body;   
    const updated_at = new Date().toLocaleString();  
    let response = null; 
    knex('products').where('id', id).update({ fullname, username, role, updated_at }).then( ( result ) => { 
   if(result) { 
            res.send( {
                status: 200,
                message: 'Account updated successfully'
                } );
        } else {
            res.send({
                status: 204,
                message: 'Account was not updated'
            })
        }
    }); 
});



module.exports = router;