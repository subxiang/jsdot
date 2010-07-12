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

/** Construct a selection handler.
	@class Selection handler.
	Handles selection and dragging of nodes and edges in a view.

	@constructor
	@param {JSDot} jsdot JSDot instance
	@param {jsdot_View} view JSDot view
*/
function jsdot_Selection(jsdot, view) {

	this.jsdot = jsdot;
	this.view = view;
	
	view.svgroot.addEventListener('mousedown',
			function(obj) {
				return function() {
					return obj.svgMousedown.apply(obj, arguments);
				};
			}(this), this.svgMousedown);
}

jsdot_Selection.prototype = {

	/** Associated JSDot instance */
	jsdot: null,
	
	/** Associated view */
	view: null,
	
	svgMousedown: function(evt) {
		if (evt.target.tagName.toLowerCase() == 'svg') {
			/* click on background */
		} else {
			/* something contained in a group */
			var n = evt.target.parentNode.jsdot_node;
			var e = evt.target.parentNode.jsdot_edge;
			if (n) {
				/* it is a node */
				n.selected = !n.selected;
				this.jsdot.fireEvent('nodeclick', n, evt);
			} else if (e) {
				/* it is an edge */
				e.selected = !e.selected;
				this.jsdot.fireEvent('edgeclick', e, evt);
			};
		};
	},
};
