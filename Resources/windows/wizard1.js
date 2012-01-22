var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Create profile";
win.backgroundColor = '#FFF';

var l1 = Ti.UI.createLabel({
	top:30,
	width:160,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight: "bold" },
	text: 'Photo'
});

var p1 = Ti.UI.createImageView({
	top:50,
	width:160,
	height:160,
	backgroundColor:"#666",
})


var facebookButton = Ti.UI.createButton({
	bottom:30,
	height:40,
	width:200,
	backgroundImage:"none",
	backgroundColor:"#369",
	color: "#FFF",
	title:'Connect with Facebook'
})

win.add(l1);
win.add(p1);
win.add(facebookButton);
