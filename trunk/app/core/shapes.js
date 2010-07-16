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

/** Node shapes.
	The shape of a node. It is drawn by using a @ref stencil.
*/
jsdot_shapes = {

	'circle': {
	
		size: '2.5em',
		
		draw: function(n, g) {
			var c = $e('circle');
			c.setAttrs({
				'r': this.size
			})
			g.appendChild(c);
			n.view.shape = c;
			return c;
		},
		
		setPosition: function(n) {
			n.view.shape.setAttrs({
				'cx': n.position[0],
				'cy': n.position[1]
			});
		},
		
		getBoundaryTo: function(n, p) {
			var c = n.position; // node center
			var a = Math.atan2((p[1]-c[1]), (p[0]-c[0]));
			var size = n.view.shape.r.baseVal.value;
			return [
				c[0] + Math.cos(a) * size,
				c[1] + Math.sin(a) * size
			];
		},
		
		setSize: function(n, s) {
			n.view.shape.setAttribute('r', Math.max(s.height,s.width)/2+6);
		}
	},
	
	'box': {
		draw: function(n, g) {
			var e = $e('rect');
			e.setAttrs({
				'height': 30,
				'width': 50
			});
			g.appendChild(e);
			n.view.shape = e;
			return e;
		},
		
		setPosition: function(n) {
			n.view.shape.setAttrs({
				'x': n.position[0] - n.view.shape.width.baseVal.value / 2,
				'y': n.position[1] - n.view.shape.height.baseVal.value / 2
			});
		},
		
		getBoundaryTo: function(n, p) {
		
			//get rect dimensions
			var x = n.view.shape.x.baseVal.value; /* left */
			var y = n.view.shape.y.baseVal.value; /* top */
			var height = n.view.shape.height.baseVal.value;
			var width = n.view.shape.width.baseVal.value;
			
			var xl = x; /* left edge of rect */
			var xr = x + width; /* right edge of rect */
			var slope = (p[1]-(y+height/2)) / (p[0]-(x+width/2));
			/* division by 0 gives Infinity, which is fine! */
			
			if (p[1] <= y) {
				/* intersection with upper part of rect */
				var iup = (y-p[1]) / slope + p[0];
				if (iup < xl) {
					/* intersection on left side */
					var il = (xl-p[0]) * slope + p[1];
					return [xl, il];
				} else if (iup > xr) {
					/* intersection on right side */
					var ir = (xr-p[0]) * slope + p[1];
					return [xr, ir];
				} else {
					/* intersection on top */
					return [iup, y];
				}
			} else {
				/* intersection with bottom or center part of rect */
				var ibt = (y+height-p[1]) / slope + p[0];
				if (ibt < xl) {
					/* intersection on left side */
					var il = (xl-p[0]) * slope + p[1];
					return [xl, il];
				} else if (ibt > xr) {
					/* intersection on right side */
					var ir = (xr-p[0]) * slope + p[1];
					return [xr, ir];
				} else {
					/* intersection on top */
					return [ibt, y+height];
				}
			}
		},
		
		setSize: function(n, s) {
			n.view.shape.setAttrs({
					'height': s.height+3,
					'width': s.width+10
				});
			this.setPosition(n);
		}
	}
};

/** Node stencils.
	Stencils are composed by a shape and
	a style, which may be defined in css.
	
	Differenct stencils may share the same shape and apply
	different styles.
*/
jsdot_stencils = {

	'circle': {
	
		shape: jsdot_shapes.circle,
		
		cssClass: 'jsdot_circle',
		cssHl: 'jsdot_def_hl',
		
		draw: function(n, g) {
			this.shape.draw(n, g);
			g.setAttribute('class', this.cssClass);
		},
		
		setPosition: function(n) {
			this.shape.setPosition(n);
		},
		
		setSize: function(n, s) {
			this.shape.setSize(n, s);
		},
		
		getBoundaryTo: function(n, p) {
			return this.shape.getBoundaryTo(n, p);
		},
		
		highlight: function(n, y) {
			if (y) {
				n.view.group.setAttribute('class', this.cssClass+' '+this.cssHl);
			} else {
				n.view.group.setAttribute('class', this.cssClass);
			};
		}
	},
	
	'box': {
	
		shape: jsdot_shapes.box,
		
		cssClass: 'jsdot_box',
		cssHl: 'jsdot_def_hl',
		
		draw: function(n, g) {
			this.shape.draw(n, g);
			g.setAttribute('class', this.cssClass);
		},
		
		setPosition: function(n) {
			this.shape.setPosition(n);
		},
		
		setSize: function(n, s) {
			this.shape.setSize(n, s);
		},
		
		getBoundaryTo: function(n, p) {
			return this.shape.getBoundaryTo(n, p);
		},
		
		highlight: function(n, y) {
			if (y) {
				n.view.group.setAttribute('class', this.cssClass+' '+this.cssHl);
			} else {
				n.view.group.setAttribute('class', this.cssClass);
			};
		}
	},
};

/** Edge shapes.
*/
jsdot_edge_shapes = {

	'directed line': {
	
		draw: function(e, p) {
			var l = $e('path');
			e.view.line = l;
			l.setAttribute('marker-end', 'url(#Arrow)');
			p.appendChild(l);
			return l;
		},
		
		setPosition: function(e) {
			var p1 = e.view.start;
			var p2 = e.view.end;
			e.view.line.setAttrs({
				'd': 'M'+p1[0]+','+p1[1]+'L'+p2[0]+','+p2[1]
			});
		}
	}
};

/** Edge stencils.
	Stencils used to draw edges.
*/
jsdot_edge_stencils = {

	'line': {
	
		shape: jsdot_edge_shapes['directed line'],
		
		cssClass: 'jsdot_line_edge',
		cssHl: 'jsdot_def_hl',
	
		draw: function(e, p) {
			this.shape.draw(e, p);
			p.setAttribute('class', this.cssClass);
		},
		
		setPosition: function(e) {
			this.shape.setPosition(e);
		},
		
		highlight: function(e, y) {
			if (y) {
				e.view.group.setAttribute('class', this.cssClass+' '+this.cssHl);
			} else {
				e.view.group.setAttribute('class', this.cssClass);
			};
		}
	}
};

/** Insert external SVG elements.
	@private
	This is a workaround, since url() references added from
	javascript are not loaded.
	
	@param {jsdot_View} view view of a JSDot instance to which the elements will be added
	@param {String} file SVG file to load
*/
jsdot_load_svg_shapes = function(view, file) {

	var request = new XMLHttpRequest();
	if (request.overrideMimeType) {
		request.overrideMimeType('text/xml')
	}
	request.open("GET", file, false); // synchronous
	request.send();
	
	//if (request.status != 200) return;
	
	var xml = request.responseXML;
	var defs = xml.getElementsByTagName('defs')[0];
	defs.parentNode.removeChild(defs);
	view.svgroot.appendChild(defs);

return;

/*
	var defs = $e('defs');
	view.svgroot.appendChild(defs);
	
	
	// Arrow
	var m = $e('marker');
	m.setAttrs({
		'id': 'Arrow',
		'refy': '0.0',
		'refx': '30',
		'orient': 'auto',
		'style': 'overflow:visible;'
	});
	var l = $e('path');
	l.setAttrs({
		'transform': 'scale(1.1) rotate(180) translate(1,0)',
		'd': 'M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z'
	});
	m.appendChild(l);
	defs.appendChild(m);
*/
};

/** Stencils for drawing labels.
*/
jsdot_node_label_stencils = {

	'plain': {
	
		draw: function(n, p) {
			var t = $e('text');
			t.setAttribute('class', 'jsdot_node_label');
			t.textContent = n.label.value;
			p.appendChild(t);
			n.view.label = t;
			return t;
		},
		
		setPosition: function(n) {
			n.view.label.setAttrs({
				'x': n.position[0],
				'y': n.position[1]
			});
		},
		
		getSize: function(n) {
			return n.view.label.getBBox();
			//return n.view.label.getBoundingClientRect();
		},
	},
};
