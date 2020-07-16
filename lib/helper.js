const bcrypt = require("bcryptjs"); 
const jwt = require('jsonwebtoken');
const knex = require('../config/knex').knex; 
const util = require('../config/util').get(process.env.NODE_ENV);

const helper = { 
  emailExist: (tbl, email) => {  
    let ans = {exist: false};
    knex(tbl).where({email}).select('email').then( ( data ) => { 
    console.log(data, data.length); 
     if(data.length > 0) {
      ans = {exist: true};
      console.log('greaten than zero');
    } else {
      ans = {exist: false};
      console.log('less than one');
    }
    }); 
    return ans;
    
  },
    
nameExist: async (tbl, name) => {
 await knex(tbl).where({name}).select().then( ( data ) => { 
   if(data.length > 0) { 
         return true;
     }
       return false;
              
    });

},  
isThereToken: (req) => {
  let data = {}; 
  if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'bearer' ||
   req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];  
    data = {
      exist: true,
      token
    };
  } else {
    data = {exist: false};
  }
  return data;
},
 
getProfile: (req, tbl, id) => {
  let payload = {};
  try {
    
    const verify = helper.isThereToken(req);
    if(verify && verify.exist === true) {
      const token = verify.token; 
      knex('signatures').where({token}).select(id).then((data) => { 
        if (data) {
          knex(tbl).where('id', data[0][id]).then((res) => {
            // console.log('profile', res[0]);
             payload.exist = true;
             payload.data = res[0];
           
          }) 
        
        } else {
           
             payload.exist = false;
             payload.msg ='Invalid token, please sign in and try again!';
          
        }
      })
    } else {
      payload.exist = false;
      payload.msg ='Invalid token, please sign in and try again!';
      
    }
    
} catch (err) {
  console.log('error', err);
}
return payload;
},
      
hash: (password) => {
    const salt = bcrypt.genSaltSync();
    return  bcrypt.hashSync(password, salt);
  },
  
generateToken: (user) => { 
    try { 
    var token = jwt.sign(user.id, util.SECRET);
    return token;
    } catch(err) {
      console.log('error', err);
    }
   
    //  return token; 
    
  },

getRandomizer: (bottom, top) => {
    return function() {
        return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
    }
},
generateOTP: () => {
  var rollDie = helper.getRandomizer(0, 9);

  var results = ""
  for ( var i = 0; i<7; i++ ) {
      results += rollDie() + " ";    //make a string filled with 1000 random numbers in the range 1-6.
  }
  return results;
},
setSignature: async ( id, token_col, token) => {
  // console.log(id, token_col, token);
  var reply = false;
    const updated_at = new Date().toLocaleString();  
   await knex('logins').where('id', id).update(token_col, token).update('updated_at', updated_at).then( data => {
  if (data > 0){
     reply = true;
     }
  else {reply = false; }
               }).catch(err => {
    console.log(err);
   }); 
  return reply;
},
setActivation: (email, phone, code, status) => {
  knex('activations').insert({ email, phone, code, status }).then( (res) => {
    return res;
  })
},

login:(tbl, body, col) => {
  const email = body.email;
    const password = helper.hash(body.password);  
    console.log('password', password);
      knex(tbl).where('email', email).select()
     .then((user) => {
      if(user[0].id < 1) {
        return {
          status: 400,
          msg: "wrong email or password"
        };
      } else { 
        const data = user[0];
        if( bcrypt.compareSync(body.password, data.password)) {
           console.log('user.password', data.password);
          const token = helper.generateToken(data);
          // const sign = helper.setSignature(token, col, data.id);

    // console.log('sign', sign);
    knex('signatures').where(col, data.id).update( 'token', token).then( sign => {
       if(sign) {
      return {
        status: 200,
        user: data,
        token
      };
          }
               });

          
        } else {
            return {
            status: 400,
            msg: "wrong email or password"
          };
        }
      }//user found
     });
   }

  
}

module.exports = helper;