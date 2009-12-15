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
			
		this.text_area.innerHTML = this.jsdot.toJSON();
		this.show();
	},
	
	/**
	 * Make visible the popup for changing attributes of the node
	 * @param {Object} Node or Edge
	 * @param {String} type of first argument: 'n' for node, 'e' for edge
	 */
	show_attributes:function(element, kind) {
		
		if (typeof element == "string") {
			if (kind && kind == 'e')
				element = this.jsdot.getEdgeByName(element);
			else
				element = this.jsdot.getNodeByName(element);
		} else {
			if (element instanceof this.jsdot.Edge) kind = 'e';
			else kind = 'n';
		}
		
		var self = this;
		var div = $e('div',true);
		var childs = [];
		
			/**** Label */
			var label = $e("input", true);
			label.setAttrs({
				id: "label",
				name: 'label',
				type: "text",
				value:  element.getLabel(),
			});
			var lab = $e('label',true); lab.setAttribute('for','label');lab.innerHTML ="Label ";
			childs.push(lab);
			childs.push(label);
			
			/**** Line color */
			var line_color = this.colorPicker('line_color', 'Line Color', element.getColor());
			childs.push(line_color);
			
			/**** Fill color */
			var fill_color;
			if (kind == 'n') {
				fill_color = this.colorPicker('fill_color', 'Fill Color', element.getFillColor());
				childs.push(fill_color);
			}
			
			/**** Font color */
			var font_color;
			font_color = this.colorPicker('font_color', 'Font Color', element.getFontColor());
			childs.push(font_color);
			
			/**** Buttons */
			var p = $e("p", true);
			
			var save_button = document.createElement("input");
			var save_button_attr = {
				id: "change",
				value: "change",
				type: "submit",
			}
			save_button.setAttrs(save_button_attr);
			save_button.addEventListener("click", function(evt){
				self.change_element(evt, element, kind);
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
			childs.push(p);
			
			div.appends(childs);
			this.newDiv.appendChild(div);
			this.show();
	},
	
	show_help:function(){
		var div = $e('div',true);
		var p = $e('p',true);
		var self = this;
		
		str = "You can click on one of those item in the right menu:\
				<ul>\
  				<li>Selection: allow you to drag and drop and right click, such that you can make some changes, on the elements of the draw area</li>\
 				<li>Node: allow you to draw nodes </li>\
				<li>Edge: allow you to draw edges</li>\
				<li>Insert or see JSON: allow you to insert your graph model or to see the changes that you have done to the model</li>\
				<li>Escape button: undo any action<\li>\
				<li>Examples: some graph examples that we provide </li></ul>\
				Have fun!\
				For more informations visit <a href=\"http://code.google.com/p/jsdot/\" target=\"_blank\"> JSDot website</a>";		
		div.innerHTML = str;
		
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
		
		p.appends([exit_button]);
		div.appends([p])
		
		this.newDiv.appendChild(div);
		this.show();
	},
	
	/**
	 * Hide the popup
	 * @param {Object} evt
	 */	
	hide:function(evt) { 
		(this.backDiv).style.display = 'none';
		(this.newDiv).style.display = 'none';
		var children = this.newDiv.childNodes;
		while(children.length >= 1) {
			this.newDiv.removeChild(this.newDiv.firstChild);
		}
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
	change_element:function(evt, element, kind) {
		element.setLabel($('label').value);
		element.setColor($('line_color').value);
		element.setFontColor($('font_color').value);
		
		if (kind == 'n') {
			element.setFillColor($('fill_color').value);
		}
		this.jsdot.draw();
		
		var exit_button = $('exit button');
		exit_button.click();
	},
	
	/** Create a dropdown box with a list of colors
	 * 
	 * @param {String} id id of the 'select' tag
	 * @param {String} label content of label tag
	 * @param {String} selected name of pre-selected entry
	 * @param {DOMElement} parent optional, tag to append the created div to
	 */
	colorPicker: function(id, label, selected, parent) {
		var colors = ["black", "blue", "yellow", "red", "green", "lightgrey", "white"];
		
		var div = $e('div', true);
		if (label) {
			var lab = $e('label', true);
			lab.innerHTML = label + " ";
			div.appendChild(lab);
		}
		var sel = $e('select', true);
		sel.setAttribute('id', id);
		
		for (var i in colors) {
			var y = $e("option", true);
			y.setAttribute("value", colors[i]);
			if (colors[i] == selected) y.setAttribute('selected', 'true');
			y.appendChild(document.createTextNode(colors[i]));
			sel.appendChild(y);
		}
		
		div.appendChild(sel);
		
		if (parent) parent.appendChild(div);
		return div;
	}
}