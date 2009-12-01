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

/** The node API
 * This defines the functions that can be used by a client
 * to modify a node.
 */
	
	/** Node constructor
	 * DO NOT USE this, use jsdot.newNode(name)
	 */
	JSDot.prototype.Node = function(name) {
		this.name = name;
		this.attributes = {};
		return this;
	};
	
	JSDot.prototype.Node.prototype.getName = function() {
		return this.name;
	};

	JSDot.prototype.Node.prototype.setAttribute = function(key, value) {
		this.attributes[key] = value;
	};
	
	JSDot.prototype.Node.prototype.getAttribute = function(key) {
		return this.attributes[key];
	}


/** Edges API
 * 
 */
	
	/** Edge constructor
	 * DO NOT USE this, use jsdot.newEdge(src, dst)
	 */
	JSDot.prototype.Edge = function(src, dst) {
		this.src = src;
		this.dst = dst;
		this.attributes = {};
		return this;
	};
	
	/** Returns the node where the edge starts.
	 * @return Node
	 */
	JSDot.prototype.Edge.prototype.getSrc = function(){
		return this.src;
	};
	
	/** Change edge source.
	 * @param {Node} src source node
	 */
	JSDot.prototype.Edge.prototype.setSrc = function(src){
		this.src = src;
	};
	
	/** Returns the node where the edge ends.
	 * @return Node
	 */
	JSDot.prototype.Edge.prototype.getDst = function(){
		return this.dst;
	};
	
	/** Change destination of the edge.
	 * 
	 * @param {Node} dst destination node
	 */
	JSDot.prototype.Edge.prototype.setDst = function(dst) {
		this.dst = dst;
	};
	
	JSDot.prototype.Edge.prototype.getAttribute = function(key) {
		return this.attributes[key];
	}
	
	JSDot.prototype.Edge.prototype.setAttribute = function(key, value) {
		this.attributes[key] = value;
	};



/** Added functionality to JSDot
 * 
 */

/** Creates a new node in the graph
 * 
 * @param {String} name the name of the node
 * @return {Node} the new node
 */
JSDot.prototype.newNode = function(name) {
	//TODO: check if name already exists
	var n = new this.Node(name);
	this.graph.nodes.push(n);
	return n;
};

/** Creates an edge connecting node src to dst in the graph.
 * 
 * @param {Object} src Source Node
 * @param {Object} dst Destination Node
 * @return {Edge} the new edge
 */
JSDot.prototype.newEdge = function(src, dst) {
	var e = new this.Edge(src, dst);
	this.graph.edges.push(e);
	return e;
}
