/*
This file is part of the JSDot library 
 
http://code.google.com/p/jsdot/

Copyright (c) 2009 Lucia Blondel, Nicos Giuliani, Carlo Vanini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/


/** Returns a new instance of a GraphItem.
 * GraphItems represent graphs, edges and nodes.
 * Usage: var g = newGraph();
 */
JSDot.prototype.newGraphItem = function () {
	var res = {};
	res.name = "";
	res.attributes = {};
	
	return res;
}


/** Load a graph from the JSON representation.
 * @param jg JSON representation of a graph
 */
JSDot.prototype.loadJSON = function (jg) {
	var nodes_ref = {};
	var g = this.newGraphItem();
	
	if (jg.constructor == String) {
		if (JSON != undefined)
			// FIXME: catch exception on malformed json
			jg = JSON.parse(jg);
		else
			jg = jsonParse(jg);
	}
	
	// helper functions
	function saneString(str) {
		return (str != undefined && str.constructor == String) ? str : "";
	}
	
	function saneAttributes(attr) {
		return (attr != undefined && attr.constructor == Object) ? new Object(attr) : {};
	}
	//
	
	g.name = saneString(jg.name);
	g.directed = jg.directed ? true : false;
	g.attributes = saneAttributes(jg.attributes);
	g.nodes = [];
	g.edges = [];
	
	if (jg.nodes.constructor == Array) {
	for (var i=0; i < jg.nodes.length; i++) {
		var jn = jg.nodes[i];
		// allow the node to be just a string and use it as name
		var n = this.newNode(saneString(typeof jn == "string" ? jn : jn.name));
		n.attributes = saneAttributes(jn.attributes);
		g.nodes[i] = n;
		// FIXME: check if n.name is already defined
		nodes_ref[n.name] = n;
	}}
	
	if (jg.edges.constructor == Array) {
	for (var i=0; i < jg.edges.length; i++) {
		var je = jg.edges[i];
		// FIXME: check if nodes are defined
		var e = this.newEdge(nodes_ref[je.src], nodes_ref[je.dst]);
		e.attributes = saneAttributes(je.attributes);
		g.edges[i] = e;
	}}
	
	this.graph = g;
	this.graph._nodes_map = nodes_ref;
}

/** Returns a JSON representation of the graph
 * @return string
 */
JSDot.prototype.toJSON = function() {
	var g = this.graph;
	var res = {};
	res.name = g.name;
	res.directed = g.directed;
	res.nodes = [];
	res.edges = [];
	
	for (var i = 0; i < g.nodes.length; i++) {
		var n = g.nodes[i];
		res.nodes[i] = n;
	}
	
	for (var i = 0; i < g.edges.length; i++) {
		var edge = g.edges[i];
		var e = {};
		e.src = edge.src.name;
		e.dst = edge.dst.name;
		e.attributes = edge.attributes;
		res.edges[i] = e;
	}
	res.attributes = g.attributes;
	
	return JSON.stringify(res);
}
