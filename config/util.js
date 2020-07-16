const config = {
    production:{
        SECRET: "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSs,./;FO!@%#^&*#()613457890",
        SECRET2: process.env.SECRET,
        DATABASE: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'bcommerce',
            charset: 'utf8',
        }
        
    },
    development:{
        SECRET: process.env.SECRET,
        DATABASE: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'bcommerce',
            charset: 'utf8',
        }
        
    },

    default:{
        SECRET: "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSs,./;FO!@%#^&*#()613457890"
         
    } 

}

exports.get = function get(env){
    return config[env] || config.default
}