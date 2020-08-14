const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper');
const {validate, checkHeader, sellerAuth} = require('../middleware/valid'); 
const {multerUploads, dataUri} = require('../middleware/multer'); 
const bcrypt = require("bcryptjs"); 
const fs = require('fs'); 
const { cloudinary } = require('../config/cloudinary');
// const mailer = require("../plugins/mailer");
// const router = require('express').Router;

const router = express.Router(); 
  // destination: 'http://cloud.devprima.com/uploads',
   // var upload = multerUploads.fields([{ name: 'main_image', maxCount: 1 }, { name: 'first_image', maxCount: 8 }])
   var upload = multerUploads.array('image')

router.post('/upload', upload, async (req, res) => {
try { 
  let urls = [];
  var image = req.files;
  var imageSize = Object.keys(image).length;
  let count = 0;
   // console.log('images', image);
     if( imageSize > 0) { 
     for (const [key, value] of Object.entries(image)) {
          console.log(value.fieldname);
       await helper.uploader(value).then(newPath => {
          console.log(newPath)
          urls.push(newPath);
          // fs.unlinkSync(value[0].path); 
    }) 
       count += 1;
      // const newPath = helper.uploader(value[0], 'bcommerce')
     }
        
    if (count === imageSize) { 
     let images = JSON.stringify(urls); 
       res.status(200).json({
        message: 'Your image has been uploaded successfully to cloudinary',
        count,
        images
      }) 
    }
  }
} catch(err) {
  console.log('upload', err)
}
})

 
//get all product
router.get("/all", (req, res) => {  
  db('products') 
  .join('shops as s', 'products.shop_id', '=', 's.id')
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
      const result = db('products').where({shop_id})
       .join('shops as s', 'products.shop_id', '=', 's.id')
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
        db('products as p').where('p.id', pid)
       .join('shops as s', 's.id', '=', 'p.shop_id')
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


router.post("/",  sellerAuth, upload, async (req, res) => {  
  try {
    const shop_id = req.shop.shop_id;
    // console.log('shop_id', shop_id)
     let urls = [];
     var image = req.files;
     var imageSize = Object.keys(image).length;  
     let count = 0;
 
     if( imageSize > 0) {
      let pay_image = {
        main_image: "",
        first_image: ""
      } 

     for (const [key, value] of Object.entries(image)) { 
       await helper.uploader(value).then(newPath => {
          console.log(newPath.url) 
          urls.push(newPath.url);
          // fs.unlinkSync(value[0].path); 
    })  
       count += 1;
     }
  }  
   if(count === imageSize) {
     console.log('count', count);
     // console.log('urls', urls);
    const {name: product_name,  description, latitude, longitude, cat_id} = req.body;  
    const created_at = new Date().toLocaleString(); 
    let { tags } = req.body;
    tags = JSON.parse(tags).toString(); 
    db('products').returning('id')
    .insert({ product_name, description, latitude, longitude, tags, cat_id, shop_id, created_at }).then( ( result ) => {  
    if(result.length > 0) { 
    const updated_at = new Date().toLocaleString(); 
     let images = JSON.stringify(urls);  
     db('products').where('id', result[0]).update({ images, updated_at }).then( (data) => {
       if(data) {
         res.send({
                  status: 200,
                  message: 'New product created successfully',
                  images
              })
       }
     })
         
  } else {
      res.send({
          status: 404,
          message: 'Product was not created'
      })
  }
    }).catch(err => {
      console.log(err);
      res.status(500).json({message: "Something went wrong!!!"})
    })
   }
  } catch (error) {
    console.log(error);
  }
  
});

// router.post("/ps",  sellerAuth, upload.fields([{
//   name: 'main_image', maxCount: 1
// }, {  name: 'first_image', maxCount: 1 }, {  name: 'middle_image', maxCount: 1 }
  // ]), (req, res) => { 
//create new product
router.post("/ps",  sellerAuth, (req, res) => {  
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
    db('products')
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
    db('products').where('id', id).update({ fullname, username, role, updated_at }).then( ( result ) => { 
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