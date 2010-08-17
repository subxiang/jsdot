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
	@param {JSDot.jsdot_Impl} jsdot JSDot instance
*/
JSDot.Graph_impl = function(jsdot) {
	this.jsdot = jsdot;
	this.defaultNodeStencil = JSDot.stencils.circle;
	this.defaultEdgeStencil = JSDot.edge_stencils.line;
};

JSDot.Graph_impl.prototype = {

	/** Nodes in the graph.
		@private
	*/
	nodes: {},
	
	/** Edges in the graph
		@private
	*/
	edges: {},
	
	defaultNodeStencil: null,
	
	defaultEdgeStencil: null,
	
	/** Returns a node by name.
		@param {String} name name of the node
		@return {Node} the node or undefined
	*/
	getNodeByName: function(name) {
		return this.nodes[name];
	},
	
	/** Incremental name for new nodes. */
	lastName: 0,
	
	/** Incremental index for edges. */
	lastEId: 0,
	
	/** Create a new node in the current graph.
		If a name is provided, and a node with the same name already exists
		returns null. If no name is given the next incremental one is used.
		@param {String} name (optional) name of the node
		@param {Boolean} fire whether to fire a {@link doc_Handler.created} event or not, default is true
		@return {JSDot.Node_impl} the created node
	*/
	createNode: function(name, fire) {
		var nn; // node name
		
		if (name) {
			/* use the provided name, if it doesn't alredy exist */
			nn = name;
			if (this.nodes[nn]) return null;
		} else {
			/* generate a name which isn't already used */
			do {nn = ++this.lastName;} while (this.nodes[nn]);
		}
		
		var n = new JSDot.Node_impl(this, nn);
		
		this.nodes[nn] = n;
		if (fire == undefined || fire) this.jsdot.fireEvent('created', n);
		return n;
	},
	
	/** Create a new edge in the current graph.
		@param {JSDot.Node_impl} src starting node
		@param {JSDot.Node_impl} dst ending node
		@param {Boolean} fire whether to fire a {@link doc_Handler.created} event or not, default is true
		@return {JSDot.Edge_impl} the created edge
	*/
	createEdge: function(src, dst, fire) {
		var id; // node name
		/* generate an index which isn't already used */
		do {id = ++this.lastEId;} while (this.edges[id]);
		
		var e = new JSDot.Edge_impl(this, id, src, dst);
		
		src.edges[id] = e;
		dst.edges[id] = e;
		
		this.edges[id] = e;
		if (fire == undefined || fire) this.jsdot.fireEvent('created', e);
		return e;
	},
	
	/** Remove a node from current graph.
		@param {Node_impl} n node to remove
		@param {Boolean} fire whether to fire a {@link doc_Handler.removed} event or not, default is true
	*/
	removeNode: function(n, fire) {
		/* remove edges */
		var e;
		for (id in n.edges) {
			e = n.edges[id];
			/* remove edge from the other connected node, but not from the one we are removing */
			if (e.src == n) {
				delete e.dst.edges[id];
			} else {
				delete e.src.edges[id];
			}
			delete this.edges[id];
		}
		
		delete this.nodes[n.name];
		if (fire == undefined || fire) this.jsdot.fireEvent('removed', n);
	},
	
	/** Remove an edge from current graph.
		@param {Edge_impl} e edge to remove
		@param {Boolean} fire whether to fire a {@link doc_Handler.removed} event or not, default is true
	*/
	removeEdge: function(e, fire) {
		delete this.edges[e.id];
		delete e.src.edges[e.id];
		delete e.dst.edges[e.id];
		if (fire == undefined || fire) this.jsdot.fireEvent('removed', e);
	},
};
