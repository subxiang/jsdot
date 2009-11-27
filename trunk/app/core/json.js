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
	
	/*
	if (jg.constructor == String) {
		eval("jg =" + jg +";");
	}*/
	
	g.name = jg.name;
	g.directed = jg.directed;
	g.attributes = new Object(jg.attributes);
	g.nodes = [];
	g.edges = [];
	
	for (var i=0; i < jg.nodes.length; i++) {
		var jn = jg.nodes[i];
		var n = this.newGraphItem();
		n.name = jn.name;
		n.attributes = new Object(jn.attributes);
		g.nodes[i] = n;
		// FIXME: check if n.name is already defined
		nodes_ref[n.name] = n;
	}
	
	for (var i=0; i < jg.edges.length; i++) {
		var je = jg.edges[i];
		var e = this.newGraphItem();
		// FIXME: check if defined
		e.src = nodes_ref[je.src];
		e.dst = nodes_ref[je.dst];
		n.attributes = new Object(je.attributes);
		g.edges[i] = e;
	}
	
	this.graph = g;
}
