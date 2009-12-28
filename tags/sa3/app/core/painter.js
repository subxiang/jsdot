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
	var e;
	if (n.getShape() == 'box') {
		var len = n.getLabel().length;
		e = this.Element('rect', {
			'id': 'n_'+n.getName(),
			'x': pos[0]-(len/2*12)-15, 'y': pos[1]-15,
			'height': 30, 'width': len*12+30,
			'stroke': n.getColor(),
			'fill': n.getFillColor()
		});
	} else {
		e = this.Element('circle', {
			'id': 'n_'+n.getName(),
			'r': '2.5em', 'cx': pos[0], 'cy': pos[1],
			'stroke': n.getColor(),
			'fill': n.getFillColor()
			});
	}
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
		'stroke': 'none',
		'fill': n.getFontColor(),
		'text-anchor': "middle",
		'dominant-baseline': 'middle'
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
	
	// edge line, eventually with arrow
	var style = "fill:none;stroke-width:1;";
	style += 'stroke:' + edge.getColor() + ';';
	var attrs = {'d': 'M'+p1+'L'+p2, "style": style};
	if (this.jsdot.graph.directed) attrs['marker-end'] = 'url(#Arrow)';
	var l = $e('path');
	l.setAttribute('id', 'e_'+edge.getName()+'+line');
	l.setAttrs(attrs);
	
	// selection handle for right-click menu
	// and path with the right direction for the label
	var h = $e('path');
	if (p2[0] < p1[0])
		attrs = {'d': 'M'+p2+'L'+p1};
	else
		attrs ={'d': 'M'+p1+'L'+p2};
	attrs.style = "fill:none;stroke:yellow;opacity:0;stroke-width:10;";
	attrs.id = 'e_'+edge.getName()+'+handle';
	h.setAttrs(attrs);

	var g = $e('g');
	g.setAttribute('id', 'e_'+edge.getName());
	g.appendChild(h);
	g.appendChild(l);
	
	var label = edge.getLabel();
	if (label) {
		var s = $e('tspan');
		s.setAttribute('dy', '-5');
		s.textContent = label;
		var p = $e('textPath');
		p.setAttributeNS(xlinkns, 'xlink:href', '#e_'+edge.getName()+'+handle');
		p.setAttrs({'startOffset': '50%', 'text-anchor': 'middle'});
		p.appendChild(s);
		var t = $e('text');
		//t.setAttribute('font-size', 20);
		t.setAttribute('fill', edge.getFontColor());
		t.setAttribute('id', 'e_'+edge.getName()+'+text');
		t.appendChild(p);
		g.appendChild(t);
	}
	
	this.svgroot.insertBefore(g, this.svgroot.firstChild);
};

/**
 * Draw the head of the arrow
 */
JSVG.prototype.drawFragments = function() {
	var defs = $e('defs');
	
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
	defs.appendChild(marker);
	
	this.svgroot.appendChild(defs);
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
