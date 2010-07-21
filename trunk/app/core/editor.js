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
	Construct a JSDot Editor.
	@class JSDot editor.
	@constructor
*/
function jsdot_Editor(jsdot, view, sel) {
	this.jsdot = jsdot;
	this.view = view;
	this.selection = sel;
	
	var tb = document.createElement('div');
	tb.setAttribute('class', 'ui-widget-header ui-corner-all jsdot-toolbar');
	this.view.container.appendChild(tb);
	//this.injectButtons(tb);
	new this.MainBar(this, tb);
}

jsdot_Editor.prototype = {

	/** Set selected button.
		Change tool icon highlighting to show which button is selected
		inside a given toolbar. If another one was already selected,
		it will be deselected.<br>
		If a function 'onDeselect' is defined on the button being deselected,
		it will be called.
		@param {Object} tb the toolbar
		@param {Object} b the button
	*/
	setSelected: function(tb, b) {
		if (tb.selected) {
			if (tb.selected.onDeselect) tb.selected.onDeselect();
			$(tb.selected).removeClass('jsdot-tb-selected');
		}
		$(b).addClass('jsdot-tb-selected');
		tb.selected = b;
	},
	
};

/** @class Main toolbar.
	@creator
	Create the toolbar iside the editor.
	@param {jsdot_Editor} editor
	@param {Object} p parent DOM element where to insert button elements
*/
jsdot_Editor.prototype.MainBar = function(editor, p) {
	tb = this; // no need for closure actually, but use as shorthand
	this.editor = editor;
	
	this.dragH = new jsdot_Drag(editor.jsdot, editor.view, editor.selection);
	
	var btnSel = document.createElement('button');
	btnSel.innerHTML = 'Select';
	p.appendChild(btnSel);
	$(btnSel).button({
		text: false,
		icons: { primary: 'jsdot-icon-cursor' }
	})
	.click(function() {
		editor.setSelected(tb, btnSel);
		editor.jsdot.addEventHandler('drag', tb.dragH);
		var s = editor.selection;
		s.allowNodes = true;
		s.allowEdges = true;
		s.allowMultiple = true;
		s.allowDrag = true;
	});
	btnSel.onDeselect = function() {
		editor.jsdot.removeEventHandler('drag');
	};
	btnSel.click(); // selection tool is enabled on startup
	
	var btnAddN = document.createElement('button');
	btnAddN.innerHTML = 'Add node';
	p.appendChild(btnAddN);
	$(btnAddN).button({
		text: false,
		icons: { primary: 'jsdot-icon-addnode' }
	})
	.click(function() {
		editor.setSelected(tb, btnAddN);
		editor.jsdot.addEventHandler('create', tb.createNodeH);
		var s = editor.selection;
		s.allowNodes = false;
		s.allowEdges = false;
		s.allowMultiple = false;
		s.allowDrag = false;
		s.deselectAll();
	});
	btnAddN.onDeselect = function() {
		editor.jsdot.removeEventHandler('create');
	};
	
	var btnRmN = document.createElement('button');
	btnRmN.innerHTML = 'Remove node';
	p.appendChild(btnRmN);
	$(btnRmN).button({
		text: false,
		icons: { primary: 'jsdot-icon-removenode' }
	})
	.click(function() {
		editor.setSelected(tb, btnRmN);
	});
},
	
jsdot_Editor.prototype.MainBar.prototype = {

	/** Selected tool.
		This is used to keep track of which tool icon is highlighted.
		@see jsdot_Editor#setSelected
	*/
	selected: null,
	
	/** Attached editor.
		Editor to which this toolbar is attached.
		@type jsdot_Editor
	*/
	editor: null,
	
	/** Handler for drag&drop.
		This is a {@link jsdot_Drag} created in {@link #register}.
	*/
	dragH: null,
	
	/** Handler for creating nodes. */
	createNodeH: {
		click: function(obj, evt) {
			//var n = this.editor.jsdot.graph.createNode();
			//n.position = [evt.relX, evt.relY];
			//this.editor.jsdot.fireEvent('created', n);
		}
	},
	
};
