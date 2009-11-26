
/** Returns a new instance of a GraphItem.
 * GraphItems represent graphs, edges and nodes.
 * Usage: var g = newGraph();
 */
function newGraphItem() {
	var res = {};
	res.name = "";
	res.attributes = {};
	
	return res;
}

Graph.prototype.setLabel = function (label) {
	this.label = label;
}

/** Load a graph from the JSON representation.
 * 
 */
function loadJSON(jg) {
	var nodes_ref = {};
	var g = newGraphItem();
	
	g.name = jg.name;
	g.directed = jg.directed;
	g.attributes = new Object(jg.attributes);
	g.nodes = [];
	g.edges = [];
	
	for (var i=0; i < jg.nodes.length; i++) {
		var jn = jg.nodes[i];
		var n = newGraphItem();
		n.name = jn.name;
		n.attributes = new Object(jn.attributes);
		g.nodes[i] = n;
		// FIXME: check if n.name is already defined
		nodes_ref[n.name] = n;
	}
	
	for (var i=0; i < jg.edges.length; i++) {
		var je = jg.edges[i];
		var e = newGraphItem();
		// FIXME: check if defined
		e.src = nodes_ref[je.src];
		e.dst = nodes_ref[je.dst];
		n.attributes = new Object(je.attributes);
		g.edges[i] = e;
	}
}
