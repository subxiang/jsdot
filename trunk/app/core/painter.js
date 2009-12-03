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

	JSDot.prototype.draw = function() {
		var g = this.graph;
		for(i in g.nodes) {
			var n = g.nodes[i];
			var pos = n.getAttribute("pos");
			var x = 10, y = 10;
			if (typeof pos == "string") {
				pos = pos.split(',');
				x = pos[0];
				y = pos[1];
			}
			var e = this.svg.Element('circle', {'r': '2.5em', 'cx': x, 'cy': y});
			e.addEventListener('mousedown', function(svg){ return function(evt) {svg.grab(evt);}; }(this.svg), false);
		}
		
		for(i in g.edges) {
			var e = g.edges[i];
			var p1 = e.src.getAttribute("pos");
			var p2 = e.dst.getAttribute("pos");
			p1 = p1.split(',');
			p2 = p2.split(',');
			var x1 = p1[0];
			var y1 = p1[1];
			var x2 = p2[0];
			var y2 = p2[1];
			
			var l = this.svg.Element('line', {'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, "style": "fill:none;stroke:black;stroke-width:1;"});
		}
//		JSVG.
//		alert(JSON.stringify(g));
};
