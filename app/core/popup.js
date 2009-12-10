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
	
	prova: {"name":"graph2","directed":false,"nodes":[{"name":"node1","attributes":{"label":"a","color":"blue","pos":"200,100"}},{"name":"node2","attributes":{"label":"b","color":"red","pos":"500,100"}}],"edges":[{"src":"node1","dst":"node2","attributes":{"label":"edge1","style":"dotted"}}],"attributes":{"label":"undirected graph with two nodes and one edge"}},
	doc: null,
	newDiv: null,
	jsdot: null,
	
	init:function(jsdot, parent, type) {
		this.jsdot = jsdot;
		this.doc = parent.ownerDocument;
		this.newDiv = this.doc.createElement('div');
		this.newDiv.setAttribute('style', 'position:absolute; left:10%; top:10%; height:80%; width:80%; background:white; border-color:black; border-width:0.5em; padding:0.4em; display:None; z-index:1000');
		parent.appendChild(this.newDiv);
	},
	
	show_JSON:function() {
        (this.newDiv).style.display = 'block';
        var self = this;
        
        var text_area = document.createElement("textarea");
		var text_area_attr = {
			id: "text",
			name: "text",
			style: "height:80%; width:100%;"
		};
		setAttrs(text_area, text_area_attr);

        var json = document.createTextNode(this.jsdot.toJSON());
        text_area.appendChild(json);
        this.newDiv.appendChild(text_area);
        
        var p = document.createElement("p");
        
        var save_button = document.createElement("input");
		var save_button_attr = {
			id: "save button",
			value: "load and save",
			type: "submit",
		}
        setAttrs(save_button, save_button_attr);
        save_button.addEventListener("click", function(evt){
            self.load_string(evt);
        }, false);
        
        var exit_button = document.createElement("input");
		var exit_button_attr = {
			id:  "exit button",
			value:  "Exit",
			type: "submit"
		}
   		setAttrs(exit_button, exit_button_attr);
        exit_button.addEventListener("click", function(evt){
            self.hide(evt);
        }, false);
        
        p.appendChild(save_button);
        p.appendChild(exit_button);
        
        this.newDiv.appendChild(p);
	},
	
	show_attributes:function(node) {
		
		if (typeof node == "string") node = this.jsdot.getNodeByName(node);
		var self = this;
		
		var label = document.createElement("input");
		var label_attr = {
			id:  "label",
			type: "text",
			value: node.getLabel()
		}
   		setAttrs(label, label_attr);
		this.newDiv.innerHTML += "Label ";
		this.newDiv.appendChild(label);
		this.newDiv.innerHTML += "<br />";
		this.newDiv.innerHTML += "Fill color ";
		
		// color 
		var fill_color = document.createElement("select");
		fill_color.setAttribute("name", "color");	
		fill_color.setAttribute("id", "fill_color");
		var current_value = node.getFillColor();
		var current = document.createElement("option");
		current.setAttribute("value", current_value);
		current.setAttribute("selected", "true");
		current.appendChild(document.createTextNode(current_value));
		fill_color.appendChild(current);
		var blue = document.createElement("option");
		blue.setAttribute("value", "blue");
		blue.appendChild(document.createTextNode('blue'));
		fill_color.appendChild(blue);
		var yellow = document.createElement("option");
		yellow.setAttribute("value", "yellow");
		yellow.appendChild(document.createTextNode('yellow'));
		fill_color.appendChild(yellow);
		var red = document.createElement("option");
		red.setAttribute("value", "red");
		red.appendChild(document.createTextNode('red'));
		fill_color.appendChild(red);
		var green = document.createElement("option");
		green.setAttribute("value", "green");
		green.appendChild(document.createTextNode('green'));
		fill_color.appendChild(green);
		
		this.newDiv.appendChild(fill_color);
		
		var p = document.createElement("p");
        
        var save_button = document.createElement("input");
		var save_button_attr = {
			id: "change",
			value: "change",
			type: "submit",
		}
        setAttrs(save_button, save_button_attr);
        save_button.addEventListener("click", function(evt){
            self.change_node(evt, node);
        }, false);
        
        var exit_button = document.createElement("input");
		var exit_button_attr = {
			id:  "exit button",
			value:  "Exit",
			type: "submit"
		}
   		setAttrs(exit_button, exit_button_attr);
        exit_button.addEventListener("click", function(evt){
            self.hide(evt);
        }, false);
        
        p.appendChild(save_button);
        p.appendChild(exit_button);
        
        this.newDiv.appendChild(p);
        this.newDiv.style.display = 'block';

	},
		
	hide:function(evt) { 
		(this.newDiv).style.display = 'None';
		var children = this.newDiv.childNodes;
		while(children.length >= 1) {
			this.newDiv.removeChild(this.newDiv.firstChild);
		}
	},
	
	load_string:function(evt) {
		var content = $('text').value;
		if(content != "") {
			this.jsdot.loadJSON(content);
			// TODO control return value
			this.jsdot.draw();
		}
		var exit_button = $('exit button');
		exit_button.click();	
	},
	
	change_node:function(evt, node) {
		var fill_color = $('fill_color').value;
		var label = $('label').value;
		
		if(label != "") {
			node.setLabel(label);
		}
		node.setFillColor(fill_color);
		
		this.jsdot.draw();
		
		var exit_button = $('exit button');
		exit_button.click();
	}
}