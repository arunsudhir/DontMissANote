var nodemailer = require("nodemailer");

var Emailer = function() {
	var transporter = nodemailer.createTransport({
		service: 'outlook',
		auth: {
			user: 'onecap@outlook.com',
			pass: '!Password'
		}
    });

	this.sendEmail = function (){
		transporter.sendMail();
	};
};

module.exports = new Emailer();