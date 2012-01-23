var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Step 2";
win.backgroundColor = '#FFF';
win.backButtonTitle = 'Step 1';

var nextButton = Ti.UI.createButton({title:"Next"});
win.rightNavButton = nextButton;

var wizard3Window = Titanium.UI.createWindow({
	url: '/windows/wizard3.js',
	navGroup: win.navGroup
})

nextButton.addEventListener("click", function () {
	win.navGroup.open(wizard3Window, {animated:true});

})
