var createExamples = require('../lib/create-examples');

// POST ~/registerTerms
exports.registerTerms = function (req, res) {
    var terms = req.body.terms;
    var accessToken = req.cookies["access_token"];

    console.log("Fetching terms metadata for " + JSON.stringify(terms));

    return createExamples.getTermMetadata(accessToken, function (error, termsMetadata) {
        if (error) {
            console.log("Error when getting terms metadata.");
            return res.status(500).json(error);
        }

        console.log("Successfully fetched terms metadata.");
        // TODO: what to do with this termsMetadata? We should send an email

        // TODO: we should return before this callback completes (to be async). Leaving as is for testing
        return res.status(200).json(terms);
    }, terms);
};