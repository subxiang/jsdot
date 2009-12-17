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

/** The JSVG API
 * This defines the functions that are used for drawing
 * the graph
 */

var JSVG = new Class();

JSVG.prototype = {

    designArea: null,
    coords: null,
    selected: null,
    popup: null,
	edge: null,
	current:null,
	leftMenuSize:220,
        
    /** 
     * JSVG constructor
     * @param {Object} jsdot
     * @param {Object} id (destination div id)
     */
    init: function(params){

		this.jsdot = params.jsdot;
		
        this.container = $(params.targetId);
        this.svgdoc = this.container.ownerDocument;
        this.svgroot = $e("svg");
		JSVG.svgroot = this.svgroot;
        this.container.appendChild(this.svgroot);
        this.container.style.position = "relative";
        this.popup = new Popup(this, this.container, 'popup');
        
		if(params.leftMenu) {
	        this.buildMenu();
		} else {
			this.leftMenuSize = 0;	
		}
        
		this.svgroot.setAttrs({
            "width": window.innerWidth - this.leftMenuSize,
            "id": "svgroot",
			"style": "position:absolute;top:0;right:0;background:#cedbc3;padding:0;margin:0;",
            "xmlns": svgns,
            "xmlns:xlink": xlinkns
        });
        
        this.coords = this.svgroot.createSVGPoint();
        this.grabPoint = this.svgroot.createSVGPoint();		
		var self = this;
		
        // Drag and drop listeners
        this.svgroot.addEventListener('mousemove', function(evt){
			if (self.selected == 'edge' && self.edge != null) {
				self.edge.setAttrs({
					'x2': evt.clientX - self.leftMenuSize - 2,
					'y2': evt.clientY - 2
				});
			} else {
	            self.drag(evt);
			}
        }, false);
        this.svgroot.addEventListener('mouseup', function(evt){
            self.drop(evt);
        }, false);
        // Add elements listener
        this.svgroot.addEventListener('click', function(evt){
            self.dispatchEvent(evt);
        }, false);
        // Right click listener
        this.svgroot.addEventListener('mousedown', function(evt){
			if (evt.which == 2 || evt.which == 3) {
				self.showRightMenu(evt);
			}
		}, false);
        // Right click listener
        window.addEventListener('keypress', function(evt){
			
			switch(evt.keyCode){
				case 27: // escape
					self.popup.hide();
					self.selected = null;
					self.pointOne = false;
					if (self.edge) {
						self.edge.parentNode.removeChild(self.edge);
						self.edge = null;
					}	
				break;
			}
		}, false);
		 // Resize listener
        window.addEventListener('resize', function(evt){
			self.svgroot.setAttribute("width", window.innerWidth - self.leftMenuSize);
		}, false);
		document.oncontextmenu = new Function("return false");
    },
	
	/**
	 * Show and hide the right click menu
	 * (if first time, it creates the menu in the DOM)
	 * @param {Object} evt
	 */
	showRightMenu: function(evt) {
		
		if (!this.rightMenuCnt) {
			
			this.rightMenuCnt = $e('div', true);
			this.rightMenuCnt.setAttrs({
				'style': 'top:' + evt.clientY + 'px;left:' + evt.clientX + 'px;border:2px solid #999;-moz-border-radius: 5px; -webkit-border-radius: 5px;',
				'class' : 'rightMenu'
			});
			
			var self = this, el;

			/** Object that defines the label inside the menu
			 *  @struct { label : function } */
			var func = {
				'delete': function(){
					self.deleteElement(self.node_name.slice(2), self.node_name[0]);
				},
				'show attributes': function(){
					self.popup.show_attributes(self.node_name.slice(2), self.node_name[0]);
				}
			};
			
			for (label in func) {
			
				el = $e('a', true);
				el.addEventListener('click', func[label], false);
				el.innerHTML = label;
				this.rightMenuCnt.appendChild(el);
			}
			
			this.container.appendChild(this.rightMenuCnt);
			
		} else {
			this.rightMenuCnt.style.display = 'block';
			this.rightMenuCnt.style.top = evt.clientY + 'px';
			this.rightMenuCnt.style.left = evt.clientX + 'px';			
		}
		
		// get affected node
		this.node_name = evt.target.parentNode.id;
		var time;		
		
		if ((this.node_name[0] == 'n' || this.node_name[0] == 'e') && this.node_name[1] == '_') {
			this.rightMenuCnt.addEventListener('mouseout', function(evt){
				var self = this;
				time = setTimeout(function(){ self.style.display = 'none'; }, 500);
			}, false);
			
			this.rightMenuCnt.addEventListener('mouseover', function(evt){
				clearTimeout(time);
			}, false);
		} else {
			this.rightMenuCnt.style.display = 'none';
		}
	},
	
	deleteElement:function(name, kind){
		if (kind == 'e')
			this.jsdot.removeEdge(name);
		else
			this.jsdot.removeNode(name);
		this.jsdot.draw();
	},
    
    /**
     * Dispatch different events
     * @param {Object} evt
     */
    dispatchEvent: function(evt){
    
        var self = this, element;
        
        if (this.selected != null) {

			if (self.selected != 'edge') {
				
				if (this.selected == 'circle') {
					var node = this.jsdot.newNode();
					node.setPos(evt.clientX-this.leftMenuSize, evt.clientY);
					this.drawNode(node);
				} else {
					throw({'name': 'RangeError', 'message': 'unexpected selection'})
				}
			}
        } 
    },
    
    /**
     * Get and set the true coordinates
     * @param {Object} evt
     */
    getCoords: function(evt){
    
        var scale = this.svgroot.currentScale, translation = this.svgroot.currentTranslate;
        this.coords.x = (evt.clientX - translation.x) / scale;
        this.coords.y = (evt.clientY - translation.y) / scale;
    },
    
    /**
     * Set the element to be dragged
     * @param {Object} evt
     */
    grab: function(evt){
    
        var targetElement = evt.currentTarget;
        
        if (this.designArea != targetElement) {
        
            this.selected = targetElement;
            
            // Calculates the element's coords
            var transMatrix = targetElement.getCTM();
            this.getCoords(evt);
            this.grabPoint.x = this.coords.x - Number(transMatrix.e) + this.leftMenuSize;
			this.grabPoint.y = this.coords.y - Number(transMatrix.f);
            
            // Set out target
            this.dragElement = targetElement;
            this.dragElement.setAttributeNS(null, 'pointer-events', 'none');
            
            if (targetElement.id.slice(0,2) == 'n_') {
            	// then it should be a node
            	// now get the edges that should be dragged together with the node
            	this.dragEdges = [];
            	var node_name = targetElement.id.slice(2);
            	var l, p1, p2;
            	this.dragEdges[0] = this.jsdot.getNodeByName(node_name).getEdgesIn();
            	for (var i in this.dragEdges[0]) {
            		l = $('e_'+this.dragEdges[0][i].getName()+'+text');
            		if (l) l.style.display = 'none';
            		l = $('e_'+this.dragEdges[0][i].getName()+'+line');
            		p1 = this.dragEdges[0][i].getSrc().getPos();
            		p2 = this.dragEdges[0][i].getDst().getPos();
            		this.dragEdges[0][i] = [l, 'M'+p1+'L', p2[0], p2[1]];
            	}
            	this.dragEdges[1] = this.jsdot.getNodeByName(node_name).getEdgesOut();
            	for (var i in this.dragEdges[1]) {
            		l = $('e_'+this.dragEdges[1][i].getName()+'+text');
            		if (l) l.style.display = 'none';
            		l = $('e_'+this.dragEdges[1][i].getName()+'+line');
            		p1 = this.dragEdges[1][i].getSrc().getPos();
             		p2 = this.dragEdges[1][i].getDst().getPos();
            		this.dragEdges[1][i] = [l, p1[0], p1[1], 'L'+p2];
            	}
            }
        }
    },
    
    /**
     * Drag the element throught the design area
     * @param {Object} evt
     */
    drag: function(evt){
    
        if (this.dragElement) {
            this.getCoords(evt);
            var newX = this.coords.x - this.grabPoint.x;
            var newY = this.coords.y - this.grabPoint.y;
            this.dragElement.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
            if (this.dragEdges[0]) {
            	for (var i in this.dragEdges[0]) {
            		this.dragEdges[0][i][0].setAttribute('d', this.dragEdges[0][i][1] +
            				(this.dragEdges[0][i][2] + newX) + ',' +
            				(this.dragEdges[0][i][3] + newY));
            	}
            	for (var i in this.dragEdges[1]) {
            		this.dragEdges[1][i][0].setAttribute('d', 'M' + (this.dragEdges[1][i][1] + newX) + ',' +
            				(this.dragEdges[1][i][2] + newY) +
            				this.dragEdges[1][i][3]);
            	}
            }
        }
    },
    
    /**
     * Drop the element after mouseup event
     * @param {Object} evt
     */
    drop: function(evt){
    
        if (this.dragElement != null) {
            
            // update node
            this.getCoords(evt);
            var dX = this.coords.x - this.grabPoint.x;
            var dY = this.coords.y - this.grabPoint.y;
            var node = this.jsdot.getNodeByName(this.dragElement.id.slice(2));
            var p = node.getPos();
            node.setPos(p[0]+dX, p[1]+dY);
            
            this.dragElement.setAttributeNS(null, 'pointer-events', 'all');
            this.dragElement = null;
            this.dragEdges = [];
            this.selected = null;
			
			this.jsdot.draw();
        }
    },
	
	selectObj: function(obj) {
		//alert(obj)
		if (this.current != null) {
			this.current.setAttribute('class', 'btn');
		}
		this.current = obj instanceof SVGCircleElement ? obj.parentNode: obj;
		this.current.setAttribute('class','btn_sel');
	},
    
    /** Builds the left menu, buttons and all listeners */
    buildMenu: function(){
    
        var self = this, toggle, title;
        this.toggle = false;
		
		// <-- left menu container
        this.cnt = $e('div',true);
		this.cnt.setAttrs({'id':'leftMenu' });
		// -->

		// <-- Title container
        title = $e('div',true);
		title.setAttribute('class','title');
        h3 = $e('h3',true);	
		h3.innerHTML = 'Javascript Dot';
		// -->

		// <-- toggle container
        toggle = $e('div',true);
		toggle.setAttrs({'id':'toggle' });
		toggle.addEventListener('click', function(evt){ self.toggleMenu(); }, false);
		// -->
		
        // <-- Circle button
		var circleBtn = $e("svg"), circle = $e('circle'); circleBtn.setAttribute("class","btn");
		circle.addEventListener('click', function(evt){ self.selected = 'circle'; self.selectObj(this); }, false);
		circle.setAttrs({"r": "22","cx":"25","cy":"25","stroke":"#ffa500", "fill":"#bfbfbf"});
		circleBtn.appendChild(circle);
        // -->	
		
        // <-- Edge button
		var arrowBtn = $e('svg'), path = $e('path'); arrowBtn.setAttribute("class","btn");
		path.setAttrs({'d': 'M 8.7185878,4.0337352 L -2.2072895,0.016013256 L 8.7185884,-4.0017078 C 6.9730900,-1.6296469 6.9831476,1.6157441 8.7185878,4.0337352 z','style': 'font-size:12.0;fill-rule:evenodd;stroke-width:0.62500000;stroke-linejoin:round;fill:grey'});
		path.setAttribute('transform', 'translate(10, 10) scale(4) rotate(45)');
		arrowBtn.addEventListener('click', function(evt){ self.selected = 'edge';self.selectObj(this); }, false);
		arrowBtn.setAttribute("class","btn");
		arrowBtn.appendChild(path);
		// -->

        // <-- Show JSON code button
		var stringBtn = $e("div",true); stringBtn.setAttribute("class","btn");
		stringBtn.addEventListener('click', function(){ self.popup.show_JSON();self.selectObj(this); }, false);
		stringBtn.innerHTML = "<span>JSON Code</span>";	
        // -->	

        // <-- Show SVG code button
		var svgBtn = $e("div",true); svgBtn.setAttribute("class","btn");
		svgBtn.addEventListener('click', function(){ self.popup.show_SVG();self.selectObj(this); }, false);
		svgBtn.innerHTML = "<span>SVG Code</span>";	
        // -->	
		
		// <-- Layout button
		var layoutBtn = $e("div",true); layoutBtn.setAttribute("class","btn");
		layoutBtn.addEventListener('click', function(){
				if (self.jsdot.layout && self.jsdot.layout.layout) {self.jsdot.layout.layout(); self.jsdot.draw();}
				}, false);
		layoutBtn.innerHTML = "<span>Auto Layout</span>";	
        // -->
		
		// <-- Drop down examples
		var examples = document.createElement("div"); 
		examples.setAttribute("style", "float-left:5px");
		
		var sel =  document.createElement("select");
		sel.setAttribute("name", "examples");	
		sel.setAttribute("id", "examples");
		
		for(var i = 0; i < JSDot.template.length; i++) {
			var o =  $e("option",true);
			o.setAttribute("value", JSDot.template[i][0]);
			o.appendChild(document.createTextNode(JSDot.template[i][0]));
			o.addEventListener('click', function(i){ return function(){
				self.jsdot.loadJSON(JSDot.template[i][1]);
				self.jsdot.draw();
			} }(i), false);
			sel.appendChild(o);
		}
		examples.appendChild(sel);
		// -->
		
		// <-- help button
		var stringBtn2 = $e("div",true); stringBtn2.setAttribute("class","btn");
		stringBtn2.addEventListener('click', function(){ self.popup.show_help();self.selectObj(this); }, false);
		stringBtn2.innerHTML = "<span>Help</span>";	
		// -->
	
        // <-- Copyright footer
		var footer = $e("div",true); footer.setAttribute("id","footer");
		footer.innerHTML = 'JSDot 2009 - USI Lugano<br /><a href="http://atelier.inf.usi.ch/~blondell/">Lucia Blondel</a> | <a href="http://atelier.inf.usi.ch/~giuliann/">Nicos Giuliani</a> | <a href="http://atelier.inf.usi.ch/~vaninic/">Carlo Vanini</a>';	
        // -->		
		
		this.cnt.appends([title,h3,toggle,circleBtn,arrowBtn,footer,stringBtn,svgBtn,stringBtn2,layoutBtn,examples]);
		this.container.appendChild(this.cnt);

    },
    
	/** 
	 * Toggle the left menu
	 */
	toggleMenu:function(){
		var self = this,margin,interval;
		if(this.toogle) {
			margin = self.leftMenuSize, interval = setInterval(function(){
				if(0 == margin) clearInterval(interval);
				self.svgroot.setAttrs({"width":window.innerWidth -(self.leftMenuSize - margin - 3)});
				self.cnt.setAttrs({'style':'margin-left:-'+((margin -= 5) - 10)+'px'});
			},10);
			this.toogle = false;
			return;
		}
		margin = 0, interval = setInterval(function(){
			if(self.leftMenuSize == margin) clearInterval(interval);
			self.svgroot.setAttrs({"width":window.innerWidth -(self.leftMenuSize - margin + 3)});
			self.cnt.setAttrs({'style':'margin-left:-'+((margin += 5) - 10)+'px'});
		},10);
		this.toogle = true; 
	},
	
    /**
     * Creates and append an element
     * @param {String} element
     * @param {Object} attrs
     * @param {Object} target (Optional)
     */
    Element: function(element, attrs){
  
        var el = $e(element);
        var cnt = $e('g');
        
        cnt.setAttrs(attrs);
        delete attrs.id;
        el.setAttrs(attrs);
        
        cnt.appendChild(el);
        arguments[2] ? arguments[2].appendChild(cnt) : JSVG.svgroot.appendChild(cnt);

        return cnt;
    },
	
	/**
	 * Draw an edge from a node to an other
	 * @param {Object} evt
	 */
	addEdge: function(evt) {
		
		if (evt.target instanceof SVGCircleElement) {
			
			// We got already a point, so fix the second
			if(this.pointOne && evt.target instanceof SVGCircleElement) {

				var dst = evt.currentTarget.id.slice(2);
				var e = this.jsdot.newEdge(this.src, dst);
				this.edge.parentNode.removeChild(this.edge);
				this.edge = null; this.pointOne = false;
				this.drawEdge(e);
				
			} else { // set the start point to the target position
				
				var x = evt.target.getAttribute("cx"), y = evt.target.getAttribute("cy");
				this.src = evt.currentTarget.id.slice(2);
				this.edge = $e('line'); this.edge.setAttrs({'stroke': 'black','x1': x,'y1': y,'x2': x,'y2': y});
				this.svgroot.insertBefore(this.edge, this.svgroot.firstChild);			
				this.pointOne = true;
			}
		}
	},
	
	getSVGContent: function(){
		return this.svgroot;
	}
}

