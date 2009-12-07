/*
This file is part of the JSDot library 
 
http://code.google.com/p/jsdot/

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

function Class(){ return function(){ this.init.apply(this, arguments); } }

var JSDot = new Class();

JSDot.prototype = {

    mainWin: null,
	selected_form: null,
	svg: null,
	graph: null,
	
	/** Last error encountered.
	 * It has the same basic structure as an exception:
	 * {'name': 'SomeError', 'message': 'error description}
	 * It's meaning depends on the return value of the called function,
	 * see the documentation of each function whether it uses error messages.
	 */
	error: null,
	
	
    init: function(id){
		// start with an empty graph
		this.emptyGraph();
		
		// set up the drawing area
		if (typeof id == "string") {
			this.svg = new JSVG(this, id);
		}
    },
   
    
	 add_figure: function(form) {
		selected_form = form;
	}
};

	
	
	




