var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Account verification";
win.backgroundColor = '#999';


var l3 = Ti.UI.createLabel({
	top: 130,
	width: 260,
	height: 'auto',
	color: '#666',
	font: { fontSize:15, fontWeight:"bold" },
	text: 'Verification code'
});

var tf3 = Ti.UI.createTextField({
	color: '#369',
	height: 35,
	top: 150,
	width: 260,
	textAlign: "center",
	font: {fontSize:20},
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var spinner = Ti.UI.createActivityIndicator({
	center: {y:220},
	width:30,
	height:30,
	style: Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

var loginButton = Ti.UI.createButton({
	top:250,
	height:40,
	width:200,
	title:'Sign In'
});	

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
				Ti.API.log("firing global event");
				Ti.App.fireEvent("loggedIn");
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

