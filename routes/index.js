var express = require("express");
var router = express.Router();

var liveConnect = require('../lib/liveconnect-client');
var createExamples = require('../lib/create-examples');
var oneNoteNodes = require('../lib/OneNoteNodes');
var sendgridEmailer = require('../lib/sendgrid-mailer.js');
var vasher = require('../lib/vash-worker.js');

/* GET Index page */
router.get("/", function(req, res) {
    var authUrl = liveConnect.getAuthUrl();
    var accessToken = req.cookies["access_token"];
    
    // TODO: handle token refresh
    if (accessToken) {

        // We're authenticated. Get the user's info and profile picture, then render the page
        return liveConnect.getUserInfo(accessToken, function(error, signedInUser, image, email) {
	        if (error) {
		        res.render("error", {
			        message: "Whoops! Couldn't get user info or picture!",
			        error: { details: error }
		        });
	        }

            req.session.email = email; // Store the email in the browser session

	        // Render the query page
	        return res.render("query", {
		        SignedInUser: signedInUser,
		        SignedInUserPic: image
	        });
        });

    } else {
        // We're still not authenticated - render the homepage
        return res.render("index", { title: "No note left behind!", authUrl: authUrl });
    }
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
	};
    
    function renderHomePage(){
        var authUrl = liveConnect.getAuthUrl();
        return res.render("index", { title: "OneNote API Node.js Sample", authUrl: authUrl });
    }

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
            liveConnect.getUserInfo(accessToken, req, userInfoResultCallback);
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

module.exports = router;
