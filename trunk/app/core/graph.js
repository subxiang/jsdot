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
	
	/*
	 *  ---------- PRIVATE METHODS---------------------
	 *  
	 *  used by all the others getter and setter that are below
	 */
	
	JSDot.prototype.Node.prototype._setAttribute = function(key, value) {
		this.attributes[key] = value;
	};
	
	JSDot.prototype.Node.prototype._getAttribute = function(key) {
		return this.attributes[key];
	}
	/*
	 * -----------------------------------------
	 */
	
	
	/** Returns the name of the node
	 * @return {String} name
	 */
	JSDot.prototype.Node.prototype.getName = function() {
		return this.name;
	};
	
	/** Returns the label to display for the node.
	 * @return {String} label
	 */
	JSDot.prototype.Node.prototype.getLabel = function() {
		var l = this._getAttribute("label");
		return l ? l : this.name;
	}
	
	/** Set a label for the node.
	 * If set to null or undefined the name will be used instead.
	 * 
	 * @param {String} label
	 */
	JSDot.prototype.Node.prototype.setLabel = function(label) {
		this._setAttribute("label", label);
	}
	
	/** Returns the coordinates of the center where the node should be drawn.
	 * @return {Array} coordinates [x, y]
	 */
	JSDot.prototype.Node.prototype.getPos = function() {
		var p = this._getAttribute("pos");
		if (typeof p != "string") return [10, 10];
		p = p.split(',');
		if (p.length != 2) return [10, 10];
		return p;
		//FIXME: defaults here do not really make sense, and the returned values may still not be numbers
	}
	
	/** Set the coordinates of the center of the node
	 * @param {Object} x
	 * @param {Object} y
	 */
	JSDot.prototype.Node.prototype.setPos = function(x, y) {
		this._setAttribute("pos", ""+x+","+y);
	}
	
	/** Return the line color
	 * @return {String} line color
	 */
	JSDot.prototype.Node.prototype.getColor = function() {
		return this._getAttribute("color") || "black";
	}
	
	/** Set the line color
	 * @param {String} color
	 */
	JSDot.prototype.Node.prototype.setColor = function(color) {
		this._setAttribute("color", color);
	}
	
	/** Returns the fill color
	 * @return {String} fill color
	 */
	JSDot.prototype.Node.prototype.getFillColor = function() {
		return this._getAttribute("fillcolor") || "lightgrey";
	}
	
	/** Set the fill color
	 * @param {String} fill color
	 */
	JSDot.prototype.Node.prototype.setFillColor = function(color) {
		this._setAttribute("fillcolor", color);
	}
	
	/** Return the shape to be drawn
	 * The default is "circle"
	 * @return {String} shape
	 */
	JSDot.prototype.Node.prototype.getShape = function() {
		return this._getAttribute("shape") || "circle";
	}
	
	/** Set the shape
	 * @param {String} shape
	 */
	JSDot.prototype.Node.prototype.setShape = function(shape) {
		this._setAttribute("shape", shape);
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
	
	/*
	 *  ---------- PRIVATE METHODS---------------------
	 *  
	 *  used by all the others getter and setter that are below
	 */
	
	JSDot.prototype.Edge.prototype._getAttribute = function(key) {
		return this.attributes[key];
	}
	
	JSDot.prototype.Edge.prototype._setAttribute = function(key, value) {
		this.attributes[key] = value;
	};
	/*
	 * -----------------------------------------
	 */
	
	/** Returns the node where the edge source
	 * @return Node
	 */
	JSDot.prototype.Edge.prototype.getSrc = function(){
		return this.src;
	};
	
	/** Change edge source
	 * @param {Node} src source Node
	 */
	JSDot.prototype.Edge.prototype.setSrc = function(src){
		this.src = src;
	};
	
	/** Returns the node where the edge ends
	 * @return Node
	 */
	JSDot.prototype.Edge.prototype.getDst = function(){
		return this.dst;
	};
	
	/** Change destination of the edge
	 * @param {Node} dst destination Node
	 */
	JSDot.prototype.Edge.prototype.setDst = function(dst) {
		this.dst = dst;
	};	
	
	/** Returns the label to display for the edge
	 * @return {String} label
	 */
	JSDot.prototype.Edge.prototype.getLabel = function() {
		var l = this._getAttribute("label");
		return l ? l : "";
	}
	
	/** Set a label for the edge
	 * if set to null or undefined the name of the edge will be used instead
	 * @param {String} label
	 */
	JSDot.prototype.Edge.prototype.setLabel = function(label) {
		this._setAttribute("label", label);
	}
	
	/** Return the edge color
	 * @return {String} line color
	 */
	JSDot.prototype.Edge.prototype.getColor = function() {
		return this._getAttribute("color") || "black";
	}
	
	/** Set the line color
	 * @param {String} color
	 */
	JSDot.prototype.Edge.prototype.setColor = function(color) {
		this._setAttribute("color", color);
	}
	


	/** Added functionality to JSDot
	 * 
	 */
	
	/** Creates a new node in the graph
	 * if name is missing it will be automatically generated.
	 * @param {String} name optional, the name of the node
	 * @return {Node} the new node
	 */
	JSDot.prototype.newNode = function(name) {
		if (!name) {
			// no name was given, generate one
			while (this.getNodeByName(name = 'n' + (new Date()).getTime())) {};
		} else {
			// a name was given, check that it isn't already in use
			if (this.getNodeByName(name)) {
				return null;
			}
		}
		
		var n = new this.Node(name);
		this.graph.nodes[name] = n;
		return n;
	};

	/** Returns a node of the graph by name
	 * @param {String} name name of the node
	 * @return {Node} the node if found, undefined otherwise
	 */
	JSDot.prototype.getNodeByName = function(name) {
		return this.graph.nodes[name];
	};

	/** Removes a node from the graph
	 * @param {Object,String} node node to remove or its name (as a string)
	 */
	JSDot.prototype.removeNode = function(node) {
		if (node instanceof this.Node) node = node.name;
		delete(this.graph.nodes[node]);
		for (edge in this.graph.edges) {
			if(this.graph.edges[edge].getSrc().name == node) {
				delete(this.graph.edges[edge]);
			}
			if (this.graph.edges[edge]) {
				if (this.graph.edges[edge].getDst().name == node) {
					delete (this.graph.edges[edge]);
				}
			}
		}
	}

	/** Creates an edge connecting node src to dst in the graph
	 * @param {Object} src Source Node or name of the node
	 * @param {Object} dst Destination Node or name of the node
	 * @return {Edge} the new edge
	 */
	JSDot.prototype.newEdge = function(src, dst) {
		if (typeof src == "string") src = this.getNodeByName(src);
		if (typeof dst == "string") dst = this.getNodeByName(dst);
		
		//TODO: check if node already exists
		var e = new this.Edge(src, dst);
		this.graph.edges[e.src.name.length+':'+e.dst.name.length+'-'+e.src.name+'-'+e.dst.name] = e;
		return e;
	}

	/** Returns a new object representing an empty graph.
	 * To reset the model to an empty graph use emptyGraph().
	 * @see emptyGraph
	 * @return {Object} an empty graph (internal representation)
	 */
	JSDot.prototype.getEmptyGraph = function() {
		return {
				name: "",
				directed: false,
				nodes: {},
				edges:{},
				attributes: {}
		};
	};

	/** Resets the graph to an empty one.
	 */
	JSDot.prototype.emptyGraph = function() {
		this.graph = this.getEmptyGraph();
	};
