const express = require('express');
const knex = require('../config/knex').knex; 
const helper = require('../lib/helper');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();
// const storage  = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//   cb(null, Date.now() + file.originalname);
//   // cb(null, file.filename)
// }
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  // destination: 'http://cloud.devprima.com/uploads',
  filename: function (req, file, cb) {
    // const ob = file.originalname.split("."); 
    // cb(null, file.fieldname + '-' + Date.now() + '.'+ob[1])
    // cb(null, file.fieldname + '-' + Date.now())
    cb(null, Date.now() + file.originalname);
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
// var upload = multer({dest: 'uploads/'});
 
//get module details by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const result = knex('phi_modules').where({id}).select().then( ( data ) => { 
           if(data) {
               res.send({
                   status: 200,
                   data
               })
           }
             else {
              res.send({
                status: 400,
                message: "Wrong information provided"
             });
            
             }
            
             });
});

//check whether module exist
router.get("/:name/exist", (req, res) => {   
    const mod_name = req.params.name ;
       const result = knex('phi_modules').where({mod_name}).select().then( ( data ) => { 
            if(data.length > 0) {
                res.send({
                    exist: true
                })
            }
              else {
                res.send({
                status: 400,
                  exist: false
              });
              }
            
            
             });
             
});

//get all modules
router.get("/", (req, res) => {  
        const result = knex('phi_modules').select().then( ( data ) => {   

             res.send( data ).status(200); 
             });
});


//create a new module
router.post("/", upload.single('file'),  (req, res, next) => {   
   try {
     const {name: mod_name} = req.body; 
    const created_at = new Date().toLocaleString();
    // var gallery = fs.readFileSync(req.file.path);
    // var gallery = fs.readFileSync(req.file.path, { encoding: 'base64' });;
    // var gallery = new Buffer(fs.readFileSync(req.file.path)).toString("base64");
     const body = fs.readFileSync(req.file.path);
    const gallery = body.toString('base64');  
    
    var image = req.file.path; 
    console.log('image', image);

    knex('phi_modules').insert({  mod_name, image, gallery, created_at }).then( ( result ) => { 
        
        if(result) { 
            res.send( {
                status: 200,
                message: 'Module created successfully'
                } );
        } else {
            res.send({
                status: 204,
                message: 'Module was not created'
            })
        }
    });
   } catch(err) {
    console.log('Error', err);
   } 
});
// router.post("/",  (req, res) => {   
//     const {name: mod_name} = req.body; 
//     const created_at = new Date().toLocaleString();
//     let response = null;

//     knex('phi_modules').insert({  mod_name, created_at }).then( ( result ) => { 
        
//         if(result) { 
//             res.send( {
//                 status: 200,
//                 message: 'Module created successfully'
//                 } );
//         } else {
//             res.send({
//                 status: 204,
//                 message: 'Module was not created'
//             })
//         }
//     }); 
// });

//update module

//check whether module exist
router.post("/update", (req, res) => {  
if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  console.log('token', req.headers.authorization.split(' ')[1]);
} 
    const {id, name: mod_name} = req.body ;
    const updated_at = new Date().toLocaleString();
  knex('phi_modules').where('id', id).update( { mod_name,  updated_at })
  .then( ( data ) => {  
    if(data) {
      res.send({
      status: 200, 
      message: "Module updated successfully" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error updating module" 
      });
      }
    
    
     });
             
});

module.exports = router;