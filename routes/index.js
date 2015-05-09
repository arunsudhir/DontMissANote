var express = require("express");
var router = express.Router();

var liveConnect = require('../lib/liveconnect-client');
var createExamples = require('../lib/create-examples');
var oneNoteNodes = require('../lib/OneNoteNodes');
var sendgridEmailer = require('../lib/sendgrid-mailer.js');
var vasher = require('../lib/vash-worker.js');
var signedInUserEmail = "onecap@outlook.com";

/* GET Index page */
router.get("/", function(req, res) {
	var authUrl = liveConnect.getAuthUrl();
	res.render("index", { title: "OneNote API Node.js Sample", authUrl: authUrl });
});

/* POST Create example request */
router.post("/", function(req, res) {
	var accessToken = req.cookies["access_token"];
	var exampleType = req.body["submit"];

	// Render the API response with the created links or with error output
	var createResultCallback = function(error, httpResponse, body) {
		if (error) {
			return res.render("error", {
				message: "HTTP Error",
				error: { details: JSON.stringify(error, null, 2) }
			});
		}

		// Parse the body since it is a JSON response
		var parsedBody;
		try {
			parsedBody = JSON.parse(body);
		} catch (e) {
			parsedBody = {};
		}
		// Get the submitted resource url from the JSON response
		var resourceUrl = parsedBody["links"] ? parsedBody["links"]["oneNoteWebUrl"]["href"] : null;

		if (resourceUrl) {
			res.render("result", {
				title: "OneNote API Result",
				body: body,
				resourceUrl: resourceUrl
			});
		} else {
			res.render("error", {
				message: "OneNote API Unexpected Result",
				error: { status: httpResponse.statusCode, details: body }
			});
		}
	};
	
	// Render the API response with the created notebooks
	var getNotebooksCallback = function (error, httpResponse, body) {
		if (error) {
			return res.render("error", {
				message: "HTTP Error",
				error: { details: JSON.stringify(error, null, 2) }
			});
		}
		
		// Parse the body since it is a JSON response
		var parsedBody;
		try {
			parsedBody = JSON.parse(body);
		} catch (e) {
			parsedBody = {};
		}
		// Get the submitted resource url from the JSON response
		var notebooks = parsedBody["value"];
		
		if (notebooks) {
			res.render("getNotebooksResult", {
				title: "Notebooks",
				notebooks: notebooks
			});
		} else {
			res.render("error", {
				message: "OneNote API Unexpected Result",
				error: { status: httpResponse.statusCode, details: body }
			});
		}
	};
	
	var getPagesCallback = function (error, httpResponse, body) {
		if (error) {
			return res.render("error", {
				message: "HTTP Error",
				error: { details: JSON.stringify(error, null, 2) }
			});
		}
		
		// Parse the body since it is a JSON response
		var parsedBody;
		try {
			parsedBody = JSON.parse(body);
		} catch (e) {
			parsedBody = {};
		}
		
		var pages = parsedBody["value"];
		
		if (pages) {
			res.render("getPagesResult", {
				title: "Pages that are shared",
				pages: pages
			});
		} else {
			res.render("error", {
				message: "OneNote API Unexpected Result",
				error: { status: httpResponse.statusCode, details: body }
			});
		}
	};
	
	var getTestPagesCallback = function (error, httpResponse, body) {
		if (error) {
			return res.render("error", {
				message: "HTTP Error",
				error: { details: JSON.stringify(error, null, 2) }
			});
		}

		// Parse the body since it is a JSON response
		var parsedBody;
		try {
			parsedBody = JSON.parse(body);
		} catch (e) {
			parsedBody = {};
		}
		
		var paragraphNodes = oneNoteNodes.getParagraphNodeMetadata(parsedBody);
		res.render("error", {
			message: "OneNote API paragraph nodes",
			error: { status: httpResponse.statusCode, details: JSON.stringify(paragraphNodes, null, "\t") }
		});
	};
	
	var getSomeSharedPagesCallback = function (error, pagesMetadata) {
		if (error) {
			return res.render("error", {
				message: "HTTP Error",
				error: { details: JSON.stringify(error, null, 2) }
			});
		}

        var html = vasher.composeMailBody(pagesMetadata);
            res.render("error", {
                message: "Returning JSON representation",
                error: { status: "Yay we're sending you a mail alert now... Grab a coffee and check your inbox!", details : JSON.stringify(pagesMetadata, null, "\t")}
        });
	    sendgridEmailer.sendEmail(signedInUserEmail, html, "OneNote Daily Shared Notes Alerts");
	};
    
    function renderHomePage(){
        var authUrl = liveConnect.getAuthUrl();
        return res.render("index", { title: "OneNote API Node.js Sample", authUrl: authUrl });
    }
    
    var userInfoResultCallback = function (error, httpResponse, body) {
        if (error) {
            return res.render("error", {
                message: "HTTP Error",
                error: { details: JSON.stringify(error, null, 2) }
            });
        }
        
        // Parse the body since it is a JSON response
        var parsedBody;
        try {
            parsedBody = JSON.parse(body);
        } catch (e) {
            parsedBody = {};
        }
        // Get the submitted resource url from the JSON response
        var signedInUser = parsedBody["name"] ? parsedBody["name"] : (parsedBody["emails"]["preferred"]? parsedBody["emails"]["preferred"] : null);
        signedInUserEmail = parsedBody["emails"]["preferred"]; // TODO: put this in a cookie instead of a global variable. Grrr...
        
        if (signedInUser) {
            var image = null;
            liveConnect.getUserPic(accessToken, function (error, httpResponse, body) {
                if (!error) {
                    image = httpResponse.headers['content-location'];
                    res.render("query", {
                        SignedInUser: signedInUser,
                        SignedInUserPic: image
                    });
                } 
                else {
                    res.render("error", {
                        message: "Whoops! I couldn't get your picture!",
                        error: { status: httpResponse.statusCode, details: body }
                    });
                    }
            });
        } else {
            res.render("error", {
                message: "Whoops! I couldn't get your information!",
                error: { status: httpResponse.statusCode, details: body }
            });
        }
    };

    // Request the specified create example
    switch (exampleType) {
        case 'text':
            createExamples.createPageWithSimpleText(accessToken, createResultCallback);
            break;
        case 'textimage':
            createExamples.createPageWithTextAndImage(accessToken, createResultCallback);
            break;
        case 'html':
            createExamples.createPageWithScreenshotFromHtml(accessToken, createResultCallback);
            break;
        case 'url':
            createExamples.createPageWithScreenshotFromUrl(accessToken, createResultCallback);
            break;
        case 'file':
            createExamples.createPageWithFile(accessToken, createResultCallback);
            break;
        case 'email':
           sendgridEmailer.sendEmail("hidex2015@outlook.com", "Hi <b> This mail brought to you by hackathon<b>", "Yo check this out");
            break;
        case 'testUserInfo':
            liveConnect.getUserInfo(accessToken, userInfoResultCallback);
            break;
		case "getNotebooks":
			createExamples.getNotebooks(accessToken, getNotebooksCallback);
			break;
		case "getNotebooksWithExpand":
			createExamples.getNotebooksWithExpand(accessToken, getNotebooksCallback);
			break;
		case "getSharedPages":
			createExamples.getSharedPages(accessToken, getPagesCallback);
			break;
		case "getLastDayPageMetadata":
			createExamples.getLastDayPageMetadata(accessToken, getSomeSharedPagesCallback);
			break;
		case "getTermMetadata":
			createExamples.getTermMetadata(accessToken, getSomeSharedPagesCallback, ["hackaton", "disney"]);
			break;
        case "signOut":
            renderHomePage();
            break;
		default :
			createExamples.getPageJsonContent(accessToken, getTestPagesCallback, exampleType);
			break;
    }
});

// NOTE: This is asyncrhonous - it returns 200 right away and kicks of an async thread
router.post("/registerTerms", function (req, res) {
    var terms = req.body.terms;
    var accessToken = req.cookies["access_token"];
    
    console.log("Fetching terms metadata for " + JSON.stringify(terms));
    
    createExamples.getTermMetadata(accessToken, function (error, termsMetadata) {
        console.log("Successfully fetched terms metadata.");
        
        var html = vasher.composeMailBody(termsMetadata);
        console.log("Successfully converted termsMetadata into html");
        
        sendgridEmailer.sendEmail(signedInUserEmail, html, "OneNote Daily Shared Notes Alerts");
        console.log("Successfully sent mail via sendGrid. Done!");
    }, terms);

    return res.status(200).json(terms);
});

module.exports = router;
