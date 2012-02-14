
(function() {
	Dope.UI.createVerifyAccountWindow = function (login, pass) {

		var win = Ti.UI.createWindow({
			title: "Account verification"
		});
		win.loginValue = login;
		win.passValue = pass;
	
		var verifyField = Ti.UI.createTextField({
			color: '#000',
			height: 44,
			left:10,
			right:10,
			hintText: "Verification code",
			font:{fontSize:16, fontWeight:"normal"},
			returnKeyType: Titanium.UI.RETURNKEY_GO,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});
		verifyField.addEventListener("return", function() {
			loginButton.fireEvent("click");
		});
		verifyField.addEventListener("change", function () {
			if (this.value.length > 0) {
				loginButton.enabled = true;
			} else {
				loginButton.enabled = false;
			}
		});
		var spinner = Ti.UI.createActivityIndicator({width:60});

		var loginButton = Ti.UI.createButton({
			title:'Sign In',
			enabled: false,
		});	

// var wizardStep1Window = Ti.UI.createWindow({
	// url: '/windows/wizard1.js',
	// navGroup: win.navGroup
// });

// Ti.App.addEventListener("startProfileWizard", function (e) {
	// win.navGroup.open(wizardStep1Window, {animated:true});
// })

		loginButton.addEventListener("click", function() {

			this.enabled = false;
			verifyField.enabled = false;
			win.rightNavButton = spinner;
			spinner.show();

			var that = this;
		 
			var xhr = Ti.Network.createHTTPClient({
			    onload: function(e) {
					var data = JSON.parse(this.responseText);
					
					win.rightNavButton = loginButton;
					verifyField.enabled = true;
			        that.enabled = true;

					// get error response from server
					if (data.status != "ok") {
					
						alert(data.errorMessage);
						verifyField.focus();
					
					} else {

						// save login info to application preferences
						Ti.App.Properties.setString("login", win.loginValue);
						Ti.App.Properties.setString("pass", win.passValue);

						Ti.include("windows/wizard1.js");

						var wizardWindow = Dope.UI.createWizardWindow();
						
						Dope.openWindow(win, wizardWindow);
					}	        
			        
			    },
			    onerror: function(e) {
			        Ti.API.debug(e.error);
			        alert("Couldn't connect to server");
			        
			        that.enabled = true;
					verifyField.enabled = true;
					win.rightNavButton = loginButton;
			    },
			    timeout: Defaults.NETWORK_TIMEOUT * 1000
			});
	
			var url = Defaults.HTTP_SERVER_NAME 
				+ Defaults.LOGIN_SCRIPT_NAME 
				+ "?verify="+ verifyField.value 
				+ "&login=" + win.loginValue
				+ "&pass=" + win.passValue;		 
				
			Ti.API.log("URL:" + url);
			xhr.open("GET", url);
			xhr.send();		
		
		});
		var tableData = [];
		
		var verifyRow = Ti.UI.createTableViewRow();
		verifyRow.add(verifyField);
		
		tableData.push(verifyRow);
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		var headerLabel = Ti.UI.createLabel({
			top: 60,
			left:20,
			right:20,
			height: 'auto',
			color: Dope.UI.tableHintColor,
			shadowColor: Dope.UI.tableHintShadowColor,
			shadowOffset: {x:0,y:1},
			font: { fontSize:16, fontWeight:"normal" },
			text: 'You will receive confirmation mail with this code in a second. Bla-bla-bla, thanks for registering.'
		});

		var headerView = Ti.UI.createView({
			height:120
		})
		
		var logo = Ti.UI.createImageView({
			backgroundColor:"#999",
			width:100,
			top:10,
			height:40,
		})
		headerView.add(headerLabel);
		headerView.add(logo);
		
		headerView.addEventListener("touchstart", function () {
			verifyField.blur();
		});
		
		table.setHeaderView(headerView);
		win.add(table);
		win.rightNavButton = loginButton;
		win.backButton
		

		win.addEventListener("open", function () {
			verifyField.value = "";
			verifyField.focus();
		});
		
		return win;
	}
})()