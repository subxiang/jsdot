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
function jsdot_Editor(jsdot, view) {
	this.jsdot = jsdot;
	this.view = view;
	
	var tb = document.createElement('div');
	tb.setAttribute('class', 'ui-widget-header ui-corner-all jsdot-toolbar');
	this.view.container.appendChild(tb);
	//this.injectButtons(tb);
	this.mainBar.register(this, tb);
}

jsdot_Editor.prototype = {

	setSelected: function(b) {
		if (this.selected) $(this.selected).removeClass('jsdot-tb-selected');
		$(b).addClass('jsdot-tb-selected');
		this.selected = b;
	},

	mainBar: {
	
		/** Selected tool.
			This is used to keep track of which tool icon is highlighted.
		*/
		selected: null,
		
		/** Change tool icon highlighting. */
		setSelected: function(b) {
			if (this.selected) $(this.selected).removeClass('jsdot-tb-selected');
			$(b).addClass('jsdot-tb-selected');
			this.selected = b;
		},
		
		/** Create the toolbar iside the editor. */
		register: function(editor, p) {
			tb = this; // closure
			
			var btnSel = document.createElement('button');
			btnSel.innerHTML = 'Select';
			p.appendChild(btnSel);
			$(btnSel).button({
				text: false,
				icons: { primary: 'jsdot-icon-cursor' }
			})
			.click(function() {
				tb.setSelected(btnSel);
			});
			tb.setSelected(btnSel);
			
			var btnAddN = document.createElement('button');
			btnAddN.innerHTML = 'Add node';
			p.appendChild(btnAddN);
			$(btnAddN).button({
				text: false,
				icons: { primary: 'jsdot-icon-addnode' }
			})
			.click(function() {
				tb.setSelected(btnAddN);
			});
			
			var btnRmN = document.createElement('button');
			btnRmN.innerHTML = 'Remove node';
			p.appendChild(btnRmN);
			$(btnRmN).button({
				text: false,
				icons: { primary: 'jsdot-icon-removenode' }
			})
			.click(function() {
				tb.setSelected(btnRmN);
			});
		},
		
	},
};
