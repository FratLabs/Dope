var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = 'Welcome';
win.backgroundColor = '#999';

// PRIVATE FUNCTIONS

function checkLoginServerResponse(button, response) {
	spinner.hide();
	button.enabled = true;

	var data = JSON.parse(response.responseText);

//	Ti.API.log("CHECKLOGINSERVER\ndata status1: " + data.status + " verify1: " + data.verifyNeeded);

	// get error response from server
	if (data.status != "ok") {
	
		alert(data.errorMessage);
		tf1.blur();
		tf2.blur();
		tf3.blur();
	
	} else {
		
		// save login info to application preferences
		Ti.App.Properties.setString("login", tf1.value);
		Ti.App.Properties.setString("pass", Ti.Utils.md5HexDigest(tf2.value));

//		tf1.value = "";
		tf2.value = "";
		tf3.value = "";

		// first time logged in
		if (data.verifyNeeded) {
			// need to approve registration with verification code
			navGroup.open(verifyWindow, {animated:true});
		} else {
			
			// and close dialog
//			Ti.App.fireEvent("startProfileWizard");
			Ti.App.fireEvent("loggedIn");
		}
	}
	
}

// INTERFACE COMPONENTS 

var l1 = Ti.UI.createLabel({
	top:20,
	width:260,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight: "bold" },
	text: 'Email'
});

var l2 = Ti.UI.createLabel({
	top:80,
	width:260,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight:"bold" },
	text: 'Password'
});

var l3 = Ti.UI.createLabel({
	top:140,
	width:260,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight:"bold" },
	text: 'Confirm password'
});

var tf1 = Ti.UI.createTextField({
	color:'#369',
	height:35,
	top:40,
	width:260,
	keyboardType: Ti.UI.KEYBOARD_EMAIL,
	returnKeyType: Ti.UI.RETURNKEY_NEXT,
	autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var tf2 = Ti.UI.createTextField({
	color:'#369',
	height:35,
	top:100,
	width:260,
	passwordMask:true,
	returnKeyType: Ti.UI.RETURNKEY_NEXT,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var tf3 = Ti.UI.createTextField({
	color:'#369',
	height:35,
	top:160,
	width:260,
	passwordMask:true,
	returnKeyType: Ti.UI.RETURNKEY_NEXT,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var spinner = Ti.UI.createActivityIndicator({
	center: {y:250},
	width:30,
	height:30,
	style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
});

var loginButton = Ti.UI.createButton({
	top:270,
	height:40,
	width:200,
	title:'Sign In'
});	

var registerButton = Ti.UI.createButton({
	top:270,
	height:40,
	width:200,
	title: 'Sign Up',
	opacity:0,
	enabled: false
});	

var firstTimeButton = Ti.UI.createButton({
	top:320,
	height:40,
	width:200,
	title: "Sign Up",
	color: "#369",
	backgroundImage: "none",
	backgroundColor: "transparent"
});

var termsButton = Ti.UI.createButton({
	title: "Terms of Use",
	right: "50%",
	bottom: 10,
	height: 30,
	width: 100,
	color: "#369",
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
	color: "#369",
	backgroundColor: "transparent",
	backgroundImage: "none",
	font: {fontSize: 13},	
	className: "smallButton"	
})

var termsWindow = Ti.UI.createWindow({
	url: '/windows/textFile.js',
	fileName: "termsofuse.txt",
	backgroundColor:"#FFF", 
	title: termsButton.title,
})

var policyWindow = Ti.UI.createWindow({
	url: '/windows/textFile.js',
	fileName: "privacypolicy.txt", 
	backgroundColor:"#FFF", 
	title: policyButton.title,
})

var verifyWindow = Ti.UI.createWindow({
	url: '/windows/verifyAcc.js',
	navGroup: win.navGroup,
})

// INTERFACE ANIMATIONS

var a1 = Ti.UI.createAnimation()
a1.opacity = 0;
a1.duration = 500;

var a2 = Ti.UI.createAnimation();
a2.opacity = 1;
a2.duration = 500;


// UI COMPONENT EVENTS

tf1.addEventListener("return", function() {
	tf2.focus();
})

tf2.addEventListener("return", function() {
	if (tf3.enabled) {
		tf3.focus()
	} else {
		loginButton.fireEvent("click");
	}	
});

termsButton.addEventListener("click", function(e) {
	navGroup.open(termsWindow, {animated:true});
})

policyButton.addEventListener("click", function(e) {
	navGroup.open(policyWindow, {animated:true});
})

loginButton.addEventListener("click", function() {
	if (! tf1.value.length)	{
		alert("empty email field");
	} else if (! tf2.value.length) {
		alert("empty password field");
	} else {
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
	}
});

registerButton.addEventListener("click", function (e) {

	if (! tf1.value.length)	{
		alert("empty email field");
	} else if (! tf2.value.length) {
		alert("empty password field");
	} else if (tf2.value.length < 6) {
		alert("password too short, 6 symbols at least");
	} else if (tf3.value != tf2.value) {
		alert ("passwords do not match");
	} else {
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
	}		
});

firstTimeButton.addEventListener("click", function() {
	
	if (loginButton.enabled) {
		loginButton.enabled = false;
		
		registerButton.animate(a2);
		registerButton.enabled = true;
		tf3.animate(a2);
		l3.animate(a2);
		tf3.enabled = true;
	
		this.titleDefault = this.title;
		this.title = "Back to Sign In";
	} else {
		loginButton.enabled = true;

		registerButton.animate(a1);
		registerButton.enabled = false;
		tf3.animate(a1);
		l3.animate(a1);
		tf3.enabled = false;

		this.title = this.titleDefault;
	}
});

win.addEventListener("open", function () {
	Ti.API.log("login window open event")
	spinner.hide();
});
win.addEventListener("focus", function () {
	Ti.API.log("login window focus event")
})

// BUILDING UI

win.add(tf1);
win.add(l1);

win.add(tf2);
win.add(l2);

tf3.enabled = false;
tf3.opacity = 0;
l3.opacity  = 0;

win.add(tf3);
win.add(l3);

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
