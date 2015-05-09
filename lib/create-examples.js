var onenoteApi = require("./OneNoteApi.js");
var request = require("request");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");
var oneNoteNodes = require('../lib/OneNoteNodes');
var metadataFilters = require('../lib/MetadataFilters');

var CreateExamples = function () {
    /* Pages API request builder & sender */
    function createPage(accessToken, payload, callback, multipart) {
        var options = {
            url: oneNotePagesApiUrl,
            headers: { 'Authorization': "Bearer " + accessToken }
        };
        // Build simple request
        if (!multipart) {
            options.headers["Content-Type"] = "text/html";
            options.body = payload;
        }
        var r = request.post(options, callback);
        // Build multi-part request
        if (multipart) {
            var CRLF = "\r\n";
            var form = r.form(); // FormData instance
            _.each(payload, function (partData, partId) {
                form.append(partId, partData.body, {
                    // Use custom multi-part header
                    header: CRLF +
						"--" + form.getBoundary() + CRLF +
						"Content-Disposition: form-data; name=\"" + partId + "\"" + CRLF +
						"Content-Type: " + partData.contentType + CRLF + CRLF
                });
            });
        }
    }
    
    function dateTimeNowISO() {
        return new Date().toISOString();
    }
    
    /**
     * @callback createPageCallback
     * @param {object} Error
     * @param {object} HTTP Response
     * @param {string} Response body
     */

	/**
     * Create OneNote Page with Text
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
	this.createPageWithSimpleText = function (accessToken, callback) {
        var htmlPayload =
 "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"    <title>A page created from basic HTML-formatted text (Node.js Sample)</title>" +
				"    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
				"</head>" +
				"<body>" +
				"    <p>This is a page that just contains some simple <i>formatted</i>" +
				"    <b>text</b></p>" +
				"</body>" +
				"</html>";
        
        onenoteApi.createPageInDefaultSection(accessToken, htmlPayload, callback, false);
    };
    
    /**
     * Create OneNote Page with Text and Images
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
	this.createPageWithTextAndImage = function (accessToken, callback) {
        var htmlPayload =
 "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"    <title>A page created containing an image (Node.js Sample)</title>" +
				"    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\">" +
				"</head>" +
				"<body>" +
				"    <p>This is a page that just contains some simple <i>formatted</i>" +
				"    <b>text</b> and an image</p>" +
				"    <img src=\"name:ImageData\" width=\"426\" height=\"68\" >" +
				"</body>" +
				"</html>";
        
        onenoteApi.createPageInDefaultSection(accessToken, {
            'Presentation': {
                body: htmlPayload,
                contentType: "text/html"
            },
            'ImageData': {
                body: fs.readFileSync(path.normalize(__dirname + "/../public/images/doge.jpg")),
                contentType: "image/jpeg"
            }
        }, callback, true);
    };
    
    /**
     * Create OneNote Page with a Screenshot of HTML
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
	this.createPageWithScreenshotFromHtml = function (accessToken, callback) {
        var htmlPayload =
 "<!DOCTYPE html>" +
				    "<html>" +
				    "<head>" +
				    "    <title>A page created with a screenshot of HTML on it (Node.js Sample)</title>" +
				    "    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\"/>" +
				    "</head>" +
				    "<body>" +
				    "    <img data-render-src=\"name:HtmlForScreenshot\" />" +
				    "</body>" +
				    "</html>",

            htmlForScreenshot =
 "<html>" +
					"<head>" +
					"   <title>Embedded HTML</title>" +
					"</head>" +
					"<body>" +
					"    <h1>This is a screen grab of a web page</h1>" +
					"    <p>" +
					"    Lorem ipsum dolor sit amet, consectetur adipiscing elit." +
					"    Nullam vehicula magna quis mauris accumsan, nec imperdiet nisi tempus. " +
					"    Suspendisse potenti. Duis vel nulla sit amet turpis venenatis elementum. " +
					"    Cras laoreet quis nisi et sagittis. Donec euismod at tortor ut porta. " +
					"    Duis libero urna, viverra idaliquam in, ornare sed orci. " +
					"    Pellentesque condimentum gravida felis, sed pulvinar erat suscipit sit amet. Nulla id felis quis " +
					"    sem blandit dapibus. " +
					"    Utviverra auctor nisi ac egestas. " +
					"    Quisque ac neque nec velit fringilla sagittis porttitor sit amet quam." +
					"    </p>" +
					"</body>" +
					"</html>";
        
        onenoteApi.createPageInDefaultSection(accessToken, {
            'Presentation': {
                body: htmlPayload,
                contentType: "text/html"
            },
            'HtmlForScreenshot': {
                body: htmlForScreenshot,
                contentType: "text/html"
            }
        }, callback, true);
    };
    
    /**
     * Create OneNote Page with a Screenshot of a URL
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
	this.createPageWithScreenshotFromUrl = function (accessToken, callback) {
        var htmlPayload =
 "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"    <title>A page created with a URL snapshot on it (Node.js Sample)</title>" +
				"    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\"/>" +
				"</head>" +
				"<body>" +
				"    <img data-render-src=\"http://www.onenote.com\" alt=\"An important web page\" />" +
				"    Source URL: <a href=\"http://www.onenote.com\">http://www.onenote.com</a>" +
				"</body>" +
				"</html>";
        
        onenoteApi.createPageInDefaultSection(accessToken, htmlPayload, callback, false);
    };
    
    /**
     * Create OneNote Page with an Embedded File
     *
     * @param {string} accessToken The access token
     * @param {createPageCallback} callback The callback with response data
     */
	this.createPageWithFile = function (accessToken, callback) {
        var htmlPayload =
 "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"    <title>A page with a file on it (Node.js Sample)</title>" +
				"    <meta name=\"created\" content=\"" + dateTimeNowISO() + "\"/>" +
				"</head>" +
				"<body>" +
				"    <object data-attachment=\"PDF File.pdf\" data=\"name:EmbeddedFile\" type=\"application/pdf\"></object>" +
				"    <img data-render-src=\"name:EmbeddedFile\" />" +
				"</body>" +
				"</html>";
        
        onenoteApi.createPageInDefaultSection(accessToken, {
            'Presentation': {
                body: htmlPayload,
                contentType: "text/html"
            },
            'EmbeddedFile': {
                body: fs.readFileSync(path.normalize(__dirname + "/../public/attachments/attachmentSample.pdf")),
                contentType: "application/pdf"
            }
        }, callback, true);
    };
    
    this.getNotebooks = function (accessToken, callback) {
        onenoteApi.getNotebooks(accessToken, callback);
    };
    
    this.getNotebooksWithExpand = function (accessToken, callback) {
        onenoteApi.getNotebooks(accessToken, callback, { expand: "sections($expand=pages)" });
    };
    
    this.getSharedPages = function (accessToken, callback) {
        onenoteApi.getPages(accessToken, callback, { filter: "parentNotebook/isShared eq true", top: "500" });
    };
    
    function getPagesContentNodesRecursive(accessToken, pages, pagesMetadata, index, callback) {
        // TODO: make this in parallel - 5 at a time?
        if (pages.length <= index) {
            return callback(null, pagesMetadata);
        }
        
        var page = pages[index];
        return onenoteApi.getPageJsonContent(accessToken, function (error, httpResponse, body) {
            if (error) {
                return callback(error);
            }
            
            // Parse the body since it is a JSON response
            var parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = {};
            }
            
            // Get paragraph nodes
            var pageMetadata =
            {
                lastModifiedTime: page.lastModifiedTime,
                pageTitle: page.title,
                pageId: page.id,
                createdBy: page.createdByAppId,
                createdTime: new Date(page.createdTime),
                pageWebUrl: page.links.oneNoteWebUrl.href,
                pageClientUrl: page.links.oneNoteClientUrl.href
            };
            oneNoteNodes.setPageMetadata(parsedBody, pageMetadata);
            if (pageMetadata.paragraphs.length > 0 || pageMetadata.images.length > 0) {
                pagesMetadata.push(pageMetadata);
            }
            
            // Recursively iterate
            return getPagesContentNodesRecursive(accessToken, pages, pagesMetadata, index + 1, callback);
        }, page.id);
    }
    
    function getPagesContentNodes(accessToken, pages, callback) {
        var pagesMetadata = [];
        return getPagesContentNodesRecursive(accessToken, pages, pagesMetadata, 0, callback);
    }
    
    this.getLastDayPageMetadata = function (accessToken, callback) {
        var nowDate = new Date();
        nowDate.setDate(nowDate.getDate() - 1); // Go back one day!
        var dateString = nowDate.toISOString();
        var filter = "parentNotebook/isShared eq true and lastModifiedTime ge " + dateString;
        onenoteApi.getPages(accessToken, function (error, httpResponse, body) {
            if (error) {
                return callback(error);
            }
            
            var parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch (e) {
                parsedBody = {};
            }
            var pages = parsedBody["value"];
            
            if (!pages) {
                return callback("Failed to get pages!");
            }
            
            // We should have gotten 10 pages back. For each of them, call testpages/id
            // Parse the body since it is a JSON response
            return getPagesContentNodes(accessToken, pages, function (error, pagesMetadata) {
                if (error) {
                    return callback(error);
                }
                
                return callback(null, pagesMetadata);
            });
        }, { orderBy: "lastModifiedTime desc", filter: filter });
    };
    
    this.getTermMetadata = function (accessToken, callback, terms) {
        this.getLastDayPageMetadata(accessToken, function (error, pagesMetadata) {
            if (error) {
                console.log("Error when fetching pages from last dat.");
                return callback(error);
            }

            console.log("Successfully fetched " + pagesMetadata.length + " pages from last day.");

            var termMetadata = metadataFilters.getTermsMetadata(pagesMetadata, terms);
            return callback(null, termMetadata);
        });
    };
    
    this.getPageJsonContent = function (accessToken, callback, pageId) {
        onenoteApi.getPageJsonContent(accessToken, callback, pageId);
    };
};

module.exports = new CreateExamples();