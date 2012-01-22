var Defaults = require("defines");

var win = Ti.UI.currentWindow;

var scrollView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    top:0,
    backgroundColor:"#FFF",
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:false
});



var termsFile = Titanium.Filesystem.getFile(win.fileName);
var termsBlob = termsFile.read();
var termsString = termsBlob.toString();

var textArea = Titanium.UI.createLabel({
	top:10,
	left:10,
	right:10,
	height:"auto",
	textAlign:"left",
	font: {fontSize:13},
	text: termsString
})
Titanium.API.log("textAreaHeight: " + textArea.height);
scrollView.add(textArea);
win.add(scrollView);
