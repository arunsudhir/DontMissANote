var OneNoteNodes = function () {
	
	// Constants
	var paragraphNodeClassId = "ParagraphNode";
	var imageNodeClassId = "ImageNode";
	var authorMostRecentClassId = "AuthorMostRecent";
	var webPictureContainerClassId = "WebPictureContainer14";
	var pictureContainerClassId = "PictureContainer";

	function getNodesOfTypeRecursive(currentNode, nodes, classId, lastParent) {
		// Don't do anything if null or empty
		if (currentNode === undefined || currentNode == null) {
			return;
		}

		// Is this a paragraph node? Add it to the list
		if (currentNode.ClassId == classId) {
			currentNode.parent = lastParent;
			nodes.push(currentNode);
		}

		// Explore this node's children
		if (currentNode.Children != undefined) {
			for (var i = 0; i < currentNode.Children.length; i++) {
				getNodesOfTypeRecursive(currentNode.Children[i], nodes, classId, currentNode);
			}
		}
	}
	
	function getResourcesUrlForImageNode(imageNode) {
        if (imageNode.ReferencedObjects) {
	        var referencedObjects = imageNode.ReferencedObjects;
            for (var i = 0; i < referencedObjects.length; i++) {
                var referencedObject = referencedObjects[i];
                if (referencedObject.Name === webPictureContainerClassId || referencedObject.Name === pictureContainerClassId) {
	                return referencedObject.ObjectContent.ResourcesUri;
                }
            }
        }
		return null;
	}
    
    function getParagraphWebUrl(paragraphNode, page) {
		return page.pageWebUrl;
	}
	
	function sortByLastModifiedTime(paragraphNodeMetadata) {
		return paragraphNodeMetadata.sort(function(a, b) {
			return b.lastModifiedTime - a.lastModifiedTime;
		});
	}
	
	function getParagraphClientUrl(paragraphNode, page) {
		var clientUrl = page.pageClientUrl;
		clientUrl = clientUrl.substring(0, clientUrl.length - 4);
		var outlineElementId = paragraphNode.parent.Id;
		var pureId = outlineElementId.substring(0, 38);
		var otherId = outlineElementId.substring(39, 41);
		return clientUrl + "&objectid=" + pureId + "&" + otherId;
	}
	
	function getObjectWithReferencedIdRecursive(currentNode, referenceId) {
		// Don't do anything if null or empty
		if (currentNode === undefined || currentNode == null) {
			return null;
		}
		
		// Check this node's referencedObjects
		if (currentNode.ReferencedObjects != undefined) {
			for (var i = 0; i < currentNode.ReferencedObjects.length; i++) {
				if (currentNode.ReferencedObjects[i].ObjectContent.ReferenceId == referenceId && currentNode.ReferencedObjects[i].ObjectContent.IsReference == false) {
					return currentNode.ReferencedObjects[i];
				}
			}
		}

		// Explore this node's children
		if (currentNode.Children != undefined) {
			for (var i = 0; i < currentNode.Children.length; i++) {
				var author = getObjectWithReferencedIdRecursive(currentNode.Children[i], referenceId);
				if (author != null) {
					return author;
				}
			}
		}
		return null;
	}
	
	this.getParagraphNodes = function (pageContentNode) {
		var paragraphNodes = [];
		getNodesOfTypeRecursive(pageContentNode, paragraphNodes);
		return paragraphNodes;
	};
	
	function getAuthorMostRecentReferenceId(paragraphNode) {
		if (paragraphNode.parent) {
			if (paragraphNode.parent.ReferencedObjects) {
				for (var i = 0; i < paragraphNode.parent.ReferencedObjects.length; i++) {
					if (paragraphNode.parent.ReferencedObjects[i].Name == authorMostRecentClassId) {
						return paragraphNode.parent.ReferencedObjects[i].ObjectContent.ReferenceId;
					}
				}
			}
		}
		return null;
    }
    
    function getAuthorFromCacheOrNodes(paragraphNode, pageContentNode, authors) {
        var author;
        var authorReferenceId = getAuthorMostRecentReferenceId(paragraphNode);
        if (authorReferenceId != null && authors[authorReferenceId]) {
            author = authors[authorReferenceId];
        } else {
            author = getObjectWithReferencedIdRecursive(pageContentNode, authorReferenceId);
            if (author != null) {
                authors[authorReferenceId] = author;
            }
        }
        return author;
    }

	this.setPageMetadata  = function (pageContentNode, pageMetadata) {
		// Get paragraph and image nodes from JSON
		var paragraphNodes = [];
		var imageNodes = [];
		getNodesOfTypeRecursive(pageContentNode, paragraphNodes, paragraphNodeClassId);
		getNodesOfTypeRecursive(pageContentNode, imageNodes, imageNodeClassId);
		var paragraphNodeMetadata = [];
		var imageNodeMetadata = [];
		var authors = {};
        var pageAuthor = pageContentNode.Properties.Author;

		for (var i = 0; i < paragraphNodes.length; i++) {
			var paragraphNode = paragraphNodes[i];

			var author = getAuthorFromCacheOrNodes(paragraphNode, pageContentNode, authors);

			// Don't add paragraphNodes that are empty
			if (paragraphNode.Properties.RichEditTextUnicode) {
				paragraphNodeMetadata.push(
					{
						lastModifiedTime: new Date(paragraphNode.Properties.LastModifiedTime),
						text: paragraphNode.Properties.RichEditTextUnicode,
                        author: ((author == null) ? pageAuthor : author.ObjectContent.Properties.Author),
						paragraphWebUrl: getParagraphWebUrl(paragraphNode, pageMetadata),
						paragraphClientUrl: getParagraphClientUrl(paragraphNode, pageMetadata)
					}
				);
			}
        }
        
        for (var i = 0; i < imageNodes.length; i++) {
            var imageNode = imageNodes[i];
            
            var author = getAuthorFromCacheOrNodes(imageNode, pageContentNode, authors);
	        var resourcesUrl = getResourcesUrlForImageNode(imageNode);
            // Don't add paragraphNodes that are empty
            if (imageNode.Properties.RichEditTextUnicode) {
                imageNodeMetadata.push( // This is a hack to get images in the same array as paragraphs
                    {
                        lastModifiedTime: new Date(imageNode.Properties.LastModifiedTime),
                        text: imageNode.Properties.RichEditTextUnicode,
                        author: ((author == null) ? pageAuthor : author.ObjectContent.Properties.Author),
                        paragraphWebUrl: getParagraphWebUrl(imageNode, pageMetadata),
                        paragraphClientUrl: getParagraphClientUrl(imageNode, pageMetadata),
                        resourcesUrl: resourcesUrl,
                        id: imageNode.Id
                    }
                );
            }
        }
		
		// Sort metadata by last mofified time
        pageMetadata.paragraphs = sortByLastModifiedTime(paragraphNodeMetadata);
        pageMetadata.images = sortByLastModifiedTime(imageNodeMetadata);
	};
};
module.exports = new OneNoteNodes();