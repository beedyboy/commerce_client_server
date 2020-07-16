
const knex = require('../config/knex').knex; 


  function validate(tbl) {
  return async function (req,res, next) { 
    let email = req.body.email; 
    let user = await knex(tbl).where('email', email);
    console.log(user, user);
        if (user.length > 0) {
            res.json({
              status: 400,
              success: false,
              msg: "Email already exist"
          });
        } else {
           next();
        }
       
  }
}

 function checkHeader(req, res, next) {
  try { 
    if(req.headers.authorization && (req.headers.authorization.split(' ')[0] === 'bearer' || req.headers.authorization.split(' ')[0] === 'Bearer')) {
      const buyer_token = req.headers.authorization.split(' ')[1];  
      knex('logins').where({buyer_token})
      .join('buyers as b', 'logins.user_id', '=', 'b.id')
      .select('logins.buyer_token', 'logins.user_id', 'logins.id as login_id', 'b.*').then((data) => { 
        if (data.length > 0) {
          req.buyer_token = buyer_token;
          req.buyer = data[0]; 
          next();
        } else {
          res.json({
            status: 500,
            success: false,
            msg: "Invalid token! Please login again"
        });
        }
      }).catch(err => console.log('buyer', err))
    }
} catch (err) {
  console.log('error', err);
}
 }
function sellerAuth(req,res,next) { 
    let seller_token = req.cookies.access_token;  
    knex('logins').where({seller_token})
    .join('sellers as s', 'logins.shop_id', '=', 's.id')
      .select('logins.seller_token','logins.shop_id', 'logins.id as login_id', 's.*').then((shop) => { 
      if(shop.length < 1) {
        return res.json({
            status:500,
            success: false,
            msg: "Invalid token! Please login again"
        });
      }
        else {
           req.seller_token = seller_token;
           req.shop = shop[0]; 
        next();
        }
       
    }).catch(err => console.log('seller', err))

    

}
  async function valid(req, res, next) {
    let email = req.body.email; 
let user = await knex('companies').where('email', email); 
        if (user.length > 0) return res.json({
            status: 400,
            success: false,
            msg: "Email already exist"
        });
        next();
 
}

async function verify(req,res, next) {
  let email = req.body.email; 
  let phone= req.body.phone;
  let code = req.body.code;
  let user = await knex('activations').where({'email': email, 'phone': phone});  
  let rcode = user[0].code; 
  rcode = rcode.replace(/ +/g, ""); 
  if (user.length > 0 && rcode === code) {
    knex('activations').where({ id: user[0].id }).del().then( d => {
      next();
    });   

  } else {
      return res.json({
      status: 400, 
      msg: "Wrong validation code"
    });

  }


}

module.exports = {valid, validate, checkHeader, verify, sellerAuth}