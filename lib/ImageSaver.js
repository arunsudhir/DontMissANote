var fs = require("fs");
var path = require("path");

var ImageSaver = function () {

	var imagesRootPath = "/../public/onenoteuploads/";

    this.saveImage = function (imageContent, imageName) {
        var imageUrl = "http://onenoteapisamples.com:3000/onenoteuploads/" + imageName;
        fs.writeFileSync(path.normalize(__dirname + imagesRootPath + imageName), imageContent);
        return imageUrl;
    };

};

module.exports = new ImageSaver();