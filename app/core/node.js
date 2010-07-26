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

/** @class Node API
	API to modify a node.
	@constructor
	@private
	Create an object that can be used to modify a node.
	@param {Node_impl} impl internal representation of the node that will be modified
*/
JSDot.Node = function(jsdot, impl) {

	/** Set node's label.
		@param {String} l new label
	*/
	this.setLabel = function(l) {
		if (impl.label) {
			impl.label.value = l;
		} else {
			impl.label = {'type': 'plain', 'value': l};
		}
	};
	
	/** Set node's position.
		@param {Array} p new position in the form [x, y]
	*/
	this.setPosition = function(p) {
		impl.position = p;
		jsdot.fireEvent('moved', impl);
	};
	
	/** Returns node's current position.
		@retun {Array} node's position in the form [x, y]
	*/
	this.getPosition = function() {
		return this.position;
	};

};
