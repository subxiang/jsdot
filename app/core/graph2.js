/*
This file is part of the JSDot library 
 
http://code.google.com/p/jsdot/

Copyright (c) 2010 Carlo Vanini
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

/** Constructs a graph representation.
	@class Graph representation

	@constructor
*/
function jsdot_Graph() {

}

jsdot_Graph.prototype = {

	/** Nodes in the graph.
		@private
	*/
	nodes: {},
	
	/** Edges in the graph
		@private
	*/
	edges: {},
	
	/** Returns a node by name.
		@param {String} name name of the node
		@return {Node} the node or undefined
	*/
	getNodeByName: function(name) {
		return this.nodes[name];
	},
	
	/** Incremental name for new nodes. */
	lastName: 0,
	
	/** Create a new node in the current graph.
		@return {Node_impl} the created node
	*/
	createNode: function() {
		var nn; // node name
		/* generate a name which isn't already used */
		do {nn = ++this.lastName;} while (this.nodes[nn]);
		
		var n = {
			name: nn,
			/* label: default is created in view */
			/* position: */
			/* stencil: default is created in view */
		};
	},

};
