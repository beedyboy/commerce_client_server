// Update with your config settings.

module.exports = {

   development: {
   migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'      
    },
    client: 'pg',
    connection: {     
      host: '127.0.0.1',
      user: 'postgres',
      password: 'dontopen',
      database: 'bcommerce',
      charset: 'utf8'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

 production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'      
    }
  }

};
