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

/** @class Handler implementing drag&drop.
	@constructor
	@param {JSDot_impl} jsdot JSDot instance
	@param {jsdot_View} view view on which dragging should be visualised
	@param {jsdot_Selection} sel selection
*/
jsdot_Drag = function(jsdot, view, sel) {
	var h = this; /* the handler itself */
	
	this.nodes = null; /** nodes involved */
	this.edges = null; /** edges involved */

	/** Pick
		Populate {@link #nodes} and {@link #edges} with the nodes, rep. edges,
		involved in dragging.
	*/
	this.pick = function(obj) {
		h.nodes = [];
		h.edges = [];
		
		/* if the selection is empty, but pick was on a node, drag that one. */
		var s = (sel.selection.length == 0 ? [obj] : sel.selection);
		
		for (var i in s) {
			if (!s[i].src) {
				/* it is a node, save initial position and append to list */
				s[i].drag = s[i].position;
				h.nodes.push(s[i]);
				
				/* get the edges connected to it */
				var e = s[i].edges;
				for (var j in e) {
					if (!(e[j] in h.edges)) {
						h.edges.push(e[j]);
					}
				}
			}
		}
	};
	
	/** Drag
		Updates directly the view to give a feedback when dragging.
	*/
	this.drag = function(obj, evt) {
		for (var i in h.nodes) {
			var p = h.nodes[i].drag;
			h.nodes[i].position = [p[0]+evt.dx, p[1]+evt.dy];
			view.updateNodePos(h.nodes[i]);
		}
		for (var i in h.edges) {
			view.updateEdge(h.edges[i]);
		}
	};
	
	/** Drop
		Make the move persistent if there is an editor.
	*/
	this.drop = function(obj, evt) {
		/* make sure the view is updated up to the last movement */
		h.drag(obj, evt);
		h.nodes = [];
		h.edges = [];
	};
};
