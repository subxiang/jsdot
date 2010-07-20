/*
 This file is part of the JSDot library
 
 http://code.google.com/p/jsdot/
 
 Copyright (c) 2009 Lucia Blondel, Nicos Giuliani, Carlo Vanini
 Copyright (c) 2010 Carlo Vanini
 
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
function jsdot_View(jsdot, divId) {
	this.jsdot = jsdot;
	this.divId = divId;
	
	this.container = document.getElementById(divId);
	this.svgdoc = this.container.ownerDocument;
	this.svgroot = jsdot_helper.cesvg("svg"); // create element
	this.container.appendChild(this.svgroot);
	
	this.svgroot.setAttribute("id", divId+"_svg");
	this.svgroot.setAttribute("xmlns", jsdot_helper.svgns);
	this.svgroot.setAttribute("xmlns:xlink", jsdot_helper.xlinkns);
	
	// add event listeners for svg events
	this.addListeners();
}

jsdot_View.prototype = {

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
	
	/** Add event listeners.
		Adds listeners for events on the SVG image.
		
		Which handlers will be triggered depends on the
		view mode, whether it is read-only and static or
		nodes can be moved and selected.
	*/
	addListeners: function(){
	},
	
	/** Draw a node.
		@param {Node} n the node to draw
	*/
	drawNode: function(n){
		if (!n) return;
		
		var nodeId = this.divId+'-n-'+n.name;
		
		if (!n.view) n.view = {};
		
		/* create group for this node */
		var g = jsdot_helper.cesvg('g');
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
			n.label.stencil = jsdot_node_label_stencils[n.label.type];
			if (!n.label.stencil) {
				n.label.stencil = jsdot_node_label_stencils['plain'];
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
	
	/** Draw an edge.
		@param {Edge} e the edge to draw
	*/
	drawEdge: function(e) {
		
		var edgeId = this.divId+'-e-'+e.src.name+'-'+e.dst.name;
		
		if (!e.view) e.view = {};
		
		/* create a group for the edge */
		var g = jsdot_helper.cesvg('g');
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
	updateEdge: function(e) {
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
	
	/** Enable selection.
		Defines and registers the event handler for selection.
	*/
	enableSelection: function() {
		var handler = {};
		handler.selectionchg = function(n) {
			n.stencil.highlight(n, n.selected);
		};
		this.jsdot.addEventHandler('view', handler);
	},
}