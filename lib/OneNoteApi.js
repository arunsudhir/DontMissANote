var request = require("request");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");

var OneNoteApi = function() {

	// START URL Building

	var onenoteApiEndpoint = "https://www.onenote.com/api/beta/";
	var oneNotePagesApiUrl = onenoteApiEndpoint + "pages";
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

	// END URL Building

	// START HTTP utilities
	function buildHttpOptions(accessToken, url, contentType, body) {
		var options = {
			url: url,
			headers: {
				'Authorization': "Bearer " + accessToken,
				'Content-Type': contentType
			},
			body: body
		};

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
	
	this.getNotebooks = function (accessToken, callback, expand) {

		var options;
		if (expand !== undefined) {
			options = buildHttpOptions(accessToken,
				oneNoteNotebooksApiUrl + "?$expand=" + expand,
				"application/json",
				null);
		} else {
			options = buildHttpOptions(accessToken,
				oneNoteNotebooksApiUrl,
				"application/json",
				null);
		}

		request.get(options, callback);
	};


	
	// END Public interface
};
module.exports = new OneNoteApi();