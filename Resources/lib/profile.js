var Defaults = require("defines");
var Funcs = require("lib/commonFuncs");

Titanium.include('/lib/com.obscure.couchdb_client.js'); 
couchdb_client.urlPrefix = "http://192.168.1.103:5984";

var DB = couchdb_client;

exports.data = {};

exports.save = function() {
	Ti.App.Properties.setString("profileData", JSON.stringify(exports.data));		
	// send it to server
}

exports.get = function() {
	
	if (Ti.App.Properties.hasProperty("profileData") && 
		Ti.App.Properties.getString("profileData").length) {
			
		Ti.API.log("serialized profile string " + Ti.App.Properties.getString("profileData"));
		exports.data = JSON.parse(Ti.App.Properties.getString("profileData"));
	} else {
		exports.data = {empty:true};
	}
		
	return exports.data;	
}
exports.getFromServer = function(options) {
	DB.info({
    	success: function(data) {
     	   Ti.API.log(data);
	    }	
	});
	DB.allDbs({
    	success: function(data) {
     	   Ti.API.log(data);
	    }	
	});
	setTimeout(function () {
		Ti.API.log("fake profile loader is here");
		if (options.success)
			options.success();		
		if (options.error)
			options.error();		
	}, 3000);	
}

exports.getField = function (name) {
	if (typeof exports.data[name] != "undefined")
		return exports.data[name]
	else
		return "";
}

exports.parseFacebookProfile = function (fb) {
	if (typeof fb == "undefined") {
		if (Ti.App.Properties.hasProperty("dataFromFacebook") && 
			Ti.App.Properties.getString("dataFromFacebook").length ) {
			
			var fbData = JSON.parse(Ti.App.Properties.getString("dataFromFacebook"));
		} else {
			var fbData = {};		
		}
	} else {
		var fbData = fb;
	}
	var profileData = {};
	
	profileData["Name"] = fbData["name"];
	
	if (fbData["gender"] == "male") {
		profileData["Gender"] = 0;
	} else if (fbData["gender"] == "female") {
		profileData["Gender"] = 1;
	}
	
	// relationship_statuses
	// Single, In a relationship, Engaged, Married, It's complicated, In an open relationship, Widowed, Separated, Divorced, In a civil union, In a domestic partnership
	
	if (fbData["relationship_status"] == "Married" || 
		fbData["relationship_status"] == "In a relationship") {
		
		profileData["Relationship"] = 1;		
	
	} else if (fbData["relationship_status"] == "Single") {
		
		profileData["Relationship"] = 0;
		
	}

//	Ti.API.log(profileData);
	exports.data = profileData;
	exports.save(profileData);

	return profileData;
}

