var createExamples = require('../lib/create-examples');
var signedInUserEmail;

//// POST ~/registerTerms
//exports.registerTerms = function (req, res) {
//    var terms = req.body.terms;
//    var accessToken = req.cookies["access_token"];

//    console.log("Fetching terms metadata for " + JSON.stringify(terms));

//    return createExamples.getTermMetadata(accessToken, function (error, termsMetadata) {
//        if (error) {
//            console.log("Error when getting terms metadata.");
//            return res.status(500).json(error);
//        }
        
//        console.log("Successfully fetched terms metadata.");
        
//        var html = vasher.composeMailBody(termsMetadata);
//        console.log("Successfully converted termsMetadata into html");

//        sendgridEmailer.sendEmail(signedInUserEmail, html, "Don't miss a shared note: Alerts");
//        console.log("Successfully sent mail via sendGrid. Done!");

//        // TODO: we should return before this callback completes (to be async). Leaving as is for testing
//        return res.status(200).json(terms);
//    }, terms);
//};