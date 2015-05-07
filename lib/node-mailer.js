var nodemailer = require("nodemailer");

var Emailer = function() {
	var transporter = nodemailer.createTransport({
		service: 'outlook',
		auth: {
			user: 'onecap@outlook.com',
			pass: '!Password'
		}
    });

		transporter.sendMail({
			from: "onecap@outlook.com",
			to: "hidex2015@outlook.com",
			subject: s,
			text: "hello world!"
		});
	};
};
module.exports = new Emailer();

