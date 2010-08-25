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

/** Construct a JSDot instance.
	@class JSDot implementation
	Handles events dispatching.

	@constructor
*/
JSDot.jsdot_Impl = function() {

	/** Registered event handlers.
		@private
		@see addEventHandler
		@see fireEvent
	*/
	this.handlers = {};
	
	/** Attached graph.
		The graph on which the instance is working.
		@type Graph_impl
	*/
	this.graph = new JSDot.Graph_impl(this);

};

JSDot.jsdot_Impl.prototype = {

	/** Registers an event handler.
		When an event 'name' is triggered the function
		'handler' will be called.
		
		May also be called as addEventHandler(obj, handler_obj),
		in this case handler_obj may define functions for more events.
		
		@param {Object} obj object generating events
		@param {String} name name of the event
		@param {Handler} handler handler function
	*/
	addEventHandler: function(obj, name, handler) {
		if (typeof name == "string") {
			/* use case 1: single handler function */
			
			if (typeof handler != "function") return;

			/* create the entry for the event if it doesn't exist */
			if (!this.handlers[name]) this.handlers[name] = [];
			
			/* add handler */
			this.handlers[name].push([obj, handler]);
			
		} else {
			/* use case 2: handler object in 'name' */
			for (var i in name) {
				this.addEventHandler(obj, i, name[i]);
			}
		}
	},
	
	/** Removes an event handler.
		The handler function (or object) must be exactly the same
		instance used when registering the event.
		
		May also be called as addEventHandler(obj, handler_obj),
		in this case handler_obj may define functions for more events.
		
		@param {Object} obj object generating events
		@param {String} name name of the event
		@param {Handler} handler handler function to remove
	*/
	removeEventHandler: function(obj, name, handler) {
		if (typeof name == "string") {
			if (typeof handler != "function") return;
			if (!this.handlers[name]) return;
			var h = this.handlers[name];
			for (var i in h) {
				if (h[i][0] == obj && h[i][1] == handler) {
					h.splice(i, 1);
					return;
				}
			}
		} else {
			/* 'name' is the handler object */
			for (var i in name) {
				this.removeEventHandler(obj, i, name[i]);
			}
		}
	},

	/** Triggers an event.
		Calls all registered event handlers for event 'name'.
		@param {Object} obj source of the event
		@param {String} name name of the events
		@param {Object} arguments any following arguments will be passed on to the handler
	*/
	fireEvent: function() {
		var obj = Array.prototype.shift.apply(arguments);
		var name = Array.prototype.shift.apply(arguments); // remove name
		
		if (!this.handlers[name]) return;
		for (var i in this.handlers[name]) {
			var e = this.handlers[name][i];
			if (obj == null || e[0] == null || e[0] == obj) {
				e[1].apply(obj, arguments);
			}
		}
	},

};
