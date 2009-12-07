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

    root: null,
    designArea: null,
    coords: null,
    selected: null,
    popup: null,
    
    defaultCircle: 'this.Element(\'circle\', { "r": "2.5em", "cx": evt.clientX, "cy": evt.clientY, "fill": "#ddd", "stroke": "#000" })',
    defaultRect: 'this.Element(\'rect\', { "height": "5em", "width": "5em", "x": evt.clientX, "y": evt.clientY, "fill": "#ff0000" })',
    defaultLine: 'this.Element(\'line\', { "x1": evt.clientX, "y1": evt.clientX,  "x2": evt.clientX + 5, "y2": evt.clientY + 5, "style": "fill:none;stroke:black;stroke-width:1;"})',
    
    /** Constructor */
    init: function(jsdot, id){
    
		this.jsdot = jsdot;
		
        this.container = $(id);
        this.svgdoc = this.container.ownerDocument;
        this.svgroot = this.svgdoc.createElementNS(svgns, "svg");
        this.container.appendChild(this.svgroot);
        
        this.popup = new Popup(this.jsdot, this.container, 'popup');
        
        setAttrs(this.svgroot, {
            "width": window.innerWidth - 5,
            "height": window.innerHeight - 5,
            "id": "svgroot",
            "xmlns": svgns,
            "xmlns:xlink": xlinkns
        });
        
        this.root = this.svgroot;
        JSVG.root = this.root;
        
        this.coords = this.root.createSVGPoint();
        this.grabPoint = this.root.createSVGPoint();
        
        this.buildMenu();
        this.buildDesignArea();
        
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
						setAttrs(e,{"x":this.getX() - this.getWidth(),"y":this.getY()});
						e.textContent = text;
						this.appendChild(e);
					}
				} else {
					self.grab(evt);
				}
                
            }, false);
        } 
    },
    
    /** Builds the design area and adds event listeners. */
    buildDesignArea: function(){
    
        var self = this;
        
        this.designArea = new this.Element('rect', {
            "height": "100%",
            "width": "85%",
            "x": "15%",
            "y": 0,
            "fill": "#eee",
            "id": "designArea"
        });
        
        // Drag and drop listeners
        this.designArea.addEventListener('mousemove', function(evt){
            self.drag(evt);
        }, false);
        this.designArea.addEventListener('mouseup', function(evt){
            self.drop(evt);
        }, false);
        
        // Add elements listener
        this.designArea.addEventListener('click', function(evt){
            self.drawElement(evt);
        }, false);
        
    },
    
    /**
     * Set the element to be dragged.
     * @param {Object} evt
     */
    grab: function(evt){
    
        var targetElement = evt.target;
        
        if (this.designArea != targetElement) {
        
            this.selected = targetElement;
            setAttrs(targetElement, {
                "fill-opacity": 0.5
            });
            
            // Calculates the element's coords
            var transMatrix = targetElement.getCTM();
            this.getCoords(evt);
            this.grabPoint.x = this.coords.x - Number(transMatrix.e);
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
            setAttrs(this.selected, {
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
    
        var scale = this.root.currentScale, translation = this.root.currentTranslate;
        this.coords.x = (evt.clientX - translation.x) / scale;
        this.coords.y = (evt.clientY - translation.y) / scale;
    },
    
    /** Builds the left menu, buttons and all listeners */
    buildMenu: function(evt){
    
        var self = this;
        
        this.designArea = new this.Element('rect', {
            "height": "100%",
            "width": "85%",
            "x": "15%",
            "y": 0,
            "fill": "#eee",
            "id": "designArea"
        });
        
        // Drag and drop listeners
        this.designArea.addEventListener('mousemove', function(evt){
            self.drag(evt);
        }, false);
        this.designArea.addEventListener('mouseup', function(evt){
            self.drop(evt);
        }, false);
        
        // Add elements listener
        this.designArea.addEventListener('click', function(evt){
            self.drawElement(evt);
        }, false);
        
    },
    
    /**
     * Set the element to be dragged.
     * @param {Object} evt
     */
    grab: function(evt){
    
        var targetElement = evt.target;
        
        if (this.designArea != targetElement) {
        
            this.selected = targetElement;
            setAttrs(targetElement, {
                "fill-opacity": 0.5
            });
            
            // Calculates the element's coords
            var transMatrix = targetElement.getCTM();
            this.getCoords(evt);
            this.grabPoint.x = this.coords.x - Number(transMatrix.e);
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
            setAttrs(this.selected, {
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
    
        var scale = this.root.currentScale, translation = this.root.currentTranslate;
        this.coords.x = (evt.clientX - translation.x) / scale;
        this.coords.y = (evt.clientY - translation.y) / scale;
    },
    
    /** Builds the left menu, buttons and all listeners */
    buildMenu: function(){
    
        var self = this;
        this.toggle = false;
        this.cnt;
        this.cnt = new this.Element('g', {
            'id': 'leftMenu',
            'width': '20%',
            'height': '100%'
        });
        this.bg = new this.Element('rect', {
            "height": "100%",
            "width": "15%",
            "x": 0,
            "y": 0,
            "fill": "#333"
        }, this.cnt);
        
        // <-- Rectangle button
        new this.Element('rect', {
        
            "height": "5em",
            "width": "5em",
            "x": ".5em",
            "y": ".5em",
            'stroke': 'red',
            "fill": "#ddd",
            "style": "cursor:pointer"
        
        }, this.cnt).addEventListener('click', function(evt){
            setAttrs(this, {
                "stroke": "yellow"
            });
            self.selected = self.defaultRect;
        }, false);
        // -->
        
        // <-- Circle button
        new this.Element('circle', {
        
            "r": "2.5em",
            "cx": "9.5em",
            "cy": "3em",
            "fill": "#ddd",
            "fill-opacity": 0.85,
            "stroke": "red",
            "stroke-opacity": 0.85,
            "style": "cursor:pointer"
        
        }, this.cnt).addEventListener('click', function(evt){
            setAttrs(this, {
                "stroke": "yellow"
            });
            self.selected = self.defaultCircle;
        }, false);
        // -->
        
        // <-- Arrow button
        new this.Element('line', {
        
            "x1": ".5em",
            "y1": "8em",
            "x2": "5em",
            "y2": "12em",
            "style": "fill:none;stroke:red;fill:#ddd;stroke-width:.2em;cursor:pointer;"
        
        
        }, this.cnt).addEventListener('click', function(evt){
            setAttrs(this,{'x':'-15%'})
        }, false);
        // -->
        
        // <-- Popup button
        var popup = new this.Element('rect', {
            "height": "2em",
            "width": "8em",
            "x": ".5em",
            "y": "14em",
            'stroke': 'red',
            "fill": "white",
            "style": "cursor:pointer",
            "id": "t"
        }, this.cnt).addEventListener('click', function(){
            self.popup.show();
        }, false);
        // -->
        
        // not so nice
        var text = document.createElementNS(svgns, "text");
        setAttrs(text, {
            'x': '.6em',
            'y': '15.5em',
            'stroke': 'black'
        });
        text.textContent = 'Insert JSON string';
        $("t").appendChild(text);
        
        
        // <-- Label button
        var insertLabel = document.createElementNS(svgns, "text");
        setAttrs(insertLabel, {
            'x': '8em',
            'y': '10.5em',
            'stroke': 'black'
        });
        insertLabel.textContent = 'Insert HTML';
        this.cnt.appendChild(insertLabel);
        insertLabel.addEventListener('click', function(){
            self.selected = 'text'
        }, false);
        
        // --> Toggle menu bar
        new this.Element('rect', {
        
            "height": "100%",
            "width": ".3%",
            "x": "14.7%",
            "y": 0,
            "fill": "#222",
            "id": "toggle",
            "style": "cursor:pointer"
        
        }, this.cnt).addEventListener('click', function(){
            setAttrs(self.cnt, {
                'x': '-15%'
            });
        }, false);
        // <--
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
        
        arguments[2] ? arguments[2].appendChild(cnt) : JSVG.root.appendChild(cnt);
        cnt.appendChild(el);
        
        return cnt;
    },

	
    drawEdge: function(Edge){
    
    },
    
    drawNode: function(Node){
    
    }
}
