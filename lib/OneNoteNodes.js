var OneNoteNodes = function () {
	
	// Constants
	var paragraphNodeClassId = "ParagraphNode";
	
	function getParagraphNodesRecursive(currentNode, paragraphNodes) {
		// Don't do anything if null or empty
		if (currentNode === undefined || currentNode == null) {
			return;
		}

		// Is this a paragraph node? Add it to the list
		if (currentNode.ClassId == paragraphNodeClassId) {
			paragraphNodes.push(currentNode);
		}

		// Explore this node's children
		if (currentNode.Children != undefined) {
			for (var i = 0; i < currentNode.Children.length; i++) {
				getParagraphNodesRecursive(currentNode.Children[i], paragraphNodes);
			}
		}
	}
	
	this.getParagraphNodes = function (pageContentNode) {
		var paragraphNodes = [];
		getParagraphNodesRecursive(pageContentNode, paragraphNodes);
		return paragraphNodes;
	};

	this.getParagraphNodeMetadata = function (pageContentNode) {
		var paragraphNodes = [];
		getParagraphNodesRecursive(pageContentNode, paragraphNodes);

		var paragraphNodeMetadata = [];
		for (var i = 0; i < paragraphNodes.length; i++) {
			var paragraphNode = paragraphNodes[i];
			paragraphNodeMetadata.push(
				{
					lastModifiedTime: new Date(paragraphNode.Properties.LastModifiedTime),
					text: paragraphNode.Properties.RichEditTextUnicode,
					author: "unknown" 	// TODO get author info from graph - keep reference of last OutlineElementNode then get the Author from the ReferencedObjects
				}
			);
		}
		return paragraphNodeMetadata;
	};
};
module.exports = new OneNoteNodes();