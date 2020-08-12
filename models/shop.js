const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper');  
const router = express.Router(); 
// var upload = multer({dest: 'uploads/'});
 
//get shops details by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const result = db('shops').where({id}).select().then( ( data ) => { 
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

//check whether shops exist
router.get("/:name/exist", (req, res) => {   
    const name = req.params.name ;
    const result = helper.nameExist('shops', name);
    res.send({exist: result});

             
});

//get all modules
router.get("/", (req, res) => {  
 db('shops').join('members', 'shops.mid', '=', 'members.id')
 .select('*', 'members.firstname as fn').then( ( data ) => {   

     res.send( data ).status(200); 
     });
});


//create a new shops
router.post("/", (req, res, next) => {   
   try {
     const {name, description, mid} = req.body; 
    const created_at = new Date().toLocaleString(); 

    db('shops').insert({  name, mid, description }).then( ( result ) => { 
        
        if(result) { 
            res.send( {
                status: 200,
                message: 'New shop created successfully'
                } );
        } else {
            res.send({
                status: 204,
                message: 'Shop was not created'
            })
        }
    });
   } catch(err) {
    console.log('Error', err);
   } 
});
 

//check whether shops exist
router.post("/update", (req, res) => {  
  try {
if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  console.log('token', req.headers.authorization.split(' ')[1]);
} 
    const {id, name, description} = req.body ;
    const updated_at = new Date().toLocaleString();
  db('shops').where('id', id).update( { name, description,  updated_at })
  .then( ( data ) => {  
    if(data) {
      res.send({
      status: 200, 
      message: "Category updated successfully" 
     });
    }
      else {
        res.send({
        status: 400,
        message: "Error updating category" 
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

router.delete("/:id", (req, res) => { 
   try {
    db('shops').where('id', req.params.id).del().then( (result) => {
        res.send({
            status: 200,
            message: 'Category deleted successgully'
        })
    } )
   } catch(error) {
    console.log(error);
       res.send({
        status: 400,
        message: error
       })
       
   }
})
module.exports = router;