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

/** The popup API
 * This defines the functions that are used to provide boxes 
 * with which the user can interact
 */
	

var Popup = new Class();

Popup.prototype = {
	
	doc: null,
	backDiv:null,
	newDiv: null,
	jsdot: null,
	
	/**
	 * Popup constructor
	 * @param {Object} jsdot
	 * @param {Object} parent
	 * @param {Object} type
	 */
	init:function(jsdot, parent, type) {
		
		var self = this;
		this.jsdot = jsdot;
		this.doc = parent.ownerDocument;
		this.backDiv = this.doc.createElement('div');
		this.backDiv.setAttribute('style', 'position:absolute; height:100%; width:100%; opacity: 0.9; background-color:#000; display:none; z-index:1000');
		this.newDiv = this.doc.createElement('div');
		this.newDiv.setAttribute('style', 'position:absolute; left:10%; top:10%; padding:5px; height:80%; width:80%; background:#ddd; border-color:black; opacity: 1.0; border-width:0.5em; padding:0.4em; display:None; z-index:1000');
		
		var tl = $e('div',true),tr = $e('div',true),bl = $e('div',true),br = $e('div',true),closeBtn = $e('div',true);
		tl.className = "tl";tr.className = "tr";bl.className = "bl";br.className = "br"; closeBtn.className = "closeBtn";
		closeBtn.addEventListener("click", function(evt){
            self.hide(evt);
        }, false);
		this.newDiv.appends([tl,tr,bl,br,closeBtn]);
		parent.appends([this.backDiv,this.newDiv]);
	},
	
	/**
	 * Make visible the popup for inserting/changing and controlling
	 * the JSON string that represents the graph
	 */
	show_JSON:function() {

		this.show();
        if(this.attrs) this.attrs.parentNode.removeChild(this.attrs);
		if (!this.text_area) {

	        var self = this;
			this.text_area = $e("textarea", true);
			var exit_button = $e("input",true);			
			var p = $e("p",true);
			var save_button = $e("input",true);

			this.text_area.setAttrs({
				id: "text",
				name: "text",
				style: "height:80%; width:99.5%;margin:20px auto 0 auto; border:1px solid #666;padding:2px;"
			});
			save_button.setAttrs({
				id: "save button",
				value: "load and save",
				type: "submit",
			});			
			exit_button.setAttrs({
				id: "exit button",
				value: "Exit",
				type: "submit"
			});
			exit_button.addEventListener("click", function(evt){
				self.hide(evt);
			}, false);
			save_button.addEventListener("click", function(evt){
				self.load_string(evt);
			}, false);
			p.appends([save_button,exit_button]);
			this.newDiv.appends([this.text_area,p]);
		}
		this.text_area.innerHTML = this.jsdot.toJSON();
	},
	
	/**
	 * Make visible the popup for changing attributes of the node
	 * @param {Object} Node or Edge
	 * @param {String} type of first argument: 'n' for node, 'e' for edge
	 */
	show_attributes:function(node, kind) {
		
		if (typeof node == "string") {
			if (kind && kind == 'e')
				node = this.jsdot.getEdgeByName(node);
			else
				node = this.jsdot.getNodeByName(node);
		}
		var self = this;
		
		if(this.text_area) this.text_area.parentNode.removeChild(this.text_area);
		if (!this.attrs) {
			this.attrs = $e('div',true);
			this.label = $e("input", true);
			this.label.setAttrs({
				id: "label",
				name: 'label',
				type: "text",
				value:  node.getLabel(),
			});
			var lab = $e('label',true); lab.setAttribute('for','label');lab.innerHTML ="Label ";
			
			
			// color 
			var fill_color = $e("select", true);
			fill_color.setAttrs({
				name: "color",
				id: "fill_color"
			});
			
			var current_value = node.getFillColor();
			this.current = $e("option", true);
			
			this.current.setAttrs({
				value: current_value,
				selected: true
			});
			this.current.appendChild(document.createTextNode(current_value));
			fill_color.appendChild(this.current);
			
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
			
			var p = document.createElement("p");
			
			var save_button = document.createElement("input");
			var save_button_attr = {
				id: "change",
				value: "change",
				type: "submit",
			}
			save_button.setAttrs(save_button_attr);
			save_button.addEventListener("click", function(evt){
				self.change_node(evt, node);
			}, false);
			
			var exit_button = document.createElement("input");
			var exit_button_attr = {
				id: "exit button",
				value: "Exit",
				type: "submit"
			}
			exit_button.setAttrs(exit_button_attr);
			exit_button.addEventListener("click", function(evt){
				self.hide(evt);
			}, false);
			
			p.appends([save_button,exit_button]);
			
			var br = $e('br', true);
			var lab1 = $e('label',true); lab1.setAttribute('for','label');lab1.innerHTML ="Background ";

			this.attrs.appends([lab,this.label,br,lab1,fill_color,p]);
			this.newDiv.appendChild(this.attrs);
			this.show();
		} else {
			this.label.setAttribute("value", node.getLabel());
			this.current.value = node.getFillColor();
			this.show();
		}

	},
	
	/**
	 * Hide the popup
	 * @param {Object} evt
	 */	
	hide:function(evt) { 
		(this.backDiv).style.display = 'none';
		(this.newDiv).style.display = 'none';
	},

	/**
	 * Show the popup
	 * @param {Object} evt
	 */	
	show:function(evt) { 
		this.backDiv.style.display = '';
		this.newDiv.style.display = '';
	},
	
	/**
	 * Load the JSON string and hide the popup
	 * @param {Object} evt
	 */
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
	
	/**
	 * Change attributes of the Node
	 * @param {Object} evt
	 * @param {Object} Node
	 */
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