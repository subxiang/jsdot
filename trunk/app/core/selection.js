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
	
	/** Allow nodes to be selected.
		@note Be sure to call @link deselectAll when changing this to false.
	*/
	allowNodes: true,
	
	/** Allow edges to be selected.
		@note Be sure to call @link deselectAll when changing this to false.
	*/
	allowEdges: true,
	
	/** Allow multiple elements to be selected */
	allowMultiple: true,
	
	/** Selected elements.
		Array of selected nodes and edges.
		@see select
		@see deselect
		@see deselectAll
	*/
	selection: [],
	
	/** Handler for mousedown event on the SVG.
		Handles mousedown events and fires the
		triggered jsdot events.
		
		When selection is enabled and it changes the event
		'selectionchg' is fired. If selection is disabled
		then the 'neclick' is fired when clicking on edges
		or nodes. When only one of allowEdges and allowNodes
		is true, clicking on edge resp. node fires 'selectionchg'
		but clicking on the other one does nothing (no 'neclick').
		
		@private
	*/
	svgMousedown: function(evt) {
		if (evt.target.tagName.toLowerCase() == 'svg') {
			/* click on background */
			this.deselectAll();
		} else {
			/* something contained in a group */
			var n = evt.target.parentNode.jsdot_node;
			n = n || evt.target.parentNode.jsdot_edge;
			if (n) {
				/* either node or edge */
				if (!this.allowEdges && !this.allowNodes) {
					/* If selection is disabled the event is 'neclick' */
					this.jsdot.fireEvent('neclick', n, evt);
				} else {
					/* selection is allowed, so we (de)select */
					if (n.selected) {
						this.deselect(n);
					} else {
						this.select(n);
					};
				};
			};
		};
	},
	
	/** Adds an element to the selection.
		If the given element cannot be added to the
		selection it will be ignored.
		
		Fires a 'selectionchg' event.
		
		If the element is already selected does nothing.
		
		If the selection is not multiple, already selected
		elements will be deselected (firing the relative events).
		@param {Object} n @ref Node or @ref Edge to add
		@see allowNodes
		@see allowEdges
		@see allowMultiple
	*/
	select: function(n) {
		if (n.selected) return;
		if (n.src && this.allowEdges ||
				!n.src && this.allowNodes) {
			/* it is an edge and we are allowed to select them,
			   or it is a node and they are allowed. */
			/* n.src is defined only for edges */
			if (!this.allowMultiple) this.deselectAll();
			n.selected = true;
			this.selection.push(n);
			this.jsdot.fireEvent('selectionchg', n);
		};
	},
	
	/** Remove an element from selection.
		Fires a 'selectionchg' event.
	*/
	deselect: function(n) {
		if (n.selected) {
			/* first find it in selection */
			var j = null;
			for (var i in this.selection) {
				if (this.selection[i] == n) {
					j = i;
					break;
				};
			};
			/* now remove */
			this.selection.splice(j, 1);
			n.selected = false;
			this.jsdot.fireEvent('selectionchg', n);
		};
	},
	
	/** Deselect all nodes and edges.
		Fires a 'selectionchg' event.
	*/
	deselectAll: function() {
		var e;
		while (e = this.selection.pop()) {
			e.selected = false;
			this.jsdot.fireEvent('selectionchg', e);
			e = undefined;
		};
	},
};
