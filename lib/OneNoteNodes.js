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
};
module.exports = new OneNoteNodes();