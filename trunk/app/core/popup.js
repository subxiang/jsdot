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

var Popup = new Class();

Popup.prototype = {
	
	prova: '{"name": "graph1", "directed": false, "nodes": ["node1"], "edges": [], "attributes": { "label": "graph with a single node"}}',
	doc: null,
	newDiv: null,
	
	init:function(jsdot, parent, type) {
		this.jsdot = jsdot;
		this.doc = parent.ownerDocument;
		this.newDiv = this.doc.createElement('div');
		if (type == "popup") {
			this.newDiv.setAttribute('style', 'position:absolute; left:10%; top:10%; height:80%; width:80%; background:white; border-color:black; border-width:0.5em; padding:0.4em; display:None');
		}
		parent.appendChild(this.newDiv);
	},
	
	show:function() {
		(this.newDiv).style.display = 'block';
		var self = this;
		
		var text_area = document.createElement("textarea");
		text_area.setAttribute("id", "text");
		text_area.setAttribute("name", "text");
		var json = document.createTextNode(this.jsdot.toJSON());
		text_area.appendChild(json);
		this.newDiv.appendChild(text_area);
		
		var p = document.createElement("p");
		
		var save_button = document.createElement("input");
		save_button.setAttribute("id", "save button");
		save_button.setAttribute("value", "Load/Save");
		save_button.setAttribute("type", "submit");
		save_button.addEventListener("click", function(evt){ self.load_string(evt); }, false);
		
		var exit_button = document.createElement("input");
		exit_button.setAttribute("id", "exit button");
		exit_button.setAttribute("value", "Exit");
		exit_button.setAttribute("type", "submit");
		exit_button.addEventListener("click", function(evt){ self.hide(evt); }, false);
		
		p.appendChild(save_button);
		p.appendChild(exit_button);
		
		this.newDiv.appendChild(p);
	},
	
	hide:function(evt) { 
		(this.newDiv).style.display = 'None';
		var children = this.newDiv.childNodes;
		while(children.length >= 1) {
			this.newDiv.removeChild(this.newDiv.firstChild);
		}
	},
	
	load_string:function(evt) {
		var content = document.getElementById('text').value;
		res = {};
		if(content != "") {
			//TODO: check return value
			this.jsdot.loadJSON(content);
			res = this.jsdot.graph;
		//	jsdot.draw();
		}
		alert(res)
		var exit_button = document.getElementById('exit button');
		exit_button.click();	
	}
}