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

/**
	Construct a new view.
	@class Graph visualization.
	This paints the SVG.
	@constuctor
	@param {JSDot} jsdot JSDot instance
	@param {String} divId id of the div container
*/
JSDot.View = function(jsdot, divId) {

	/** Associated JSDot instance. */
	this.jsdot = jsdot;
	
	/** Id of the containing div tag. */
	this.divId = divId;
	
	/** Containing div element. */
	this.container = document.getElementById(divId);
	
	/** SVG owning document. */
	this.svgdoc = this.container.ownerDocument;
	
	var div = document.createElement('div'); // used to get the offset of the svg inside the page
	this.container.appendChild(div);
	
	/** SVG element.
		This is where we draw.
	*/
	this.svgroot = JSDot.helper.cesvg("svg"); // create element
	div.appendChild(this.svgroot);
	
	div.setAttribute('style', 'height: 100%; width: 100%;'); // fills container size
	this.svgroot.setAttribute("id", divId+"_svg");
	this.svgroot.setAttribute("xmlns", JSDot.helper.svgns);
	this.svgroot.setAttribute("xmlns:xlink", JSDot.helper.xlinkns);
	
	/** View data associated to nodes. */
	this.nodeData = {};
	
	/** View data associated to edges. */
	this.edgeData = {};
	
	this.addHandler(); /* add listener to receive graph updates */
};

JSDot.View.prototype = {
	
	/** View identifier.
		Returns a string which can be used to build ids for DOM elements
		belonging to the view.
		@return {String} identifier
	*/
	getViewId: function() {
		return 'jsdot-v'+this.divId;
	},
	
	/** Draw a node.
		@param {Node} n the node to draw
	*/
	drawNode: function(n){
		if (!n) return;
		
		/* get associated view data, if it doesn't exist create it */
		var nd = this.nodeData[n.name];
		if (!nd) {
			nd = {};
			this.nodeData[n.name] = nd;
		}
		
		/* create group for this node */
		var g = JSDot.helper.cesvg('g');
		g.jsdot_node = n;
		this.svgroot.appendChild(g);
		nd.group = g;
		
		/* resolve node stencil */
		nd.stencil = JSDot.stencils[n.stencil];
		if (!nd.stencil) {
			/* get a fallback */
			for (var i in JSDot.stencils) {
				nd.stencil = JSDot.stencils[i];
				break;
			}
		}
		
		/* draw the node */
		nd.stencil.draw(n, nd, g);
		nd.stencil.setPosition(n, nd);
		
		/* if it hasn't already been done, resolve label stencil name
		   to the actual stencil object */
		if (!nd.labelStencil) {
			nd.labelStencil = JSDot.node_label_stencils[n.label.type];
			if (!nd.labelStencil) {
				nd.labelStencil = JSDot.node_label_stencils['plain'];
			}
			n.label.value = n.label.value || ''; /* just make sure it is there */
		}
		nd.labelStencil.draw(n, nd, g);
		nd.labelStencil.setPosition(n, nd);
		
		/* now that the label has been drawn we can set the size of the node */
		nd.stencil.setSize(n, nd, nd.labelStencil.getSize(n, nd));
	},
	
	/** Move node to a new position.
		Move the node without redrawing it, but must already have been drawn.
	*/
	updateNodePos: function(n) {
		var nd = this.nodeData[n.name];
		nd.stencil.setPosition(n, nd);
		nd.labelStencil.setPosition(n, nd);
	},
	
	/** Draw a node and its edges.
		Draw a node and all edges it is connected to (both in- and out-bound).
		@param {Node_impl} n node to be drawn
	*/
	drawNodeWithEdges: function(n) {
		this.drawNode(n);
		for (var e in n.edges) {
			this.drawEdge(n.edges[e]);
		}
	},
	
	/** Remove a node from the drawing.
	@param {Node_impl} n node to remove
	*/
	removeNode: function(n) {
		var nd = this.nodeData[n.name];
		if (nd) {
			this.svgroot.removeChild(nd.group);
			delete this.nodeData[n.name];
		}
	},
	
	/** Draw an edge.
		@param {Edge} e the edge to draw
	*/
	drawEdge: function(e) {
		
		/* get associated view data, if it doesn't exist create it */
		var ed = this.edgeData[e.id];
		if (!ed) {
			ed = {};
			this.edgeData[e.id] = ed;
		}
		
		/* resolve edge stencil */
		ed.stencil = JSDot.edge_stencils[e.stencil];
		if (!ed.stencil) {
			/* get a fallback */
			for (var i in JSDot.edge_stencils) {
				ed.stencil = JSDot.edge_stencils[i];
				break;
			}
		}
		
		/* create a group for the edge */
		var g = JSDot.helper.cesvg('g');
		g.jsdot_edge = e;
		this.svgroot.appendChild(g);
		ed.group = g;
		
		this.computeEdgePosition(e);
		
		/* draw the edge */
		ed.stencil.draw(e, ed, g);
		ed.stencil.setPosition(e, ed);
		
		/* draw label only if it exists */
		if (e.label) {
			/* if not already done resolve label stencil */
			if (!ed.labelStencil) {
				ed.labelStencil = JSDot.edge_label_stencils[e.label.type];
				if (!ed.labelStencil) {
					ed.labelStencil = JSDot.edge_label_stencils['plain'];
				}
				e.label.value = e.label.value || ''; /* just make sure it is there */
			}
			ed.labelStencil.draw(e, ed, g);
			ed.labelStencil.setPosition(e, ed);
		}
	},
	
	/** Move an edge.
		Updates an edge's position without completely redrawing it.
	*/
	updateEdgePos: function(e) {
		this.computeEdgePosition(e);
		var ed = this.edgeData[e.id];
		ed.stencil.setPosition(e, ed);
		if (e.label) ed.labelStencil.setPosition(e, ed);
	},
	
	/** Computes the position where the edge must be drawn.
		@private
		The position is stored as e.view.start and e.view.end
		and depends on the shape of the connected nodes.
		
		The drawing is not changed, use @link edge_stencil#setPosition for that.
		@param {Edge} e edge whose position must be updated
	*/
	computeEdgePosition: function(e) {
		var ed = this.edgeData[e.id];
		var srcD = this.nodeData[e.src.name];
		var dstD = this.nodeData[e.dst.name];
		ed.start = srcD.stencil.getBoundaryTo(e.src, srcD, e.dst.position);
		ed.end = dstD.stencil.getBoundaryTo(e.dst, dstD, e.src.position);
	},
	
	/** Remove an edge from the drawing.
	@param {Edge_impl} e edge to remove
	*/
	removeEdge: function(e) {
		var ed = this.edgeData[e.id];
		if (ed.group) {
			this.svgroot.removeChild(ed.group);
			delete this.edgeData[e.id];
		}
	},

	/** Bounding box of a node's shape.
		Bounding box contains 'height', 'width', 'x', 'y' and is relative to SVG.
		@param {JSDot.Node_impl} v Node
		@return {Object} bounding box
	*/
	getBBox: function(v) {
		if (v.isNode) {
			var d = this.nodeData[v.name];
			return d.stencil.getBBox(v, d);
		} else {
			return {'height': 0, 'width': 0, 'x': 0, 'y': 0 };
		}
	},
	
	/** Register handler needed by the view.
		Defines and registers the event handler that allows the view to receive
		model and selection updates notifications.
	*/
	addHandler: function() {
		var handler = {};
		var view = this;
		
		var selectionchgH = function(n, s) {
			var d;
			if (n.isNode) {
				d = view.nodeData[n.name];
			} else {
				d = view.edgeData[n.id];
			}
			d.stencil.highlight(n, d, s);
			d.highlight = s; /* needed to make highlighting survive a 'changed' event */
		};
		
		handler.created = function(n) {
			if (n.isEdge) {
				view.drawEdge(n);
			} else {
				view.drawNodeWithEdges(n);
			}
		};
		
		handler.removed = function(n) {
			if (n.isEdge) {
				view.removeEdge(n);
			} else {
				view.removeNode(n);
				for (e in n.edges) {
					view.removeEdge(n.edges[e]);
				}
			}
		};
		
		handler.moved = function(n) {
			if (n.isNode) { /* it is a node */
				view.updateNodePos(n);
				for (var i in n.edges) {
					view.updateEdgePos(n.edges[i]);
				}
			}
		};
		
		handler.changed = function(n) {
			if (n.isEdge) { /* edge */
				var sel = view.edgeData[n.id].highlight;
				view.removeEdge(n);
				view.drawEdge(n);
				if (sel) this.selectionchg(n, sel);
			} else { /* node */
				var sel = view.nodeData[n.name].highlight;
				view.removeNode(n);
				view.drawNode(n);
				if (sel) this.selectionchg(n, sel);
				/* edges do not need to be redrawn, just update them */
				for (i in n.edges) {
					view.updateEdgePos(n.edges[i]);
				}
			}
		};
		
		this.jsdot.addEventHandler(null, handler); /* graph events */
		this.jsdot.addEventHandler(this, 'selectionchg', selectionchgH);
	},
	
	/** DOM Element offset relative to document.
		@param {DOM Element} e
		@return {Array(left, top)} offsetLeft and offsetTop relative to document
	*/
	getOffset: function(e) {
		var l = 0, t = 0;
		do {
			l += e.offsetLeft;
			t += e.offsetTop;
			e = e.offsetParent;
		} while (e);
		return [l, t];
	},
	
	/** Add relative coordinates to an event.
		Takes an event and add to it .relX and .relY which are the coordinates
		relative to this view.
		@param {DOM Event} evt event for which the relative coordinates are computed
	*/
	addRelCoord: function(evt) {
		var offset = this.getOffset(this.svgroot.parentNode);
		evt.relX = evt.pageX - offset[0];
		evt.relY = evt.pageY - offset[1];
	},
	
	/** Fire an event affecting this view.
		This is a shorthand to call {@link JSDot.jsdot_Impl.fireEvent} with this
		view as first argument.
		@see JSDot.jsdot_Impl.fireEvent
	*/
	fireViewEvent: function() {
		Array.prototype.unshift.call(arguments, this);
		return this.jsdot.fireEvent.apply(this.jsdot, arguments);
	},
	
	/** Add a class to the SVG element.
		This is needed because JQuery doesn't work on the svg.
		@param {String} class class to add
	*/
	addClass: function(class) {
		var c = (this.svgroot.getAttribute('class') || '').split(' ');
		if (c.indexOf(class) < 0) {
			c.push(class);
			this.svgroot.setAttribute('class', c.join(' '));
		}
	},
	
	/** Remove a class from the SVG element.
		This is needed because JQuery doesn't work on the svg.
		@param {String} class class to remove
	*/
	removeClass: function(class) {
		var c = (this.svgroot.getAttribute('class') || '').split(' ');
		var i = c.indexOf(class);
		if (i < 0) return;
		c.splice(i, 1);
		this.svgroot.setAttribute('class', c.join(' '));
	},
	
};
