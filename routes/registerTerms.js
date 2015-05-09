var createExamples = require('../lib/create-examples');
var vasher = require('../lib/vash-worker.js');
var sendgridEmailer = require('../lib/sendgrid-mailer.js');

// POST ~/registerTerms - this returns asyncrhonously
exports.registerTerms = function (req, res) {
    var terms = req.body.terms;
    var accessToken = req.cookies["access_token"];
    var useremail = req.session.email;
    
    console.log("Fetching terms metadata for " + JSON.stringify(terms) + " for user " + useremail + " and session id: " + req.session.id);
    
    createExamples.getTermMetadata(accessToken, function (error, termsMetadata) {
        console.log("Successfully fetched terms metadata." + " for user " + useremail + " and session id: " + req.session.id);
        
        var html = vasher.composeMailBody(termsMetadata);
        console.log("Successfully converted termsMetadata into html" + " for user " + useremail + " and session id: " + req.session.id);
        
        sendgridEmailer.sendEmail(useremail, html, "OneNote Daily Shared Notes Alerts");
        console.log("Successfully sent mail via sendGrid. Done!" + " for user " + useremail + " and session id: " + req.session.id);
    }, terms);
    
    return res.status(200).json(terms);
};