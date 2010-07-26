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
	this.jsdot = jsdot;
	this.divId = divId;
	
	this.container = document.getElementById(divId);
	this.svgdoc = this.container.ownerDocument;
	var div = document.createElement('div'); // used to get the offset of the svg inside the page
	this.container.appendChild(div);
	this.svgroot = JSDot.helper.cesvg("svg"); // create element
	div.appendChild(this.svgroot);
	
	div.setAttribute('style', 'height: 100%; width: 100%;'); // fills container size
	this.svgroot.setAttribute("id", divId+"_svg");
	this.svgroot.setAttribute("xmlns", JSDot.helper.svgns);
	this.svgroot.setAttribute("xmlns:xlink", JSDot.helper.xlinkns);
	
	this.addHandler(); /* add listener to receive graph updates */
};

JSDot.View.prototype = {

	/** Associated JSDot instance */
	jsdot: null,
	
	/** Id of the containing div tag. */
	divId: null,
	
	/** Containing div element. */
	container: null,
	
	/** SVG owning document. */
	svgdoc: null,
	
	/** SVG element.
		This is where we draw.
	*/
	svgroot: null,
	
	/** Draw a node.
		@param {Node} n the node to draw
	*/
	drawNode: function(n){
		if (!n) return;
		
		var nodeId = this.divId+'-n-'+n.name;
		
		if (!n.view) n.view = {};
		
		/* create group for this node */
		var g = JSDot.helper.cesvg('g');
		g.setAttribute('id', nodeId);
		g.jsdot_node = n;
		this.svgroot.appendChild(g);
		n.view.group = g;
		
		
		/* if the node doesn't have a stencil set the default one */
		if (!n.stencil) {
			n.stencil = this.defaultStencil;
		}
		
		/* draw the node */
		n.stencil.draw(n, g);
		n.stencil.setPosition(n);
		
		
		/* if the node doesn't have a label provide a default one */
		if (!n.label) {
			n.label = {
				'type': 'plain',
				'value' : n.name
			};
		}
		if (!n.label.stencil) {
			n.label.stencil = JSDot.node_label_stencils[n.label.type];
			if (!n.label.stencil) {
				n.label.stencil = JSDot.node_label_stencils['plain'];
				n.label.value = n.label.value || n.name;
			}
		}
		n.label.stencil.draw(n, g);
		n.label.stencil.setPosition(n);
		
		/* now that the label has been drawn we can set the size of the node */
		n.stencil.setSize(n, n.label.stencil.getSize(n));
	},
	
	/** Move node to a new position.
		Move the node without redrawing it, but must already have been drawn.
	*/
	updateNodePos: function(n) {
		n.stencil.setPosition(n);
		n.label.stencil.setPosition(n);
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
		if (n.view.group) this.svgroot.removeChild(n.view.group);
	},
	
	/** Draw an edge.
		@param {Edge} e the edge to draw
	*/
	drawEdge: function(e) {
		
		var edgeId = this.divId+'-e-'+e.src.name+'-'+e.dst.name;
		
		if (!e.view) e.view = {};
		
		/* create a group for the edge */
		var g = JSDot.helper.cesvg('g');
		g.setAttribute('id', edgeId);
		g.jsdot_edge = e;
		this.svgroot.appendChild(g);
		e.view.group = g;
		
		/* if the edge doesn't have a stencil set the default one */
		if (!e.stencil) {
			e.stencil = this.defaultEdgeStencil
		}
		
		this.computeEdgePosition(e);
		
		/* draw the edge */
		e.stencil.draw(e, g);
		e.stencil.setPosition(e);
	},
	
	/** Move an edge.
		Updates an edge's position without completely redrawing it.
	*/
	updateEdgePos: function(e) {
		this.computeEdgePosition(e);
		e.stencil.setPosition(e);
	},
	
	/** Computes the position where the edge must be drawn.
		@private
		The position is stored as e.view.start and e.view.end
		and depends on the shape of the connected nodes.
		
		The drawing is not changed, use @link edge_stencil#setPosition for that.
		@param {Edge} e edge whose position must be updated
	*/
	computeEdgePosition: function(e) {
		e.view.start = e.src.stencil.getBoundaryTo(e.src, e.dst.position);
		e.view.end = e.dst.stencil.getBoundaryTo(e.dst, e.src.position);
	},
	
	/** Remove an edge from the drawing.
	@param {Edge_impl} e edge to remove
	*/
	removeEdge: function(e) {
		if (e.view.group) this.svgroot.removeChild(e.view.group);
	},
	
	/** Register handler needed by the view.
		Defines and registers the event handler that allows the view to receive
		madel and selection updates notifications.
	*/
	addHandler: function() {
		var handler = {};
		var view = this;
		
		handler.selectionchg = function(n) {
			n.stencil.highlight(n, n.selected);
		};
		
		handler.created = function(n) {
			if (n.src) {
				view.drawEdge(n);
			} else {
				view.drawNodeWithEdges(n);
			}
		};
		
		handler.removed = function(n) {
			if (n.src) {
				view.removeEdge(n);
			} else {
				view.removeNode(n);
				for (e in n.edges) {
					view.removeEdge(n.edges[e]);
				}
			}
		};
		
		handler.moved = function(n) {
			if (n.edges) { /* it is a node */
				view.updateNodePos(n);
				for (var i in n.edges) {
					view.updateEdgePos(n.edges[i]);
				}
			}
		};
		
		handler.changed = function(n) {
			if (n.src) { /* edge */
				view.removeEdge(n);
				view.drawEdge(n);
			} else { /* node */
				view.removeNode(n);
				view.drawNode(n);
				/* edges do not need to be redrawn, just update them */
				for (i in n.edges) {
					view.updateEdgePos(n.edges[i]);
				}
			}
		};
		
		this.jsdot.addEventHandler('view', handler);
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
	
};
