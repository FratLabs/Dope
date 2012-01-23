var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = 'Welcome';
win.backgroundColor = '#999';



var l1 = Ti.UI.createLabel({
	top:70,
	width:260,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight: "bold" },
	text: 'Email'
});

var l2 = Ti.UI.createLabel({
	top:130,
	width:260,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight:"bold" },
	text: 'Password'
});

var tf1 = Ti.UI.createTextField({
	color:'#369',
	height:35,
	top:90,
	width:260,
	keyboardType: Titanium.UI.KEYBOARD_EMAIL,
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var tf2 = Ti.UI.createTextField({
	color:'#369',
	height:35,
	top:150,
	width:260,
	passwordMask:true,
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

tf1.addEventListener("return", function() {
	tf2.focus();
})

tf2.addEventListener("return", function() {
	
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

var registerButton = Ti.UI.createButton({
	top:250,
	height:40,
	width:200,
	title: 'Sign Up',
	opacity:0,
	enabled: false
});	

var firstTimeButton = Ti.UI.createButton({
	top:310,
	height:40,
	width:200,
	title: "This is my first time",
	color: "#00f",
	backgroundImage: "none",
	backgroundColor: "transparent"
});

var termsButton = Ti.UI.createButton({
	title: "Terms of Use",
	right: "50%",
	bottom: 10,
	height: 30,
	width: 100,
	color: "#00f",
	backgroundColor: "transparent",
	backgroundImage: "none",
	font: {fontSize: 13},
	className: "smallButton"
})

var policyButton = Ti.UI.createButton({
	className: "smallButton",
	title: "Privacy Policy",
	left: "50%",
	bottom: 10,
	height: 30,
	width: 100,
	color: "#00f",
	backgroundColor: "transparent",
	backgroundImage: "none",
	font: {fontSize: 13},	
	className: "smallButton"	
})


termsButton.addEventListener("click", function(e) {

	var termsWindow = Titanium.UI.createWindow({
		url: '/windows/textFile.js',
		fileName: "termsofuse.txt", 
		title: this.title,
	})
	navGroup.open(termsWindow, {animated:true});
})

policyButton.addEventListener("click", function(e) {

	var policyWindow = Titanium.UI.createWindow({
		url: '/windows/textFile.js',
		fileName: "privacypolicy.txt", 
		title: this.title,
	})
	navGroup.open(policyWindow, {animated:true});
})


var a1 = Ti.UI.createAnimation()
a1.opacity = 0;
a1.duration = 500;

var a2 = Ti.UI.createAnimation();
a2.opacity = 1;
a2.duration = 500;


function checkLoginServerResponse(button, response) {
	spinner.hide();
	button.enabled = true;

	var data = JSON.parse(response.responseText);

//	Ti.API.log("CHECKLOGINSERVER\ndata status1: " + data.status + " verify1: " + data.verifyNeeded);

	// get error response from server
	if (data.status != "ok") {
	
		alert(data.errorMessage);
		tf1.focus();
	
	} else {
		
		// save login info to application preferences
		Ti.App.Properties.setString("login", tf1.value);
		Ti.App.Properties.setString("pass", Ti.Utils.md5HexDigest(tf2.value));

		// first time logged in
		if (data.verifyNeeded) {

			// need to approve registration with verification code
			var verifyWindow = Titanium.UI.createWindow({
				url: '/windows/verifyAcc.js',
				navGroup: navGroup,
			})
			navGroup.open(verifyWindow, {animated:true});


		} else {
			
			// and close dialog
			Ti.App.fireEvent("startProfileWizard");
			Ti.App.fireEvent("loggedIn");
		}
	}
	
}

loginButton.addEventListener("click", function() {
	spinner.show();
	
	this.enabled = false;
	var that = this;
 
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
			checkLoginServerResponse(that, this);
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
		+ "?login="+ tf1.value 
		+ "&pass=" + Ti.Utils.md5HexDigest(tf2.value);		 
		
	Ti.API.log("URL:" + url);
	xhr.open("GET", url);
	xhr.send();		
});

registerButton.addEventListener("click", function (e) {
	spinner.show();
	
	this.enabled = false;
	var that = this;
 
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
			checkLoginServerResponse(that, this);
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
		+ Defaults.SIGNUP_SCRIPT_NAME 
		+ "?login="+ tf1.value 
		+ "&pass=" + Ti.Utils.md5HexDigest(tf2.value);		 
		
	Ti.API.log("URL:" + url);
	xhr.open("GET", url);
	xhr.send();		
		
});

firstTimeButton.addEventListener("click", function() {
	
	if (loginButton.enabled) {
		loginButton.enabled = false;
		
		registerButton.animate(a2);
		registerButton.enabled = true;
	
		this.titleDefault = this.title;
		this.title = "Back to Sign In";
	} else {
		loginButton.enabled = true;

		registerButton.animate(a1);
		registerButton.enabled = false;

		this.title = this.titleDefault;
	}

})

win.add(tf1);
win.add(l1);

win.add(tf2);
win.add(l2);

win.add(spinner);
//spinner.show();

win.add(loginButton);
win.add(registerButton);
win.add(firstTimeButton);

win.add(policyButton);
win.add(termsButton);

if (! Ti.Network.online) {
	
	alert("Network connection required");
}
