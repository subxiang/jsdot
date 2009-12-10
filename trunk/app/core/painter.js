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
		
		this.svg.clear();
		
		for(var i in g.edges) {
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
		};
		
		for(var i in g.nodes) {
			this.svg.drawNode(g.nodes[i]);
		};
};

JSVG.prototype.drawNode = function(n) {
	var pos = n.getPos();
	var e = this.Element('circle', {
		'id': 'n_'+n.getName(),
		'r': '2.5em', 'cx': pos[0], 'cy': pos[1],
		'stroke': n.getColor(),
		'fill': n.getFillColor()
		});
	e.addEventListener('mousedown',
		function(svg){
			return function(evt) {
				if (svg.selected == 'edge') {
					svg.drawEdge(evt);
				} else if (evt.which != 2 && evt.which != 3) {
					svg.grab(evt);
				}
			}; }(this), false);
	var t = $e('text');
	setAttrs(t, {
		'x': pos[0], 'y': pos[1],
		'stroke': n.getColor(),
		'text-anchor': "middle"
	});
	t.textContent = n.getLabel();
	e.appendChild(t);
};

/** Remove all child of the SVG tag
 * 
 */
JSVG.prototype.clear = function() {
	while (this.svgroot.lastChild)
		this.svgroot.removeChild(this.svgroot.lastChild);
};
