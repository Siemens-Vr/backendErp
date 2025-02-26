const  { MailtrapClient } =require("mailtrap");
require('dotenv').config()



module.exports.mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

module.exports.sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Cheldean Musingila",
};