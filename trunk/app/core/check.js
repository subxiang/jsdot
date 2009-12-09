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

var Check = new Class();

Check.prototype = {
	
	graph: null,
	no_nodes: 0,
	visited: new Array(),
	parent: new Array(),
	
	init:function(jsdot) {
		this.graph = jsdot.graph;
		this.no_nodes = this.counter(this.graph.nodes);
		this.check_directed();
	},
	
	/*
	 * WORK ONLY FOR UNDIRECTED GRAPH
	 * use the DFS to find cycles and to see if all were visited
	 */
	check_directed:function() {
		// initialize the parent array
		var key;
		for(key in this.graph.nodes) {
		 	this.parent[key] = null;
		}		
	
		for (key in this.graph.nodes) {
			if (!this.visited[key]) {
				this.check_directed_modified(key);
			}
		}	
	},
	
	check_directed_modified:function(key) {
		this.visited[this.visited.length] = key;
		// find the neighboors
		
		// if visited look for cycle
		// else set the parent and go down 
		
		alert(this.visited);
		return;
	},
	
	look_for_cycle:function() {
		
	},
	
	
	check_undirected:function() {
		
	},
	
	
	counter:function(object) {
		var size = 0;
		var key;
		for(key in object) {
			size++;
		}
		return size;
	}
	
	
}