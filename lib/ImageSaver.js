var fs = require("fs");
var path = require("path");
var onenoteApi = require("./OneNoteApi.js");

var ImageSaver = function () {

    var imagesRootPath = "/../public/onenoteuploads/";
	var defaultExtension = ".png";
    
    var saveImagePrivate = function (imageContent, imageName) {
        var imageUrl = "https://onenotealerts.herokuapp.com/onenoteuploads/" + imageName + defaultExtension;
        fs.writeFileSync(path.normalize(__dirname + imagesRootPath + imageName + defaultExtension), imageContent, 'binary');
	    console.log("Saved image with url " + imageUrl);
        return imageUrl;
    };

    this.saveImage = function (imageContent, imageName) {
	    return saveImagePrivate(imageContent, imageName);
    };
    
    function getImageBinaryInfoRecursive(accessToken, imageArray, callback, imageIndex) {
        if (imageIndex >= imageArray.length) {
		    return callback(null); // done!
        }

        var image = imageArray[imageIndex];
	    return onenoteApi.getResourceContent(accessToken, image.resourcesUrl, function(error, httpResponse, body) {
            if (error) {
                console.log("Error while getting images!");
	            console.log(error);
			    return callback(error);
            }

            var content = body;
            var name = image.id;
            image.publicUrl = saveImagePrivate(content, name); // TODO: don't store images in the server, include them in the email (so the server doesn't fill up)

		    return getImageBinaryInfoRecursive(accessToken, imageArray, callback, imageIndex + 1);
	    });
    }

    var getImageBinaryInfo = function(accessToken, imageArray, callback) {
	    return getImageBinaryInfoRecursive(accessToken, imageArray, callback, 0);
    }

    this.saveImagesFromTermMetadata = function (accessToken, termMetadata, callback) {

        var imagesToSave = {};
        var imagesArray = [];
        // Get all images we're going to save
        for (var t = 0; t < termMetadata.length; t++) {
            var term = termMetadata[t];
            for (var p = 0; p < term.pages.length; p++) {
                var page = term.pages[p];
                for (var i = 0; i < page.images.length; i++) {
                    var image = page.images[i];
                    if (!imagesToSave[image.id]) {
                        imagesArray.push(image);
	                    imagesToSave[image.id] = image;
                    }
                }
            }
        }
        
        // Get their binary information by calling the API
	    getImageBinaryInfo(accessToken, imagesArray, function(error) {
            if (error) {
	            console.log("Error when getting image information from OneNote API");
	            return callback(error);
            }

		    console.log("Successfully wrote " + imagesArray.length + " images");
		    return callback(null);
	    });
    };

};

module.exports = new ImageSaver();