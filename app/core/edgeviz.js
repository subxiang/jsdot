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

/** @class Handler visualizing the creation of an edge.
	<br>This handler keeps track of the first clicked node,
	then draws the line to visualize the edge being created,
	and actually creates the edge when the second node is clicked.
	@constuctor
*/
JSDot.EdgeViz = function(jsdot, view) {
	
	/** Starting node for the edge. */
	this.start = null;
	
	this.jsdot = jsdot;
	
	this.view = view;
	
	this.click = function(obj, evt) {
	
		/* if it's not a node do noting */
		if (!obj || !obj.edges) return;
		
		/* selection of first node */
		if (!this.start) {
			this.start = obj;
			return;
		}
		
		/* selection of second node */
		var e = this.jsdot.graph.createEdge(this.start, obj);
		this.start = null;
		this.jsdot.fireEvent('created', e);
	};

};
