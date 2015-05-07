var nodemailer = require("nodemailer");

var Emailer = function() {
	var transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "onecap911@gmail.com",
			pass: "!Password"
		}
    });
    
    var mailOptions = {
        from: 'onecap911@gmail.com', // sender address
        to: 'hidex2015@outlook.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello world', // plaintext body
        html: '<b>Hello world</b>' // html body
    };

    this.sendEmail = function () {
	    transporter.use('compile', function (mail, callback) {
            if (!mail.text && mail.html) {
                mail.text = mail.html.replace(/<[^>]*>/g, ' ');
            }
            callback();
        });
		transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    }
);
	};
};

module.exports = new Emailer();