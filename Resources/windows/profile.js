var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Profile";
win.backgroundColor = '#FFF';


var editButton =  Ti.UI.createButton({title: "Edit"});
var closeButton = Ti.UI.createButton({title:"Close"});

win.leftNavButton =  editButton;
win.rightNavButton = closeButton;

closeButton.addEventListener("click", function (e) {
	win.close();
	
})

