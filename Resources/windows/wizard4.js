var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Step 4";
win.backgroundColor = '#FFF';
win.backButtonTitle = 'Step 3';

var nextButton = Ti.UI.createButton({title:"Finish"});
win.rightNavButton = nextButton;

nextButton.addEventListener("click", function () {
	win.navGroup.parent.close({animated:false});
});
