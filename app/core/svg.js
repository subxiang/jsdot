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
var JSVG = new Class();

JSVG.prototype = {

    designArea: null,
    coords: null,
    selected: null,
    popup: null,
	leftMenuSize:220,
    
    defaultCircle: 'this.Element(\'circle\', { "r": "2.5em", "cx": evt.clientX-220, "cy": evt.clientY, "fill": "#ddd", "stroke": "#000" })',
	defaultLine: 'this.Element(\'line\', { "x1": evt.clientX, "y1": evt.clientX,  "x2": evt.clientX + 5, "y2": evt.clientY + 5, "style": "fill:none;stroke:black;stroke-width:1;"})',
    
    /** Constructor */
    init: function(jsdot, id){

		this.jsdot = jsdot;
		
        this.container = $(id);
        this.svgdoc = this.container.ownerDocument;
        this.svgroot = $e("svg");
		JSVG.svgroot = this.svgroot;
        this.container.appendChild(this.svgroot);
        this.container.style.position = "relative";
        this.popup = new Popup(this.jsdot, this.container, 'popup');
        
        this.svgroot.setAttrs({
            "width": window.innerWidth - this.leftMenuSize,
            "id": "svgroot",
			"style": "position:absolute;top:0;right:0;background:#ddd;padding:0;margin:0;",
            "xmlns": svgns,
            "xmlns:xlink": xlinkns
        });
        
        this.coords = this.svgroot.createSVGPoint();
        this.grabPoint = this.svgroot.createSVGPoint();
        
        this.buildMenu();
		var self = this;

        
        // Drag and drop listeners
        this.svgroot.addEventListener('mousemove', function(evt){
            self.drag(evt);
        }, false);
        this.svgroot.addEventListener('mouseup', function(evt){
            self.drop(evt);
        }, false);
        // Add elements listener
        this.svgroot.addEventListener('click', function(evt){
            self.drawElement(evt);
        }, false);
        
    },
    
    /**
     * Draw an element depending on the selected form
     * @param {Object} evt
     */
    drawElement: function(evt){
    
        var self = this, element;
        
        if (this.selected != null) {

            element = eval('new ' + this.selected);
            element.addEventListener('mousedown', function(evt){
            
                if (self.selected == 'text') {
					var text = prompt('Insert the label');
					if (text) {
						var e = $e('text');
						e.setAttrs({"x":this.getX() - this.getWidth(),"y":this.getY()});
						e.textContent = text;
						this.appendChild(e);
					}
				} else {
					self.grab(evt);
				}
            }, false);
        } 
    },
    
    /**
     * Drag the element throught the design area
     * @param {Object} evt
     */
    drag: function(evt){
    
        if (this.dragElement) {
            this.getCoords(evt);
            this.dragElement.setAttributeNS(null, 'transform', 'translate(' + (this.coords.x - this.grabPoint.x) + ',' + (this.coords.y - this.grabPoint.y) + ')');
        }
    },
    
    /**
     * Drop the element after mouseup event
     * @param {Object} evt
     */
    drop: function(evt){
    
        if (this.dragElement != null) {
        
            // Set the selected style
            this.selected.setAttrs( {
                "fill-opacity": 1
            });
            this.dragElement.setAttributeNS(null, 'pointer-events', 'all');
            this.dragElement = null;
            this.selected = null;
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
     * Set the element to be dragged.
     * @param {Object} evt
     */
    grab: function(evt){
    
        var targetElement = evt.currentTarget;
        
        if (this.designArea != targetElement) {
        
            this.selected = targetElement;
            targetElement.setAttrs( {
                "fill-opacity": 0.5
            });
            
            // Calculates the element's coords
            var transMatrix = targetElement.getCTM();
            this.getCoords(evt);
            this.grabPoint.x = this.coords.x - Number(transMatrix.e) + this.leftMenuSize;
			this.grabPoint.y = this.coords.y - Number(transMatrix.f);
            
            // Set out target
            this.dragElement = targetElement;
            this.dragElement.setAttributeNS(null, 'pointer-events', 'none');
            
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
        }
    },
    
    /**
     * Drop the element after mouseup event
     * @param {Object} evt
     */
    drop: function(evt){
    
        if (this.dragElement != null) {
        
            // Set the selected style
            this.selected.setAttrs( {
                "fill-opacity": 1
            });
            this.dragElement.setAttributeNS(null, 'pointer-events', 'all');
            this.dragElement = null;
            this.selected = null;
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
    
    /** Builds the left menu, buttons and all listeners */
    buildMenu: function(){
    
        var self = this, toggle;
        this.toggle = false;
		
		// <-- left menu container
        this.cnt = $e('div',true);
		this.cnt.setAttrs({'id':'leftMenu' });
		// -->

		// <-- toggle container
        toggle = $e('div',true);
		toggle.setAttrs({'id':'toggle' });
		toggle.addEventListener('click', function(evt){ self.toggleMenu(); }, false);
		// -->
		
        // <-- Rectangle button
		var rectBtn = $e("svg"), rect = $e('circle'); rectBtn.setAttribute("class","btn");
		rect.addEventListener('click', function(evt){ self.selected = self.defaultCircle; }, false);
		rect.setAttrs({"r": "24","cx":"25","cy":"25"});
		rectBtn.appendChild(rect);
        // -->	
	
        // <-- Arrow button
		var arrowBtn = $e("svg"), arrow = $e('line'); arrowBtn.setAttribute("class","btn");
		arrow.addEventListener('click', function(evt){ self.selected = self.defaultCircle; }, false);
		arrow.setAttrs({"x1": "0", "y1": "0", "x2": "5em", "y2": "5em","stroke":"yellow"});
		arrowBtn.appendChild(arrow);		
        // -->	

        // <-- Insert string button
		var stringBtn = $e("div",true); stringBtn.setAttribute("class","btn");
		stringBtn.addEventListener('click', function(){ self.popup.show_JSON(); }, false);
		stringBtn.innerHTML = "Insert JSON";	
        // -->	
	
        // <-- Copyright footer
		var footer = $e("div",true); footer.setAttribute("id","footer");
		footer.innerHTML = 'JSDot 2009 - USI Lugano<br /><a href="#">Lucia Blondel</a> | <a href="#">Nicos Giuliani</a> | <a href="#">Carlo Vanini</a>';	
        // -->		
		
		this.cnt.appends([toggle,rectBtn,arrowBtn,footer,stringBtn])
		this.container.appendChild(this.cnt);

    },
    
	toggleMenu:function(){
		
		if(this.toogle) {
			setAttrs(this.svgroot,{"width":window.innerWidth - 200});
			setAttrs(this.cnt,{'style': "margin-left:0"});
			this.toogle = false;
			return;
		}
		setAttrs(this.svgroot,{"width":window.innerWidth - 3});
		setAttrs(this.cnt,{'style':'margin-left:-215px'});
		this.toogle = true;
	},
	
    /**
     * Creates and append an element
     * @param {String} element
     * @param {Object} attrs
     * @param {Object} target (Optional)
     */
    Element: function(element, attrs){

		Element.prototype.getX = function(){
			for (i in attrs){
				if(i.indexOf('x') != -1) return attrs[i];
			}
		}

		Element.prototype.getY = function(){
			for (i in attrs){
				if(i.indexOf('y') != -1) return attrs[i];
			}
		}
		Element.prototype.getWidth = function(){
			for (i in attrs){
				if(i.indexOf('width') != -1) return parseInt(attrs[i]);
				if(i.indexOf('r') != -1) return parseInt(attrs[i]);
			}
		}    
        var el = $e(element);
        var cnt = $e('g');
        
        setAttrs(cnt, attrs);
        delete attrs.id;
        setAttrs(el, attrs);
        
        cnt.appendChild(el);
        arguments[2] ? arguments[2].appendChild(cnt) : JSVG.svgroot.appendChild(cnt);

        return cnt;
    }

}
