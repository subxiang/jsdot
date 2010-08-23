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
	Construct a JSDot Editor.
	@class JSDot editor.
	@constructor
*/
JSDot.Editor = function(jsdot, view, sel) {
	this.jsdot = jsdot;
	this.view = view;
	this.selection = sel;
	
	var tb = document.createElement('div');
	tb.setAttribute('class', 'ui-widget-header ui-corner-all jsdot-toolbar');
	this.view.container.appendChild(tb);
	this.tbContainer = tb;
	for (var i in JSDot.stencils) { this.currentNodeStencil = i; break; };
	for (var i in JSDot.edge_stencils) { this.currentEdgeStencil = i; break; };
	new JSDot.Editor.MainBar(this, tb);
	this.editDialog = new JSDot.Editor.EditDialog(this);
};

JSDot.Editor.prototype = {

	/** Toolbar container.
		Div element containig the toolbar elements.
		@type {DOM Element}
	*/
	tbContainer: null,
	
	/** Current node stencil name.
		The stencil that will be given to the new noded created by this editor.<br>
		Note that this is the name of a stencil in {@link JSDot.stencils} and not
		the stencil itself.
		@type String
	*/
	currentNodeStencil: null,
	
	/** Current edge stencil name.
		The stencil that will be given to the new edges created by this editor.<br>
		Note that this is the name of a stencil in {@link JSDot.edge_stencils} and not
		the stencil itself.
		@type String
	*/
	currentEdgeStencil: null,
	
	/** Instance of the dialog.
		Instance of {@link JSDot.Editor.EditDialog} created by
		{@link JSDot.Editor} constructor.
	*/
	editDialog: null,

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
	
	/** The nested bar currently shown */
	activeNested: null,
	
	/** List of registered nested bars. */
	nestedBars: {},

	/** Register a new nested bar. */
	addNestedBar: function(bar) {
		this.nestedBars[bar.name] = bar;
		$(bar.container).addClass('ui-widget ui-corner-all jsdot-tb-nested jsdot-tb-hiddentb');
		this.tbContainer.appendChild(bar.container);
	},
	
	/** Show a registered nested bar. */
	showNestedBar: function(name) {
		this.hideNestedBar();
		if (this.nestedBars[name]) $(this.nestedBars[name].container).removeClass('jsdot-tb-hiddentb');
		this.activeNested = this.nestedBars[name];
	},
	
	/** Hides the currently active nested bar. */
	hideNestedBar: function() {
		if (this.activeNested) $(this.activeNested.container).addClass('jsdot-tb-hiddentb');
		this.activeNested = null;
	},
};

/** @class Main toolbar.
	@creator
	Create the toolbar iside the editor.
	@param {jsdot_Editor} editor
	@param {Object} p parent DOM element where to insert button elements
*/
JSDot.Editor.MainBar = function(editor, p) {
	tb = this; // no need for closure actually, but use as shorthand
	this.editor = editor;
	
	this.dragH = new JSDot.Drag(editor.jsdot, editor.view, editor.selection);
	this.createEdgeH = new JSDot.EdgeViz(editor.jsdot, editor.view, editor);
	this.layoutBar = new JSDot.Editor.LayoutBar(editor);
	this.createNodeBar = new JSDot.Editor.CreateNodeBar(editor);
	this.createEdgeBar = new JSDot.Editor.CreateEdgeBar(editor);
	
	var spc = document.createElement('div');
	spc.setAttribute('class', 'jsdot-tb-handleL');
	p.appendChild(spc);
	spc = document.createElement('div');
	spc.setAttribute('class', 'jsdot-tb-handleR');
	p.appendChild(spc);
	$(p).draggable({ handle: '.jsdot-tb-handle' });
	
	var main = document.createElement('div');
	main.setAttribute('class', 'jsdot-tb-main');
	p.appendChild(main);
	
	var btnSel = document.createElement('button');
	btnSel.innerHTML = 'Select';
	main.appendChild(btnSel);
	$(btnSel).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-cursor' }
	})
	.click(function() {
		editor.setSelected(tb, btnSel);
		editor.jsdot.addEventHandler('drag', tb.dragH);
		var s = editor.selection;
		s.allowNodes = true;
		s.allowEdges = true;
		s.allowMultiple = true;
		s.allowDrag = true;
		editor.showNestedBar('layout');
	});
	btnSel.onDeselect = function() {
		editor.jsdot.removeEventHandler('drag');
		editor.hideNestedBar('layout');
	};
	
	var btnAddN = document.createElement('button');
	btnAddN.innerHTML = 'Add node';
	main.appendChild(btnAddN);
	$(btnAddN).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-addnode' }
	})
	.click(function() {
		editor.setSelected(tb, btnAddN);
		var s = editor.selection;
		s.allowNodes = false;
		s.allowEdges = false;
		s.allowMultiple = false;
		s.allowDrag = false;
		s.deselectAll();
		editor.jsdot.addEventHandler('create', tb.createNodeH(editor.jsdot));
		editor.showNestedBar('createnode');
	});
	btnAddN.onDeselect = function() {
		editor.jsdot.removeEventHandler('create');
		editor.hideNestedBar('createnode');
	};
	
	var btnAddE = document.createElement('button');
	btnAddE.innerHTML = 'Add edge';
	main.appendChild(btnAddE);
	$(btnAddE).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-addedge' }
	})
	.click(function() {
		editor.setSelected(tb, btnAddE);
		var s = editor.selection;
		s.allowNodes = false;
		s.allowEdges = false;
		s.allowMultiple = false;
		s.allowDrag = false;
		s.deselectAll();
		editor.jsdot.addEventHandler('create', tb.createEdgeH);
		editor.showNestedBar('createedge');
	});
	btnAddE.onDeselect = function() {
		editor.jsdot.removeEventHandler('create');
		tb.createEdgeH.cancel(); /* stop if you were drawing */
		editor.hideNestedBar('createedge');
	};
	
	var btnRm = document.createElement('button');
	btnRm.innerHTML = 'Remove node';
	main.appendChild(btnRm);
	$(btnRm).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-removenode' }
	})
	.click(function() {
		editor.setSelected(tb, btnRm);
		var s = editor.selection;
		s.allowNodes = false;
		s.allowEdges = false;
		s.allowMultiple = false;
		s.allowDrag = false;
		s.deselectAll();
		editor.jsdot.addEventHandler('remove', tb.removeH(editor.jsdot));
	});
	btnRm.onDeselect = function() {
		editor.jsdot.removeEventHandler('remove');
	};
	
	var btnED = document.createElement('button');
	btnED.innerHTML = 'Edit properties';
	main.appendChild(btnED);
	$(btnED).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-editdialog' }
	})
	.click(function() {
		editor.editDialog.toggleOpen();
	});
	
	editor.addNestedBar(this.layoutBar);
	editor.addNestedBar(this.createNodeBar);
	editor.addNestedBar(this.createEdgeBar);
	btnSel.click(); // selection tool is enabled on startup
};

JSDot.Editor.MainBar.prototype = {

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
	
	/** Nested bar or layout operations.
		Created in {@link #MainBar}.
		@type JSDot.Editor.LayoutBar
	*/
	layoutBar: null,
	
	/** Handler for drag&drop.
		This is a {@link jsdot_Drag} created in {@link #MainBar} constructor.
	*/
	dragH: null,
	
	/** Construct handler for creating nodes.
		@param {JSDot.jsdot_Impl} jsdot jsdot instance
		@return {doc_Handler} handler
	*/
	createNodeH: function(jsdot) {
		var editor = this.editor;
		return {
			click: function(obj, evt) {
				var n = jsdot.graph.createNode(null, false);
				n.setPosition([evt.relX, evt.relY], false);
				if (editor.currentNodeStencil) n.setStencil(editor.currentNodeStencil, false);
				jsdot.fireEvent('created', n);
			}
		};
	},
	
	/** Handler for creating edges.
		This is created in {@link #MainBar} constructor.
		@type JSDot.EdgeViz
	*/
	createEdgeH: null,
	
	/** Construct handler for removing nodes and edges.
		@param {jsdot_Impl} jsdot jsdot instance
		@return {doc_Handler} handler
	*/
	removeH: function(jsdot) {
		return {
			click: function(obj, evt) {
				if (obj && obj.isNode) { /* node */
					jsdot.graph.removeNode(obj);
				} else if (obj && obj.isEdge) { /* edge */
					jsdot.graph.removeEdge(obj);
				}
			}
		};
	},
	
};

/** @class Layout toolbar.
	@constructor
	@param {jsdot_Editor} editor
	@param {Object} p parent DOM element where to insert button elements
*/
JSDot.Editor.LayoutBar = function(editor) {
	var d = document.createElement('div');
	
	// mandatory fields for nested bars
	this.name = 'layout';
	this.container = d;
	
	var btnL = document.createElement('button');
	btnL.innerHTML = 'Align left';
	d.appendChild(btnL);
	$(btnL).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignleft' }
	})
	.click(this.leftH(editor));
	
	var btnC = document.createElement('button');
	btnC.innerHTML = 'Center';
	d.appendChild(btnC);
	$(btnC).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-aligncenter' }
	})
	.click(this.centerH(editor));
	
	var btnR = document.createElement('button');
	btnR.innerHTML = 'Align right';
	d.appendChild(btnR);
	$(btnR).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignright' }
	})
	.click(this.rightH(editor));
	
	var btnT = document.createElement('button');
	btnT.innerHTML = 'Align top';
	d.appendChild(btnT);
	$(btnT).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-aligntop' }
	})
	.click(this.topH(editor));
	
	var btnVC = document.createElement('button');
	btnVC.innerHTML = 'Center vertically';
	d.appendChild(btnVC);
	$(btnVC).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignvcenter' }
	})
	.click(this.vcenterH(editor));
	
	var btnB = document.createElement('button');
	btnB.innerHTML = 'Align bottom';
	d.appendChild(btnB);
	$(btnB).button({
		text: false,
		icons: { primary: 'jsdot-icon jsdot-icon-alignbottom' }
	})
	.click(this.bottomH(editor));
};

JSDot.Editor.LayoutBar.prototype = {

	leftH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize l */
			var n = s.firstNode();
			if (!n) return;
			var l = v.getBBox(n).x;
			
			/* find leftmost node */
			s.forNodes(function(n) {
				var p = v.getBBox(n).x;
				if (p < l) l = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ l + v.getBBox(n).width/2, n.position[1] ]);
			});
		};
	},

	centerH: function(editor) {
		return function() {
			var s = editor.selection;
			/* find first node and initialize l and r */
			var n = s.firstNode();
			if (!n) return;
			var l = n.position[0];
			var r = l;
			
			/* find the middle */
			s.forNodes(function(n) {
				if (n.position[0] < l) l = n.position[0];
				if (n.position[0] > r) r = n.position[0];
			});
			l = l + (r-l)/2;
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ l, n.position[1] ]);
			});
		};
	},

	rightH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize r */
			var n = s.firstNode();
			if (!n) return;
			var p = v.getBBox(n);
			var r = p.x + p.width;
			
			/* find rightmost node */
			s.forNodes(function(n) {
				p = v.getBBox(n);
				p = p.x + p.width;
				if (p > r) r = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ r - v.getBBox(n).width/2, n.position[1] ]);
			});
		};
	},

	topH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize y */
			var n = s.firstNode();
			if (!n) return;
			var y = v.getBBox(n).y;
			
			/* find topmost node */
			s.forNodes(function(n) {
				var p = v.getBBox(n).y;
				if (p < y) y = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ n.position[0], y + v.getBBox(n).height/2 ]);
			});
		};
	},

	vcenterH: function(editor) {
		return function() {
			var s = editor.selection;
			/* find first node and initialize top and btm */
			var n = s.firstNode();
			if (!n) return;
			var top = n.position[1];
			var btm = top;
			
			/* find center */
			s.forNodes(function(n) {
				if (n.position[1] < top) top = n.position[1];
				if (n.position[1] > btm) btm = n.position[1];
			});
			top += (btm-top)/2;
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ n.position[0], top ]);
			});
		};
	},

	bottomH: function(editor) {
		return function() {
			var s = editor.selection;
			var v = editor.view;
			/* find first node and initialize y */
			var n = s.firstNode();
			if (!n) return;
			var p = v.getBBox(n);
			var y = p.y + p.height;
			
			/* find bottom node */
			s.forNodes(function(n) {
				p = v.getBBox(n);
				p = p.y + p.height;
				if (p > y) y = p;
			});
			
			/* update nodes */
			s.forNodes(function(n) {
				n.setPosition([ n.position[0], y - v.getBBox(n).height/2 ]);
			});
		};
	},
};

/** @class Node creation toolbar.
	Allows to select a stencil for the new nodes that will be created.
	@constructor
	@param {jsdot_Editor} editor
*/
JSDot.Editor.CreateNodeBar = function(editor) {
	var d = document.createElement('div');
	
	// mandatory fields for nested bars
	this.name = 'createnode';
	this.container = d;
	
	var stc = document.createElement('select');
	for (var i in JSDot.stencils) {
		stc.add(new Option(i, i, i == editor.currentNodeStencil), null);
	}
	d.appendChild(stc);
	
	stc.addEventListener('change', function() {
		editor.currentNodeStencil = this.value;
		}, false);

};

/** @class Edge creation toolbar.
	Allows to select a stencil for the new edge that will be created.
	@constructor
	@param {jsdot_Editor} editor
*/
JSDot.Editor.CreateEdgeBar = function(editor) {
	var d = document.createElement('div');
	
	// mandatory fields for nested bars
	this.name = 'createedge';
	this.container = d;
	
	var stc = document.createElement('select');
	for (var i in JSDot.edge_stencils) {
		stc.add(new Option(i, i, i == editor.currentEdgeStencil), null);
	}
	d.appendChild(stc);
	
	stc.addEventListener('change', function() {
		editor.currentEdgeStencil = this.value;
		}, false);

};

/** @class Editing dialog.
	This dialog allows to view and change properties like label text and stencil
	of existing elements.
	@constructor
	@param {jsdot_Editor} editor
*/
JSDot.Editor.EditDialog = function(editor) {

	/* insert html part of the dialog */
	var dialog = document.createElement('div');
	editor.view.container.appendChild(dialog);
	$(dialog).dialog({ autoOpen: false, closeOnEscape: false,
			position: 'right', dialogClass: 'jsdot-editdialog' });
	
	var msg = document.createElement('p');
	msg.innerHTML = 'edit dialog';
	dialog.appendChild(msg);
	dialog.addEventListener('keypress', function(evt) {
			if (evt.keyCode == 27) { /* escape */
				handler.selectionchg(); /* reload values in dialog */
			}
			}, false);
	
	var nodeForm = document.createElement('div');
	dialog.appendChild(nodeForm);
	var nodeFStcl = document.createElement('select');
	nodeForm.appendChild(nodeFStcl);
	nodeFStcl.addEventListener('change', function() {
			var n = editor.selection.selection[0];
			n.setStencil(this.value);
			}, false);
	var nodeFLabel = document.createElement('input');
	nodeForm.appendChild(nodeFLabel);
	nodeFLabel.addEventListener('change', function() {
			var n = editor.selection.selection[0];
			n.setLabel(this.value);
			}, false);
	
	var edgeForm = document.createElement('div');
	dialog.appendChild(edgeForm);
	var edgeFStcl = document.createElement('select');
	edgeForm.appendChild(edgeFStcl);
	edgeFStcl.addEventListener('change', function() {
			var n = editor.selection.selection[0];
			n.setStencil(this.value);
			}, false);
	var edgeFLabel = document.createElement('input');
	edgeForm.appendChild(edgeFLabel);
	edgeFLabel.addEventListener('change', function() {
			var n = editor.selection.selection[0];
			n.setLabel(this.value);
			}, false);
	
	/** Toggle dialog.
		If it's closed open it, if it's open close it.
	*/
	this.toggleOpen = function() {
		if ($(dialog).dialog('isOpen')) {
			$(dialog).dialog('close');
		} else {
			$(dialog).dialog('open');
			handler.selectionchg();
		}
	};
	
	var handler = {
		selectionchg: function(/*n, s*/) {
		
			/* if closed then do not update */
			if (!$(dialog).dialog('isOpen')) return;
			
			var nnodes = 0, nedges = 0;
			editor.selection.forNodes(function(){ ++nnodes; });
			editor.selection.forEdges(function(){ ++nedges; });
			if (nnodes + nedges == 0) {
				msg.innerHTML = 'Nothing selected.';
				$(nodeForm).hide();
				$(edgeForm).hide();
			} else if (nnodes + nedges > 1) {
				/* multiple selection */
				$(nodeForm).hide();
				$(edgeForm).hide();
				msg.innerHTML = (nnodes ? nnodes+' node'+(nnodes>1 ? 's' : '')+(nedges ? ' and ' : '') : '')
						+ (nedges ? nedges+' edge'+(nedges>1 ? 's' : '') : '')
						+ ' selected.';
			} else {
				/* single selection, show properties */
				var e = editor.selection.selection[0];
				if (e.isNode) {
					/* selected node */
					msg.innerHTML = 'Node "'+e.name+'".';
					
					nodeFStcl.innerHTML = ''; /* remove options */
					for (var i in JSDot.stencils) {
						nodeFStcl.add(new Option(i, i, JSDot.stencils[i] == e.stencil), null);
					}
					
					nodeFLabel.value = e.label.value;
					
					$(edgeForm).hide();
					$(nodeForm).show();
					
				} else if (e.isEdge) {
					/* selected edge */
					msg.innerHTML = 'Edge "'+e.id+'".';
					
					edgeFStcl.innerHTML = '';
					for (var i in JSDot.edge_stencils) {
						edgeFStcl.add(new Option(i, i, JSDot.edge_stencils[i] == e.stencil), null);
					}
					
					edgeFLabel.value = (e.label ? e.label.value : '');
					
					$(nodeForm).hide();
					$(edgeForm).show();
				}
			}
		},
	};
	
	editor.jsdot.addEventHandler('editdialog', handler);
	this.toggleOpen();
};
