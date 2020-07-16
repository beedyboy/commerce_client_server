const express = require('express');
const knex = require('../config/knex').knex; 
const helper = require('../lib/helper');  
const router = express.Router(); 
// var upload = multer({dest: 'uploads/'});
 
//get categories details by id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const result = knex('categories').where({id}).select().then( ( data ) => { 
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

//check whether categories exist
router.get("/:name/exist", (req, res) => {   
    const name = req.params.name ;
    const result = helper.nameExist('categories', name);
    res.send({exist: result});

             
});

//get all modules
router.get("/", (req, res) => {  
const result = knex('categories').select().then( ( data ) => {   

     res.send( data ).status(200); 
     });
});


//create a new categories
router.post("/", (req, res, next) => {   
   try {
     const {name, description} = req.body; 
    const created_at = new Date().toLocaleString(); 

    knex('categories').insert({  name, description, created_at }).then( ( result ) => { 
        
        if(result) { 
            res.send( {
                status: 200,
                message: 'New category created successfully'
                } );
        } else {
            res.send({
                status: 204,
                message: 'Category was not created'
            })
        }
    });
   } catch(err) {
    console.log('Error', err);
   } 
});
 

//check whether categories exist
router.post("/update", (req, res) => {  
  try {
if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  console.log('token', req.headers.authorization.split(' ')[1]);
} 
    const {id, name, description} = req.body ;
    const updated_at = new Date().toLocaleString();
  knex('categories').where('id', id).update( { name, description,  updated_at })
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
    knex('categories').where('id', req.params.id).del().then( (result) => {
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