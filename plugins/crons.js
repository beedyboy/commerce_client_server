const cron = require("node-cron");
var mailer = require('./mailer');

cron.schedule("* * * * *", () => {
    console.log("Cron job running");

    mailer.sendMail()
})