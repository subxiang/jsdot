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


/**
 * This file is intended to be included in html for development,
 * it will throw in all the pieces of JSDOT.
 * for production you should use the single-file release.
 */
var f= function() {
	var files = [
		"../lib/json_sans_eval.js",
		"helpers.js",
		"graph.js",
		"shapes.js"
		"view.js",
	];
	
	var ip = JSDOT_PATH || "../";
	var h = document.getElementsByTagName("head").item(0);

	// Main css file
	var style = document.createElement("link");
	style.setAttribute("type", "text/css");
	style.setAttribute("rel", "stylesheet");
	style.setAttribute("href", ip + '../style/main.css');
	h.appendChild(style);
	
	var style = document.createElement("link");
	style.setAttribute("type", "text/css");
	style.setAttribute("rel", "stylesheet");
	style.setAttribute("href", ip + '../style/shapes.css');
	h.appendChild(style);

	for (var i = 0; i < files.length; i++) {
		var e = document.createElement("script");
		e.setAttribute("type", "text/javascript");
		e.setAttribute("src", ip+files[i]);
		h.appendChild(e);
	}

}();
