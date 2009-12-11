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
 * Draw the graph
 */

JSDot.prototype.draw = function() {
	var g = this.graph;
	
	this.svg.clear();
	
	for(var i in g.edges) {
		this.svg.drawEdge(g.edges[i]);
	};
	
	for(var i in g.nodes) {
		this.svg.drawNode(g.nodes[i]);
	};
};

/**
 * Given a Node draws it
 * @param {Object} Node
 */
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
					svg.addEdge(evt);
				} else if (evt.which != 2 && evt.which != 3) {
					svg.grab(evt);
				}
			}; }(this), false);
	var t = $e('text');
	t.setAttrs({
		'x': pos[0], 'y': pos[1],
		'stroke': n.getColor(),
		'text-anchor': "middle"
	});
	t.textContent = n.getLabel();
	e.appendChild(t);
};

/**
 * Given an edge it draws it
 * @param {Object} Edge
 */
JSVG.prototype.drawEdge = function(edge) {
	var p1 = edge.src.getPos();
	var p2 = edge.dst.getPos();
	
	//g.setAttribute('id', 'e_'+edge.getName()); //FIXME: tbd
	var attrs = {'x1': p1[0], 'y1': p1[1], 'x2': p2[0], 'y2': p2[1], "style": "fill:none;stroke:black;stroke-width:1;"};
	if (this.jsdot.graph.directed) attrs['marker-end'] = 'url(#Arrow)';
	var l = $e('line');
	l.setAttrs(attrs);
	
	var g = $e('g');
	g.appendChild(l);
	
	this.svgroot.insertBefore(g, this.svgroot.firstChild);
};

/**
 * Draw the head of the arrow
 */
JSVG.prototype.drawFragments = function() {
	var marker = $e('marker');
	marker.setAttrs({'id': 'Arrow',
		'orient': 'auto',
		'refX': '2.5em',
		'refY': '0.0',
		'style': 'overflow:visible'});
	var path = $e('path');
	path.setAttrs({'d': 'M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z',
		'style': 'font-size:12.0;fill-rule:evenodd;stroke-width:0.62500000;stroke-linejoin:round'});
	path.setAttribute('transform', 'scale(1.1) rotate(180) translate(1,0)');
	marker.appendChild(path);
	this.svgroot.appendChild(marker);
};

/**
 * Remove all child of the SVG tag
 */
JSVG.prototype.clear = function() {
	while (this.svgroot.lastChild)
		this.svgroot.removeChild(this.svgroot.lastChild);

	// add picture fragments
	this.drawFragments();
};
