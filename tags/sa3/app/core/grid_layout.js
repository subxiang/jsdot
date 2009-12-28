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

/* This code has been ported from EiffelStudio
 * Src/library/graph/view/eg_grid_layout.e
 * which is
 * Copyright (c) 1984-2006, Eiffel Software and others
 * see http://www.eiffel.com
 */

JSDotGridLayout = new Class();

JSDotGridLayout.prototype = {
		exp: 1.0,
		n_cols: 1,
		ax: 0,
		ay: 0,
		bx: 0,
		by: 0,
		
		/** Initialize grid layout
		 * a and b are two points which define a rectangle
		 * containing the grid.
		 */
		init: function(jsdot, ax, ay, bx, by) {
			this.jsdot = jsdot;
			this.ax = ax;
			this.ay = ay;
			this.bx = bx;
			this.by = by;
		},
		
		/** Sets the number of columns
		 * @param n number of columns
		 */
		setColumns: function(n) {
			this.n_cols = n;
		},
		
		layout: function() {
			var nodes = this.jsdot.getNodesArray();
			var sx, sy, dx, dy, n_rows;
			var level = 1;
	
			if (this.n_cols == 1) {
				sx = Math.floor(this.ax/2) + Math.floor(this.bx/2);
				dx = 0;
			} else {
				dx = Math.floor((this.bx - this.ax) / ((this.n_cols-1) * Math.pow(level, this.exp)));
				sx = this.ax;
			}
			
			n_rows = Math.ceil(nodes.length / this.n_cols);
			if (n_rows == 1) {
				sy = Math.floor(this.ay / 2) + Math.floor(this.by / 2);
				dy = 0;
			} else {
				dy = Math.floor((this.by - this.ay) / ((n_rows-1) * Math.pow(level, this.exp)));
				dy = Math.floor(dy / level);
				sy = this.ay;
			}
			
			for (var r=0, i=0; r < n_rows; r++) {
				for (var c = 0; c < this.n_cols && i < nodes.length;) {
					if (level == 1) {
						nodes[i].setPos(sx + c*dx, sy + r*dy);
					} else {
						var p = nodes[i].getPos();
						nodes[i].setPos(p[0] + c*dx, p[1] + r*dy);
					}
					i++;
					c++;
				}
			}
		}
}
