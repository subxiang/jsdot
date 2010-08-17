/*
This file is part of the JSDot library 
 
http://code.google.com/p/jsdot/

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

/** @class Node internal representation.
	@constructor
	Creates a new node.
	@param {JSDot.Graph_impl} graph graph to which the new node belongs
	@param {String} name name of the new node
*/
JSDot.Node_impl = function(graph, name) {
	this.graph = graph;
	this.name = name;
	this.label = {'type': 'plain', 'value': name};
	this.position = [0,0];
	this.stencil = graph.defaultNodeStencil;
	this.edges = {};
};

JSDot.Node_impl.prototype = {

	/** Set node's label.
		Fires a {@link doc_Handler.changed} event.
		@param {String} l new label
		@param {Boolean} fire whether to fire the event or not, default is true
	*/
	setLabel: function(l, fire) {
		if (this.label) {
			this.label.value = l;
		} else {
			this.label = {'type': 'plain', 'value': l};
		}
		if (fire == undefined || fire) this.graph.jsdot.fireEvent('changed', this);
	},
	
	/** Set node's position.
		Fires a {@link doc_Handler.moved} event.
		@param {Array} p new position in the form [x, y]
		@param {Boolean} fire whether to fire the event or not, default is true
	*/
	setPosition: function(p, fire) {
		this.position = p;
		if (fire == undefined || fire) this.graph.jsdot.fireEvent('moved', this);
	},

	/** Set node stencil.
		Set which stencil should be used to draw the node.
		<br>If the choosen stencil doesn't exist, the default one is set.
		<br>Fires a {@link doc_Handler.changed} event.
		@param {String} name name of the stencil
		@param {Boolean} fire whether to fire the event or not, default is true
	*/
	setStencil: function(name, fire) {
		this.stencil = JSDot.stencils[name] || jsdot.graph.defaultNodeStencil;
		if (fire == undefined || fire) this.graph.jsdot.fireEvent('changed', this);
	},

	/** Bounding box of the node's shape.
		Bounding box contains 'height', 'width', 'x', 'y' and is relative to SVG.
		@return {Object} bounding box
	*/
	getBBox: function() {
		if (this.stencil) return this.stencil.getBBox(this);
		return {'height': 0, 'width': 0, 'x': this.position[0], 'y': this.position[1] };
	},

};
