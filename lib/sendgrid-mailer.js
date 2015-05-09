var sendgrid = require('sendgrid')('azure_0d68708caa701f00e2a4bc3129b857f6@azure.com', 'h2NaTR7xuGo72as');

var Emailer = function () {

    this.sendEmail = function (toAddress, htmlBody, subjectStr) {

		var email = new sendgrid.Email({
			to: toAddress,
			from: 'onecap@outlook.com',
			subject: subjectStr,
			html: htmlBody
		});

		sendgrid.send(email, function(err, json) {
			if (err) {
				console.error("Error when sending email:");
				console.error(err);
			}
			console.log("JSON received when sending email:");
			console.log(json);
		});
	};
};

module.exports = new Emailer();
