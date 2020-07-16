// import knex from '../config/knex';
const knex = require('../config/knex');
module.exports.Routes = [

    {
        method: 'POST',
        path: '/api/subcription',
        handler: (request, h) => {
            const {plan, amount, sms, package} = request.payload;
            knex('companies').insert({
                plan, amount, sms, package
            }).then( ( res ) => {

                h.response( {

                    status: 200,
                    message: 'Package created successfully'

                } );
            } ).catch.response( ( err ) => {

                h.response( 'server-side error' );

            } );
          
            return null;
        },
        config: {
          description: 'Create subscription plans'
        }
      },
      {
          method: 'POST',
          path: '/api/account',
          handler: (request, h) => {
              const {sid, companyname, address, email, password} = request.payload;
              knex('companies').insert({
                  sid, companyname, address, email, password
              }).then( ( res ) => {
  
                  h.response( {
  
                      status: 200,
                      message: 'Account created successfully'
  
                  } );
              } ).catch.response( ( err ) => {
  
                  h.response( 'server-side error' );
  
              } );
            
              return null;
          },
          config: {
            description: 'Registers new company'
          }
        },
      {
        method: 'GET',
        path: '/api/account/{email}',
        handler: (request, h) => {
            const email = request.params.email;
            const result = knex('companies').where('email', email).select('id').then( (result) => {
                if( result  || results > 0 ) {

                    h.response( {

                        exist: false, 

                    } );

                    return;

                }
            });
            h.response( {

                exist: true,
                errMessage: 'This email already exist',

            } ).catch.response( ( err ) => {

                h.response( 'server-side error' );

            } );
        return null;
        },
        config: {
          description: 'Gets the content of a note'
        }
      },
];

// export default Routes;