var request = require('request');
var _ = require('underscore');

var config = require('../config');

var LiveConnectClient = function () {
	var oauthAuthorizeUrl = 'https://login.live.com/oauth20_authorize.srf',
		oauthTokenUrl = 'https://login.live.com/oauth20_token.srf',
		liveapiUrl = "https://apis.live.net/v5.0/me",
		livePicApiUrl = liveapiUrl + "/picture";
		clientId = config.clientId,
		clientSecret = config.clientSecret,
		redirectUrl = config.redirectUrl;

	// Helper function to create an encoded url query string from an object
	function toQueryString(obj) {
		var str = [];
		for (var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		return str.join("&");
	}
	
	
	/**
	 * Obtain a Live Api URL based on access token
	 * @returns {string} The Live Api endpoint URL
	 */
	this.getLiveApiUrl = function (accesstoken) {
		var query = toQueryString({
			'access_token': accesstoken
		});
		return liveapiUrl + "?" + query;
	};
	
	/**
	 * Obtain a Live Api URL based on access token
	 * @returns {string} The Live Api endpoint URL
	 */
	var getLivePicApiUrl = function (accesstoken) {
		var query = toQueryString({
			'access_token': accesstoken
		});
		return livePicApiUrl + "?" + query;
	};

	/**
	 * Obtain a Live Connect authorization endpoint URL based on configuration.
	 * @returns {string} The authorization endpoint URL
	 */
	this.getAuthUrl = function () {
		var scopes = ['wl.signin', 'wl.basic', 'wl.emails', 'wl.offline_access', 'office.onenote_update'];
		var query = toQueryString({
			'client_id': clientId,
			'scope': scopes.join(' '),
			'redirect_uri': redirectUrl,
			'display': 'page',
			'locale': 'en',
			'response_type': 'code'
		});
		return oauthAuthorizeUrl + "?" + query;
	};

	/* Live Connect API request sender */
	function requestAccessToken(data, callback) {
		request.post({url: oauthTokenUrl,
				form: _.extend({
					'client_id': clientId,
					'client_secret': clientSecret,
					'redirect_uri': redirectUrl
				}, data)},
			function (error, response, body) {
				if (error) {
					callback({});
				} else {
					callback(JSON.parse(body));
				}
			});
	}

	/**
	 * @callback accessTokenCallback
	 * @param {object} Response data parsed from JSON API result
	 */

	/**
	 * Request an access token by supplying an authorization code.
	 * @param {string} authCode The authorization code
	 * @param {accessTokenCallback} callback The callback with response data
	 */
	this.requestAccessTokenByAuthCode = function (authCode, callback) {
		requestAccessToken({'code': authCode, 'grant_type': 'authorization_code'}, callback);
	};

	/**
	 * Request an access token by supplying a refresh token.
	 * @param {string} refreshToken The refresh token
	 * @param {accessTokenCallback} callback The callback with response data
	 */
	this.requestAccessTokenByRefreshToken = function(refreshToken, callback) {
		requestAccessToken({'refresh_token': refreshToken, 'grant_type': 'refresh_token'}, callback);
	};
    
    
    var getUserPic = function (accessToken, callback) {
        var options = {
            url: getLivePicApiUrl(accessToken),
            method: 'HEAD'
        };
        request.get(options,
			function (error, response, body) {
            if (error) {
                callback({});
            } else {
                callback(null, response, body);
            }
        });
    };

	this.getUserInfo = function (accessToken, callback) {
		var options = {
			url: this.getLiveApiUrl(accessToken)
        };

		request.get(options, function(error, response, body) {
			if (error) {
				return callback(error);
			}

			console.log("Successfully fetched user information.");
			var parsedBody;
			try {
				parsedBody = JSON.parse(body);
			} catch (e) {
				parsedBody = {};
			}

			// Get the submitted resource url from the JSON response
			var signedInUser = parsedBody["name"] ? parsedBody["name"] : (parsedBody["emails"]["preferred"] ? parsedBody["emails"]["preferred"] : null);
			var email = parsedBody["emails"]["preferred"]; // Set the user's email in the session to remember it later

			return getUserPic(accessToken, function(error, httpResponse, body) {
				if (error) {
					return callback(error);
				}

                console.log("Successfully fetched image for signed in user.");

				var image = httpResponse.headers['content-location'];
				return callback(null, signedInUser, image, email);
			});
		});
	};

};
module.exports = new LiveConnectClient();