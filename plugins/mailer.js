const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
 const path = require('path');
 const config = require('../config/config.json');
const url = "http://devprima.com"
exports.sendMail = function(subject, receiver, body){
    let transport = nodemailer.createTransport({
        // host: 'smtp.etheral.email',
        host: 'smtp.gmail.com',
        port: 587,
        // secure: false, //true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: config[process.env].user,
            pass: config[process.env].pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    transport.use('compile', hbs({
        viewEngine: 'express-handlebars',
        viewPath: './views/'
    }));
    const mailOptions = {
        from: '"Online Shopping" <boladebode@gmail.com>', //sender address
        to: receiver,//list of receivers
        subject: subject,
        text: body,//plain tcext body
        // html: body, //html body
        template: 'index'
    };
    
    transport.sendMail(mailOptions, function (error, info) {
        console.log(info.messageId);
        if(error) {
            console.log(error);
        } else {
            console.log(info);
        }
    });

    return ;
}


exports.inviteFriend = function(subject, receiver, body){
    let transport = nodemailer.createTransport({
        // host: 'smtp.etheral.email',
        host: 'smtp.gmail.com',
        port: 587,
        // secure: false, //true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: config[process.env].user,
            pass: config[process.env].pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    //configure templa
    transport.use('compile', hbs({
        viewEngine: 'express-handlebars',
        viewPath: './views/'
    }));
    const mailOptions = {
        from: '"Online Shopping" <boladebode@gmail.com>', //sender address
        to: receiver,//list of receivers
        subject: subject, 
        html: body,
        template: 'index',
        context: {
          email: receiver,
          body: body,
          url: url
        }
    };
    
    transport.sendMail(mailOptions, function (error, info) {
        // console.log(info.messageId);
        if(error) {
            console.log(error);
        } else {
            console.log(info);
        }
    });

    return ;
}