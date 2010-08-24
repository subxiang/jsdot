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

/** @class This is JSDot!
	This is the interface you use to create views and editors.
*/
function JSDot() {
	
	var views = [];
	var editors = [];
	
	/* instantiate the internal implementation */
	var jsdot = new JSDot.jsdot_Impl();
	
	/** Object to interact with the graph.
		@return {Graph} graph interface
	*/
	this.getGraph = function() {
		return new JSDot.Graph(jsdot, jsdot.graph);
	};
	
	/** Add a view
		@param {String} divId id of a div tag where the view will be placed
		@param {String} mode type of view to create
	*/
	this.addView = function(divId, mode) {
		if (views[divId]) return; /* view already exists */
		
		var v = new JSDot.View(jsdot, divId);
		JSDot.load_svg_shapes(v, 'shapes.svg');
		views[divId] = v;
		var s = new JSDot.Selection(jsdot, v);
		switch (mode) {
			case 'drag':
				s.allowNodes = true;
				s.allowEdges = true;
				s.allowMultiple = true;
				s.allowDrag = true;
				jsdot.addEventHandler(v, new JSDot.Drag(jsdot, v, s));
				break;
			case 'editor':
				/* selection is set up by the editor itself */
				editors[divId] = new JSDot.Editor(jsdot, v, s);
			case 'hiddeneditor':
				break;
			case 'static':
			default:
				s.allowNodes = false;
				s.allowEdges = false;
				s.allowMultiple = false;
				s.allowDrag = false;
				break;
		};
	};
};
