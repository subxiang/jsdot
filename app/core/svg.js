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
	
	
	
	
//	function Class(){ return function(arguments){ this.init(arguments); } }
	
	
	var JSVG = function(id) {
	
		this.root = null;
		this.designArea = null;
		this.coords = null;
		this.selectedObj = null;
		
		var svgns = "http://www.w3.org/2000/svg";
		var xlinkns = "http://www.w3.org/1999/xlink";
		var xmlns = "http://www.w3.org/XML/1998/namespace";
		
		this.xmlns = "http://www.w3.org/2000/svg";
		this.xlink = "http://www.w3.org/1999/xlink";

	
		function $e(i){ return document.createElementNS(xmlns, i); };
		function setAttrs (obj, values){ for (i in values) { obj.setAttributeNS(null, i, values[i]); } };
		function randColor(){ return "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"; };


		
		/** Builds the design area and adds event listeners. */
		this.buildDesignArea = function(){

			var self = this;
	
			this.designArea = this.Element('rect', { "height": "100%", "width": "85%", "x": "15%", "y": 0, "fill": "#eee", "id": "designArea" });
			
			// Drag and drop listeners
			this.designArea.addEventListener('mousemove', function(evt){ self.drag(evt); },false);
			this.designArea.addEventListener('mouseup', function(evt){ self.drop(evt); },false);
			// Add elements listener
			this.designArea.addEventListener('click',function(evt){ self.drawElement(evt); },false);
						
		};
		
		/**
		 * Draw an element depending on the selected form
		 * @param {Object} evt
		 */
		this.drawElement = function(evt){
		
			var self = this;
			
			switch(this.selectedObj) {
				
				// Creates a rectangle in the design area
				case 'rect':
				
					this.Element('rect', {
						"height": "5em",
						"width": "5em",
						"x": evt.clientX,
						"y": evt.clientY,
						"fill": "#ff0000",
						"id": this.toString()
						
					}).addEventListener('mousedown', function(evt){ self.grab(evt); }, false);
					
				break;
				
				// Creates a circle in the design area
				case 'circle':
				
					self.Element('circle', {
							"r": "2.5em",
							"cx": evt.clientX,
							"cy": evt.clientY,
							"fill": "#ddd",
							"fill-opacity": 0.85,
							"stroke": "#000",
							"stroke-opacity": 0.85
					}).addEventListener('mousedown', function(evt){ self.grab(evt); }, false);
									
				break;
			}
		};

		/**
		 * Set the element to be dragged.
		 * @param {Object} evt
		 */
		this.grab = function(evt){

			var targetElement = evt.target;
			
			if (this.designArea != targetElement) {

				this.selectedObj = targetElement;
				setAttrs(targetElement, {"fill-opacity": 0.5});
								
				// Calculates the element's coords
	            var transMatrix = targetElement.getCTM();
				this.getCoords(evt);
	            this.grabPoint.x = this.coords.x - Number(transMatrix.e);
	            this.grabPoint.y = this.coords.y - Number(transMatrix.f);
				
				// Set out target
				this.dragElement = targetElement;
				//this.dragElement.parentNode.appendChild(this.dragElement);
				this.dragElement.setAttributeNS(null, 'pointer-events', 'none');

			}
		};

		/**
		 * Drag the element throught the design area
		 * @param {Object} evt
		 */
		this.drag = function(evt){

	         if (this.dragElement) {
			 	this.getCoords(evt);
	            var newX = this.coords.x - this.grabPoint.x;
           		var newY = this.coords.y - this.grabPoint.y;
	            this.dragElement.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
	         }
		};

		/**
		 * Drop the element after mouseup event
		 * @param {Object} evt
		 */
		this.drop = function(evt){

			if (this.dragElement != null) {

				// Set the selected style
				setAttrs(this.selectedObj, {"fill-opacity": 1});
				
				this.dragElement.setAttributeNS(null, 'pointer-events', 'all');
				this.dragElement = null, this.selectedObj = null;
			} 
		};
		
		/**
		 * Get and set the true coordinates
		 * @param {Object} evt
		 */
		this.getCoords = function(evt){
			
			var scale = this.root.currentScale, translation = this.root.currentTranslate;
			
			this.coords.x = (evt.clientX - translation.x) / scale;
			this.coords.y = (evt.clientY - translation.y) / scale;
		};

		/** Builds the left menu, buttons and all listeners */
		this.buildMenu = function(){

			var self = this; this.toggle = false, this.cnt;
			
			this.cnt = this.Element('g', { 'id': 'leftMenu', 'width':'20%', 'height':'100%' });			
			this.bg = this.Element('rect',{ "height": "100%", "width": "100%", "x": 0, "y": 0, "fill": "#333"},this.cnt);

			// <-- Rectangle button
			this.Element('rect',{
				
				"height": "5em",
				"width": "5em",
				"x": ".5em",
				"y": ".5em",
				'stroke': 'red',
				"fill": "#ddd",
				"id": "rectBtn"
				
			}, this.cnt).addEventListener('click',function(evt){
				
				if (self.selectedObj) {
					setAttrs(self.selectedObj, {
						'stroke': 'red'
					});
				}
				// Select the object
				self.selectedObj = 'rect';
				setAttrs(this, {"stroke": "yellow"});
				
			},false);		
			// -->

			// <-- Circle button
			this.Element('circle', {
				"r": "2.5em",
				"cx": "9.5em",
				"cy": "3em",
				"fill": "#ddd",
				"fill-opacity": 0.85,
				"stroke": "red",
				"stroke-opacity": 0.85,
				"id": this.toString()
				
			}, this.cnt).addEventListener('click',function(evt){
				
				if (self.selectedObj) {
					setAttrs(self.selectedObj, { 'stroke': 'red' });
				}
				// Select the object
				self.selectedObj = 'circle';
				setAttrs(this, { "stroke": "yellow" });
				
			},false);	
			// -->

			this.Element('rect',{
				
				"height": "100%",
				"width": ".3%",
				"x": "14.7%",
				"y": 0,
				"fill": "#222",
				"id": "toggle"
				
			},this.cnt).addEventListener('click',function(){ 
			
				setAttrs(self.cnt,{'style':'-15%'});
	
			},false);
		};
	
		/**
		 * Creates and append an element
		 * @param {String} element
		 * @param {Object} attrs
		 * @param {Object} target (Optional)
		 */
		this.Element = function(element, attrs){

		  //  var el = this.$e(element);
		    var el = document.createElementNS(this.xmlns, element);
		    setAttrs(el, attrs);
		    arguments[2] ? arguments[2].appendChild(el) : this.root.appendChild(el);
			
			return el;
		}
		
		
		
		/** Constructor
		 * Creates the svg environment inside the div passed by id.
		 * 
		 */

			this.container = document.getElementById(id);
			this.svgdoc = this.container.ownerDocument;
			this.svgroot = this.svgdoc.createElementNS(svgns, "svg");
			this.svgroot.setAttribute("width", 640);
			this.svgroot.setAttribute("height", 480);
			this.svgroot.setAttribute("id", "svgroot");
			this.svgroot.setAttribute("xmlns", svgns);
			this.svgroot.setAttribute("xmlns:xlink", xlinkns);
			this.container.appendChild(this.svgroot);
			
			this.root = this.svgroot;
			/*
			this.root = document.createElement('svg');
			this.root.setAttribute('xmlns', "http://www.w3.org/2000/svg");
			document.getElementById(id).appendChild(this.root);
			*/
		
			//JSVG.root = this.root;.
	
		//	this.coords = this.root.createSVGPoint();
        // 	this.grabPoint = this.root.createSVGPoint();

			this.buildMenu();
			this.buildDesignArea();
			
			/*
			var new_layer = this.svgdoc.createElementNS(svgns, "g");
			var layer_title = this.svgdoc.createElementNS(svgns, "title");
			layer_title.textContent = name;
			new_layer.appendChild(layer_title);
			new_layer = this.svgroot.appendChild(new_layer);
			
			var circle = this.svgdoc.createElementNS(svgns, "circle");
			circle.setAttribute("r", "26");
			circle.setAttribute("cy", "74");
			circle.setAttribute("cx", "40");
			new_layer.appendChild(circle);
			*/
			
	return this;
	}
