function Class(){
    return function(arguments){
        this.init(arguments);
    }
};

var JSDot = new Class();

JSDot.prototype = {

    mainWin: null,
	selected_form: null,
    
    init: function(){
        this.mainWin = document.createElement("embed");
		this.mainWin.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;";
		this.mainWin.src = "app/frame/win.svg";
        document.body.appendChild(this.mainWin);
    },
    
	 add_figure: function(form) {
		selected_form = form;
	}
};




