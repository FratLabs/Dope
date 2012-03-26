
(function() {
	
	Dope.UI.createLoginWindow = function () {
	
		var win = Ti.UI.createWindow({
			title: "Dope",
//				navBarHidden: true,
		});
		
		// INTERFACE COMPONENTS 

		var loginField = Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			font:{fontSize:16, fontWeight:"normal"},
			hintText: "Email",
			keyboardType: Ti.UI.KEYBOARD_EMAIL,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});
		
		var passField = Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			font:{fontSize:16, fontWeight:"normal"},
			passwordMask:true,
			hintText: "Password",
			returnKeyType: Ti.UI.RETURNKEY_GO,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});
		
		var passConfirmField = Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			font:{fontSize:16, fontWeight:"normal"},
			passwordMask:true,
			hintText: "Confirm password",
			returnKeyType: Ti.UI.RETURNKEY_GO,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});
		
		var spinner = Ti.UI.createActivityIndicator({width:60});
		
		var loginButton = Ti.UI.createButton({
			title:'Sign In',
			enabled: false,
		});	
		
		var registerButton = Ti.UI.createButton({
			title: 'Sign Up',
			enabled: false
		});	
		
		var firstTimeButton = Ti.UI.createButton({
			bottom:50,
			height:40,
			width:200,
			title: "Register in Dope",
		});
		
		var termsButton = Ti.UI.createButton({
			title: "Terms of Use",
			right: "50%",
			bottom: 10,
			height: 30,
			width: 100,
			color: "#000",
			backgroundColor: "transparent",
			backgroundImage: "none",
			font: {fontSize: 13, fontWeight:"bold"},
			className: "smallButton"
		})
		
		var policyButton = Ti.UI.createButton({
			className: "smallButton",
			title: "Privacy Policy",
			left: "50%",
			bottom: 10,
			height: 30,
			width: 100,
			color: "#000",
			backgroundColor: "transparent",
			backgroundImage: "none",
			font: {fontSize: 13, fontWeight:"bold"},
			className: "smallButton"	
		})
		
		// UI COMPONENT EVENTS
		
		loginField.addEventListener("return", function() {
			passField.focus();
		})
		loginField.addEventListener("change", function () {
			if (this.value.length > 0 && passField.value.length > 0) {
				loginButton.enabled = true;
				if (passConfirmField.value.length) {
					registerButton.enabled = true;
				} else {
					registerButton.enabled = false;
				}
			} else {
				loginButton.enabled = false;
				registerButton.enabled = false;
			}
		})
		passField.addEventListener("return", function() {
			if (! win.loginForm) {
				passConfirmField.focus()
			} else {
				loginButton.fireEvent("click");
			}	
		});
		passField.addEventListener("change", function () {
			if (this.value.length > 0 && loginField.value.length > 0) {
				loginButton.enabled = true;
				if (passConfirmField.value.length) {
					registerButton.enabled = true;
				} else {
					registerButton.enabled = false;
				}
			} else {
				loginButton.enabled = false;
				registerButton.enabled = false;
			}
		})		
		passConfirmField.addEventListener("return", function() {
			registerButton.fireEvent("click");
		})
		passConfirmField.addEventListener("change", function () {
			if (this.value.length > 0 && loginField.value.length > 0 && passField.value.length > 0) {
				registerButton.enabled = true;
			} else {
				registerButton.enabled = false;
			}
		});
				
		Ti.include("windows/htmlFile.js");

		termsButton.addEventListener("click", function(e) {
			var termsWin = Dope.UI.createHTMLViewWindow(this.title, "termsofuse.txt");	

			Dope.openWindow(win, termsWin);		
		})
		
		policyButton.addEventListener("click", function(e) {
			var policyWin = Dope.UI.createHTMLViewWindow(this.title, "privacypolicy.txt");	

			Dope.openWindow(win, policyWin);		
		})
		
		win._checkLoginServerResponse = function(button, response) {
			button.enabled = true;
			win.rightNavButton = button;
		
			win.loginField.enabled = true;
			win.passField.enabled = true;
			win.passConfirmField.enabled = true;
	
			var data = JSON.parse(response.responseText);
		
		//	Ti.API.log("CHECKLOGINSERVER\ndata status1: " + data.status + " verify1: " + data.verifyNeeded);
		

			// get error response from server
			if (data.status != "ok") {
			
				alert(data.errorMessage);
				win.passField.value = "";
				win.passConfirmField.value = "";
	
				win.rightNavButton = button;
	
			} else {
				
				// save login info to application preferences
		
				// first time logged in
				if (data.verifyNeeded) {
					Ti.API.log("VERIFY NEEDED");
					
					Ti.include("windows/verifyAcc.js");
					
					var verifyWindow = Dope.UI.createVerifyAccountWindow(win.loginField.value, Ti.Utils.md5HexDigest(win.passField.value));

					win.rightNavButton = button;
		
					Dope.openWindow(win, verifyWindow);
										
	//				var verifyWindow = Ti.UI.createWindow({
	//					url: '/windows/verifyAcc.js',
	//					navGroup: win.navGroup,
	//				})
				
					// need to approve registration with verification code
	//				w.navGroup.open(verifyWindow, {animated:true});
				} else {
					Ti.App.Properties.setString("login", win.loginField.value);
					Ti.App.Properties.setString("pass", Ti.Utils.md5HexDigest(win.passField.value));

					Ti.API.log("loading profile data from server");
					
					Profile.getFromServer({
						success: function (xhr) {
							Ti.API.log("profile: success");
							win.rightNavButton = button;
							Dope.closeModalWindow(win);
						}, 
						error: function (xhr, e) {
							Ti.API.log("profile: error");
							win.rightNavButton = button;
							alert(e.error);		
							Dope.closeModalWindow(win);
						}			
					});
				}
			}
		
		}

		loginButton.addEventListener("click", function() {
			if (! loginField.value.length)	{
				alert("empty email field");
			} else if (! passField.value.length) {
				alert("empty password field");
			} else {
				
				win.rightNavButton = spinner;
				spinner.show();
				
				this.enabled = false;
				loginField.enabled = false;
				passField.enabled = false;
				
				var that = this;
			 
				var xhr = Ti.Network.createHTTPClient({
				    onload: function(e) {
						win._checkLoginServerResponse(that, this);
				    },
				    onerror: function(e) {
				        Ti.API.debug(e.error);
				        alert("Couldn't connect to server");
				        
				        that.enabled = true;
						loginField.enabled = true;
						passField.enabled = true;
						
				        win.rightNavButton = that;
				    },
				    timeout: Defaults.NETWORK_TIMEOUT * 1000
				});
				
				var url = Defaults.HTTP_SERVER_NAME 
					+ Defaults.LOGIN_SCRIPT_NAME 
					+ "?login="+ loginField.value 
					+ "&pass=" + Ti.Utils.md5HexDigest(passField.value);		 
					
				Ti.API.log("URL:" + url);
				xhr.open("GET", url);
				xhr.send();		
			}
		});
		
		registerButton.addEventListener("click", function (e) {
		
			if (! loginField.value.length)	{
				alert("empty email field");
			} else if (! passField.value.length) {
				alert("empty password field");
			} else if (passField.value.length < 6) {
				alert("password too short, 6 symbols at least");
			} else if (passField.value != passConfirmField.value) {
				alert ("passwords do not match");
			} else {
				win.rightNavButton = spinner;
				spinner.show();
			
				this.enabled = false;
				loginField.enabled = false;
				passField.enabled = false;
				passConfirmField.enabled = false;

				var that = this;
			 
				var xhr = Ti.Network.createHTTPClient({
				    onload: function(e) {
						win._checkLoginServerResponse(that, this);
				    },
				    onerror: function(e) {
				        Ti.API.debug(e.error);
				        alert("Couldn't connect to server");
				        
				        that.enabled = true;
						loginField.enabled = false;
						passField.enabled = false;
						passConfirmField.enabled = false;

						win.rightNavButton = that;

				    },
				    timeout: Defaults.NETWORK_TIMEOUT * 1000
				});
				
				var url = Defaults.HTTP_SERVER_NAME 
					+ Defaults.SIGNUP_SCRIPT_NAME 
					+ "?login="+ loginField.value 
					+ "&pass=" + Ti.Utils.md5HexDigest(passField.value);		 
					
				Ti.API.log("URL:" + url);
				xhr.open("GET", url);
				xhr.send();		
			}		
		});
		win.loginForm = true;
		
		firstTimeButton.addEventListener("click", function() {
			
			if (win.loginForm) {
				win.loginForm = false;
				win.rightNavButton = registerButton;
				table.appendRow(passConfirmRow, {animated: true});
				passField.returnKeyType = Ti.UI.RETURNKEY_NEXT;
		
			
				this.titleDefault = this.title;
				this.title = "Back to Sign In";
			} else {
				win.loginForm = true;
				win.rightNavButton = loginButton;
				passField.returnKeyType = Ti.UI.RETURNKEY_GO;

				table.deleteRow(2, {animated:true});

				this.title = this.titleDefault;
			}
		});
		
		var tableData = [];
		
		var loginRow = Ti.UI.createTableViewRow();
		loginRow.add(loginField);
		
		var passRow = Ti.UI.createTableViewRow();
		passRow.add(passField);
		
		var passConfirmRow = Ti.UI.createTableViewRow();
		passConfirmRow.add(passConfirmField);
					
		tableData.push(loginRow);
		tableData.push(passRow);	
					
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		
		var headerView = Ti.UI.createView({
			height:50
		})
		var logo = Ti.UI.createImageView({
			backgroundColor:"#999",
			width:100,
			top:10,
			height:40,
		})
		headerView.add(logo);
		
		headerView.addEventListener("touchstart", function () {
			loginField.blur();
			passField.blur();
			passConfirmField.blur();
		});

		var footerView = Ti.UI.createView({
			height:100
		})
		footerView.add(firstTimeButton);

		footerView.addEventListener("touchstart", function () {
			loginField.blur();
			passField.blur();
			passConfirmField.blur();
		});


		table.setHeaderView(headerView);
		table.setFooterView(footerView);
		
		
		// BUILDING UI

		win.add(table);		


		win.rightNavButton = loginButton;
		
		win.add(firstTimeButton);
		
		win.add(policyButton);
		win.add(termsButton);

		win.loginField = loginField;
		win.passField = passField;
		win.passConfirmField = passConfirmField;
			
		var loginWindow = Dope.UI.createNavigationGroupStack(win, {modal:true});

		Dope.UI.loginWindow = loginWindow;
		
		return loginWindow;

	}

})()







