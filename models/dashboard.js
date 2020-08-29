const express = require('express');
const db = require('../config/knex'); 
const helper = require('../lib/helper');
const {validate, checkHeader, sellerAuth} = require('../middleware/valid'); 
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require('fs');
// const mailer = require("../plugins/mailer");
// const router = require('express').Router;

const router = express.Router();  

  

router.get("/seller", sellerAuth, async(req, res) => {  
    const shop_id = req.shop.shop_id ;  
    const pQuery = await  db('products as p')
    .where({ 'p.shop_id': shop_id })
    .count('p.id as p_total');
    await  db('sellers as sl')
    .where({ 'sl.shop_id': shop_id })
    .andHaving('sl.account_type', '=', db.raw("'Secondary'")) 
    .groupBy('sl.account_type')
    .count('sl.id as s_total') 
        .then( ( staffs ) => {             
        if(staffs) {
        const products =pQuery.length > 0? pQuery[0].p_total : 0;
        const staff = staffs.length > 0? staffs[0].s_total: 0;
        var data = { 
            products,
            staff};
        res.send({
        status: 200,
        data
        })
        } 

        }).catch(err => {
        console.error('my product', err);
        })
  }); 
router.get("/buyer", checkHeader, async(req, res) => {  
    // const buyer_id = req.buyer.id;   
    // const pQuery = await  db('products as p')
    // .where({ 'p.shop_id': shop_id })
    // .count('p.id as p_total');
    // await  db('sellers as sl')
    // .where({ 'sl.shop_id': shop_id })
    // .andHaving('sl.account_type', '=', db.raw("'Secondary'")) 
    // .groupBy('sl.account_type')
    // .count('sl.id as s_total') 
    //     .then( ( staffs ) => {             
    //     if(staffs) {
    //     const products =pQuery.length > 0? pQuery[0].p_total : 0;
    //     const staff = staffs.length > 0? staffs[0].s_total: 0;
    //     var data = { 
    //         products,
    //         staff};
    //     res.send({
    //     status: 200,
    //     data
    //     })
    //     } 

    //     }).catch(err => {
    //     console.error('my product', err);
    //     })
    res.send({
        status: 200,
        data: []
        })
  }); 

  router.get("/buyers", async (req, res) => {   
    const shop_id = 3;  
    const pQuery = await  db('products as p')
    .where({ 'p.shop_id': shop_id })
    .count('p.id as p_total');
await  db('sellers as sl')
    .where({ 'sl.shop_id': shop_id })
    .andHaving('sl.account_type', '=', db.raw("'Secondary'")) 
    .groupBy('sl.account_type')
    .count('sl.id as s_total')
    

//  .leftOuterJoin('sellers as sl', function() {
//      this.on( 'sl.shop_id', '=', 's.id')
//      .andOn('sl.account_type ', '=', db.raw("'Primary'"))
//  })
// .leftJoin(

// )
.then( ( staffs ) => {             
if(staffs) {
const products =pQuery.length > 0? pQuery[0].p_total : 0;
const staff = staffs.length > 0? staffs[0].s_total: 0;
res.send({
status: 200,
products,
staff
})
} 

}).catch(err => {
console.error('my product', err);
})
  });
 

module.exports = router;