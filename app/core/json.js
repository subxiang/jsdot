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


/** Load a graph from the JSON representation.
 * The return value indicates whether an error occurred.
 * Returns 0 on success: everything went fine and the graph has been changed.
 * Returns 1 on fixed error: something was wrong in the JSON representation but
 * it has been skipped and the graph has been changed.
 * Returns 2 on fatal error: e.g. when the input is not valid JSON, the graph
 * does NOT change.
 * On error, JSDor.error has a message describing it. On multiple errors only the
 * last one is preserved.
 * 
 * @param jg JSON representation of a graph
 * @return {Number} 0 on success, 1 error found but skipped, 2 on fatal error
 */
JSDot.prototype.loadJSON = function (jg) {
	var retval = 0;
	
	// parse the JSON string 'jg'
	try {
		if (jg.constructor == String) {
			if (JSON != undefined)
				// FIXME: catch exception on malformed json
				jg = JSON.parse(jg);
			else
				jg = jsonParse(jg);
		}
	} catch (e) {
		if (e instanceof SyntaxError) {
			e.message = 'The input is not a valid JSON string';
			this.error = e;
			return 2;
		} else
			throw (e);
	}
	
	// helper functions
	function saneString(str) {
		return (str != undefined && str.constructor == String) ? str : "";
	}
	
	function saneAttributes(attr) {
		return (attr != undefined && attr.constructor == Object) ? new Object(attr) : {};
	}
	//
	
	// start with an empty graph
	this.emptyGraph();
	var g = this.graph;
	
	g.name = saneString(jg.name);
	g.directed = jg.directed ? true : false;
	g.attributes = saneAttributes(jg.attributes);
	g.nodes = {};
	g.edges = {};
	
	if (jg.nodes.constructor == Array) {
	for (var i=0; i < jg.nodes.length; i++) {
		var jn = jg.nodes[i];
		// allow the node to be just a string and use it as name
		var name = saneString(typeof jn == "string" ? jn : jn.name)
		var n = this.newNode(name);
		if (!n) {
			this.error = {'name': 'RangeError', 'message': 'duplicate node name "'+name+'"'};
			retval = 1;
		} else
			n.attributes = saneAttributes(jn.attributes);
	}} else {
		this.error = {'name': 'TypeError', 'message': '"nodes" must be an array'};
		retval = 1;
	}
	
	if (jg.edges.constructor == Array) {
	for (var i=0; i < jg.edges.length; i++) {
		var je = jg.edges[i];
		// FIXME: check if nodes are defined
		var e = this.newEdge(je.src, je.dst);
		if (!e) {
			this.error = {'name': 'RangeError', 'message': 'found edge with inexistent node'};
			retval = 1;
		} else
			e.attributes = saneAttributes(je.attributes);
	}} else {
		this.error = {'name': 'TypeError', 'message': '"nodes" must be an array'};
		retval = 1;
	}
	
	return retval;
	
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
	
	for (var i in g.nodes) {
		var node = g.nodes[i];
		var n = {};
		n.name = node.name;
		n.attributes = node.attributes;
		res.nodes.push(n);
	}
	
	for (var i in g.edges) {
		var edge = g.edges[i];
		var e = {};
		e.src = edge.src.name;
		e.dst = edge.dst.name;
		e.attributes = edge.attributes;
		res.edges.push(e);
	}
	res.attributes = g.attributes;
	
	return JSON.stringify(res);
}
