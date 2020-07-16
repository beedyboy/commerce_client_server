// var getRandomValues = require('get-random-values');
 function generateSlug(data){
   
    let slug = data
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');  
    return slug;
}

 function getRandomNo(){
    
    var i = new Date().getTime();
    i = i & 0xffffff;
    return i;
}


module.exports = {generateSlug, getRandomNo}