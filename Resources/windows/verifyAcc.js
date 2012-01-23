var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Account verification";
win.backgroundColor = '#999';


var l3 = Ti.UI.createLabel({
	top: 80,
	width: 260,
	height: 'auto',
	color: '#666',
	font: { fontSize:15, fontWeight:"bold" },
	text: 'Verification code'
});

var tf3 = Ti.UI.createTextField({
	color: '#369',
	height: 35,
	top: 100,
	width: 260,
	textAlign: "center",
	font: {fontSize:20},
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var spinner = Ti.UI.createActivityIndicator({
	center: {y:240},
	width:30,
	height:30,
	style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

var loginButton = Ti.UI.createButton({
	top:270,
	height:40,
	width:200,
	title:'Sign In'
});	

var wizardStep1Window = Ti.UI.createWindow({
	url: '/windows/wizard1.js',
	navGroup: win.navGroup
});

Ti.App.addEventListener("startProfileWizard", function (e) {
	win.navGroup.open(wizardStep1Window, {animated:true});
})

loginButton.addEventListener("click", function() {
	
	spinner.show();
	
	this.enabled = false;
	var that = this;
 
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
			var data = JSON.parse(this.responseText);
			
			// get error response from server
			if (data.status != "ok") {
			
				alert(data.errorMessage);
				tf3.focus();
			
			} else {
				
				// save login info to application preferences
				
				// and close dialog
				tf3.value = "";
				Ti.App.fireEvent("startProfileWizard");
			}	        
	        spinner.hide();
	        that.enabled = true;
	        
	    },
	    onerror: function(e) {
	        Ti.API.debug(e.error);
	        alert("Couldn't connect to server");
	        
	        that.enabled = true;
	        spinner.hide();
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 1000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.LOGIN_SCRIPT_NAME 
		+ "?verify="+ tf3.value 
		+ "&login=" + Ti.App.Properties.getString("login")
		+ "&pass=" + Ti.App.Properties.getString("pass");		 
		
	Ti.API.log("URL:" + url);
	xhr.open("GET", url);
	xhr.send();		

});

win.add(tf3);
win.add(l3);

win.add(spinner);
win.add(loginButton);

win.addEventListener("open", function () {
	tf3.value = "";
});