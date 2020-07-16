var http = require('http');
var url = require('url');


const password = 'beedysms1234@';


exports.getBalance = function() {
    const uri = 'http://cedarcliffsms.com.ng/api/sms/balance?username=beedyboy&password='+password;
    http.get(uri, (res) => {
        console.log(res);
        return res;
    })
    
}

exports.sendMessage = function(recipient, message) {
    const uri = 'http://cedarcliffsms.com.ng/api/sms/dnd-route?username=beedyboy&password='+password 
    + '&sender=Caresity&recipient=' + recipient + '&message=' + message;
    http.get(uri, (res) => {
        // console.log(res);
        return res;
    })

}