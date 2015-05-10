var request = require("request");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");

var OneNoteApi = function() {

	// START URL Building

	var onenoteApiEndpoint = "https://www.onenote.com/api/beta/";
	var oneNotePagesApiUrl = onenoteApiEndpoint + "pages";
	var oneNoteTestPagesApiUrl = onenoteApiEndpoint + "testpages";
	var oneNoteNotebooksApiUrl = onenoteApiEndpoint + "notebooks";
	var oneNoteSectionsApiUrl = onenoteApiEndpoint + "sections";

	// URL for notebooks/{id}/sections
	function oneNoteApiSectionInNotebookUrl(notebookId) {
		return oneNoteNotebooksApiUrl + "/" + notebookId + "/sections";
	}

	// URL for sections/{id}/pages
	function oneNoteApiPageInSectionUrl(sectionId) {
		return oneNoteSectionsApiUrl + "/" + sectionId + "/pages";
	}
	
	// URL for testpages/{id}
	function oneNoteApiTestPagesWithIdUrl(pageId) {
		return oneNoteTestPagesApiUrl + "/" + pageId;
    }
    
    // URL for pages/{id}/content
    function oneNoteApiPagesContentWithIdUrl(pageId) {
        return oneNotePagesApiUrl + "/" + pageId + "/content";
    }

	// END URL Building

	// START HTTP utilities
	function buildHttpOptions(accessToken, url, contentType, body, queryOptions, encoding) {
		if (queryOptions !== undefined && queryOptions != null) {
			url = url + "?";
			if (queryOptions.expand !== undefined) {
				url = url + "&$expand=" + encodeURIComponent(queryOptions.expand);
			}
			if (queryOptions.filter !== undefined) {
				url = url + "&$filter=" + encodeURIComponent(queryOptions.filter);
			}
			if (queryOptions.top !== undefined) {
				url = url + "&$top=" + encodeURIComponent(queryOptions.top);
			}
			if (queryOptions.orderBy !== undefined) {
				url = url + "&$orderby=" + encodeURIComponent(queryOptions.orderBy);
			}
		}

		var headers = {
            'Authorization': "Bearer " + accessToken,
            'X-TargetStore' : "OneDrive"
        };

		if (contentType != null) headers['Content-Type'] = contentType;

		var options = {
			url: url,
			headers: headers,
			body: body
        };

		if (encoding != null) options.encoding = encoding;

		return options;
	}

	function sendOneNoteMultipartRequest(accessToken, url, payload, callback, multipart) {
		var options = {
			url: url,
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
			_.each(payload, function(partData, partId) {
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

	// START Public interface

	this.createPageInDefaultSection = function(accessToken, payload, callback, multipart) {
		sendOneNoteMultipartRequest(accessToken, oneNotePagesApiUrl, payload, callback, multipart);
	};
	this.createPageInSection = function(accessToken, payload, sectionId, callback, multipart) {
		sendOneNoteMultipartRequest(accessToken, oneNoteApiPageInSectionUrl(sectionId), payload, callback, multipart);
	};
	this.createNotebook = function(accessToken, notebookName, callback) {
		var options = buildHttpOptions(accessToken,
			oneNoteNotebooksApiUrl,
			"application/json",
			"{\"name\":\"" + notebookName + "\"}");

		var r = request.post(options, callback);
	};
	this.createSection = function(accessToken, notebookId, sectionName, callback) {
		var options = buildHttpOptions(accessToken,
			oneNoteApiSectionInNotebookUrl(notebookId),
			"application/json",
			"{\"name\":\"" + sectionName + "\"}");

		var r = request.post(options, callback);
	};
	
	this.getNotebooks = function (accessToken, callback, queryOptions) {

		var options = buildHttpOptions(accessToken,
				oneNoteNotebooksApiUrl,
				"application/json",
				null,
				queryOptions);

		request.get(options, callback);
	};

	this.getPages = function (accessToken, callback, queryOptions) {

		var options = buildHttpOptions(accessToken,
				oneNotePagesApiUrl,
				"application/json",
				null,
				queryOptions);
		
		request.get(options, callback);
	};

	
	this.getPageJsonContent = function (accessToken, callback, pageId) {
		
		var options = buildHttpOptions(accessToken,
				oneNoteApiTestPagesWithIdUrl(pageId),
				"application/json",
				null);
		
		request.get(options, callback);
    };

    this.getResourceContent = function (accessToken, resourcesUrl, callback) {
        
        var options = buildHttpOptions(accessToken,
				resourcesUrl,
				null,
				null,
                null,
                'binary');
        
        request.get(options, callback);
    };

	// END Public interface
};
module.exports = new OneNoteApi();