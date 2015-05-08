exports.registerTerms = function (req, res) {
    var terms = req.body.terms;
    // TODO: processing happens here!
    return res.status(200).json(terms);
};