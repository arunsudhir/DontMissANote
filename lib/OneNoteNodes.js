var OneNoteNodes = function () {
	
	// Constants
	var paragraphNodeClassId = "ParagraphNode";
	var authorMostRecentClassId = "AuthorMostRecent";

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
	
	function getParagraphWebUrl(paragraphNode, page) {
		return page.links.oneNoteWebUrl.href;
	}
	
	function getParagraphClientUrl(paragraphNode, page) {
		var clientUrl = page.links.oneNoteClientUrl.href;
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

	this.getParagraphNodeMetadata = function (pageContentNode, page) {
		var paragraphNodes = [];
		getNodesOfTypeRecursive(pageContentNode, paragraphNodes, paragraphNodeClassId);

		var paragraphNodeMetadata = [];
		var authors = {};

		for (var i = 0; i < paragraphNodes.length; i++) {
			var paragraphNode = paragraphNodes[i];

			var authorReferenceId = getAuthorMostRecentReferenceId(paragraphNode);
			var author;
			if (authors[authorReferenceId]) {
				author = authors[authorReferenceId];
			} else {
				author = getObjectWithReferencedIdRecursive(pageContentNode, authorReferenceId);
				authors[authorReferenceId] = author;
			}

			// Don't add paragraphNodes that are empty
			if (paragraphNode.Properties.RichEditTextUnicode) {
				paragraphNodeMetadata.push(
					{
						lastModifiedTime: new Date(paragraphNode.Properties.LastModifiedTime),
						text: paragraphNode.Properties.RichEditTextUnicode,
						author: author.ObjectContent.Properties.Author,
						paragraphWebUrl: getParagraphWebUrl(paragraphNode, page),
						paragraphClientURl: getParagraphClientUrl(paragraphNode, page)
					}
				);
			}
		}
		return paragraphNodeMetadata;
	};
};
module.exports = new OneNoteNodes();