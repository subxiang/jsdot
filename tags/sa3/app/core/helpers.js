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


var svgns = "http://www.w3.org/2000/svg";
var xlinkns = "http://www.w3.org/1999/xlink";	
var xmlns = "http://www.w3.org/2000/svg";
var xlink = "http://www.w3.org/1999/xlink";

Number.prototype.NaN0 = function(){return isNaN(this)?0:this;}
// Extends Element --> 
Element.prototype.appends = function(array) { for(i in array){ this.appendChild(array[i]); }};
Element.prototype.setAttrs = function(attrs) { for (i in attrs) { this.setAttribute(i, attrs[i]); }};
Element.prototype.size = function(){ var e = this.style; return { width: parseInt(e.borderLeftWidth || 0) + parseInt(e.borderRightWidth || 0) + this.offsetWidth,height: parseInt(e.borderTopWidth || 0) + parseInt(e.borderBottomWidth || 0) + this.offsetHeight }};
Element.prototype.getPos = function(){
    var left = 0,top = 0, e = this.offsetParent;
    while (e.offsetParent) {
        left += this.offsetLeft + (this.currentStyle ? (parseInt(this.currentStyle.borderLeftWidth)).NaN0() : 0);
        top += this.offsetTop + (this.currentStyle ? (parseInt(this.currentStyle.borderTopWidth)).NaN0() : 0);
		e = this.offsetParent
    }
    left += this.offsetLeft + (this.currentStyle ? (parseInt(this.currentStyle.borderLeftWidth)).NaN0() : 0);
    top += this.offsetTop + (this.currentStyle ? (parseInt(this.currentStyle.borderTopWidth)).NaN0() : 0);
    return { x: left, y: top }
}
// <--
function $e(i){ if(arguments[1]) return document.createElement(i); return document.createElementNS(svgns, i);};
function $(i) { return document.getElementById(i); };
function Class(){ return function(arguments){ this.init(arguments); } }
function randColor(){ return "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"; }
function counter(object) {var size = 0; var key; for(key in object) { size++; } return size;}