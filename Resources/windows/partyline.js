var Defaults = 	require("defines");
var Profile = 	require("lib/profile");

var win = Ti.UI.currentWindow;

win.title = "Partyline";
win.backgroundColor = '#FFF';

Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.DEFAULT;

//Ti.API.log("partyline Tab Loaded");
var profileButton = Ti.UI.createButton({title:'Profile'});
win.rightNavButton = profileButton;

var spotButton = Ti.UI.createButton({title:"Spotted"});
win.leftNavButton = spotButton;

var profileWindow = Ti.UI.createWindow({
	navBarHidden: true,
	modal : true,
	modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
});
var profileGeneralWindow = Ti.UI.createWindow({
	url: '/windows/profile.js',
})
var profileNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
   window: profileGeneralWindow,
   parent: profileWindow,
});

var profileSpinner = Ti.UI.createActivityIndicator({width:60});

profileGeneralWindow.navGroup = profileNavigationGroup;
profileWindow.add(profileNavigationGroup);

var tableData = [];

var section1 = Ti.UI.createTableViewSection();
section1.setHeaderTitle("What's Hot");

var hotData = [
	{"img":"/images/user.png", "title":"Patterno Library"},
	{"img":"/images/user.png", "title":"Jumbo Cafe"}
];
for (var i = 0; i < hotData.length; i++) {
	var row = Ti.UI.createTableViewRow({
		title: hotData[i].title,
//		leftImage: hotData[i].img
	});
	section1.add(row);
}
var section2 = Ti.UI.createTableViewSection();
section2.setHeaderTitle("Gossip");

var gossipData = [
	{"img":"/images/user.png", "title":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"},
	{"img":"/images/user.png", "title":"Maecenas porttitor nisi eu turpis fringilla rutrum"},
	{"img":"/images/user.png", "title":"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cura"},
	{"img":"/images/user.png", "title":"Fusce commodo ligula a leo egestas et pharetra tellus pretium"},
	{"img":"/images/user.png", "title":"Praesent ullamcorper eleifend elit, sit amet mollis tellus venenatis eu"},
	{"img":"/images/user.png", "title":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"},
	{"img":"/images/user.png", "title":"Maecenas porttitor nisi eu turpis fringilla rutrum"},
	{"img":"/images/user.png", "title":"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cura"},
	{"img":"/images/user.png", "title":"Fusce commodo ligula a leo egestas et pharetra tellus pretium"},
	{"img":"/images/user.png", "title":"Praesent ullamcorper eleifend elit, sit amet mollis tellus venenatis eu"}
];
var gossipDataMore = true;
var gossipDataOffset = 0;
for (var i = 0; i < gossipData.length && i < Defaults.MAX_GOSSIP_LINES; i++) {
	var row = Ti.UI.createTableViewRow({
		title: gossipData[i].title,
		leftImage: gossipData[i].img,
//		height:44
	});
	section2.add(row);
}

if (gossipDataMore) {
	var moreGossipRow = Ti.UI.createTableViewRow();
	var moreGossipButton = Ti.UI.createLabel({
		width:"100%",
		height:44,
		font: {fontSize:16, fontWeight: "bold"},
		text: "More...",
		textAlign: "center"
	})
	var moreGossipActivity = Ti.UI.createActivityIndicator({right:20})
	var moreGossipView = Ti.UI.createView({
		width:"100%",
		height:44
	});
	moreGossipView.indicator = moreGossipActivity;
	moreGossipView.add(moreGossipActivity);
	moreGossipView.add(moreGossipButton);
	
	moreGossipRow.add(moreGossipView);
	moreGossipRow.className = "moreGossip";
	section2.add(moreGossipRow);
}

tableData.push(section1);
tableData.push(section2);

var table = Titanium.UI.createTableView({
	data: tableData,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});


// GLOBAL EVENT HANDLERS

profileButton.addEventListener("click", function (e) {
	var profileData = Profile.get();
	if (profileData.empty) {
		
		win.rightNavButton = profileSpinner;
		profileSpinner.show();
		
		Profile.getFromServer({
			success: function (xhr) {
				win.rightNavButton = profileButton;		
				Ti.API.log("profile: success");
				profileWindow.open();
			}, 
			error: function (xhr, e) {
				Ti.API.log("profile: error");
				win.rightNavButton = profileButton;
				alert(e.error);		
			}			
		});
	} else {
		profileWindow.open();
	}
})

//BUILDING UI

win.add(table);
