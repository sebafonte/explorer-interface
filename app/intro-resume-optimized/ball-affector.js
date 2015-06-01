
function affect(ballsEffect) {
	var nodes = getNodes();
	var direction = [1.0, 1.0, 0.0]
	var delta = 0.1;
	
	for (var node in nodes) {
		if (node.level < 20.0) {
			node.x += direction[0] * delta;
			node.y += direction[1] * delta;
			node.z += direction[2] * delta;
		}
		}
}

function getNodes(ballsEffect) {
	return getNodesNode(ballsEffect.root);
}

function getNodesNode(node) {
	var nodes = [];
	for (var node in node.children) {
		nodes.push(node);
	}
	return nodes;
}