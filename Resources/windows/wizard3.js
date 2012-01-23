var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Step 3";
win.backgroundColor = '#FFF';
win.backButtonTitle = 'Step 2';

var nextButton = Ti.UI.createButton({title:"Next"});
win.rightNavButton = nextButton;

var wizard4Window = Titanium.UI.createWindow({
	url: '/windows/wizard4.js',
	navGroup: win.navGroup
})

nextButton.addEventListener("click", function () {

	win.navGroup.open(wizard4Window, {animated:true});

})
