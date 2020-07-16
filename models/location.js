const express = require('express'); 
const helper = require('../lib/helper');
const knex = require('../config/knex').knex; 
// const {valid} = require('../middleware/valid'); 
// const mailer = require("../plugins/mailer");
// const router = require('express').Router;

const router = express.Router();

// const router = Router();
//get city details by id
router.get("/city/:id", (req, res) => {
    const name = req.params.id;
    const result = knex('cities').where('id', name).select().then( ( data ) => { 
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
 
//get all cities
router.get("/cities", (req, res) => {  
   knex('cities').select().then( ( data ) => {  
    
             res.send( data ).status(200); 
             });
});


 
module.exports = router;

