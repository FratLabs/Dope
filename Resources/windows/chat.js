
(function() {
	Dope.UI.createChatWindow = function () {
		var win = Ti.UI.createWindow({
			title:"Chat",
			backgroundColor:"#c5ccd4"
		});
		var toolbar = Ti.UI.createToolbar({
			top:-1,
			height:44,
		});
		win.add(toolbar);
		var bb1 = Titanium.UI.iOS.createTabbedBar({
		    labels:['Map', 'List', 'Grid'],
		    index:0,
		    top:7,
		    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		    height:30,
		    width:"70%"
		});
		win.add(bb1);
		
		bb1.addEventListener("click", function (e) {
			map.hide();
			grid.hide();
			table.hide();
			
			switch(this.index) {
				case 0:
					map.show();
					break;
				case 1:
					table.show();
					break;
				case 2:
					grid.show();
					break;
			}
		})	
		var map = Titanium.Map.createView({
			top:43,
		    mapType: Titanium.Map.STANDARD_TYPE,
		    animate:true,
		    regionFit:true,
		    userLocation:true,
		});
		
		win.map = map;
		win.add(map);

		var tableData = [];
		var table = Titanium.UI.createTableView({
			top: 43,
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.PLAIN
		});
		table.hide();
		win.table = table;
		win.add(table);	

		var grid = Ti.UI.createScrollView({
			top:43,
			bottom:0,
			backgroundColor:"#FFF",
			contentHeight:400
		})
		var tmp = Ti.UI.createImageView({
			backgroundColor:"#999",
			width:100,
			height:100,
			top:200,
		})
		grid.add(tmp);
		grid.hide();
		win.grid = grid;
		win.add(grid);
		
		Titanium.Geolocation.purpose = "Dope";		
		// Titanium.Geolocation.addEventListener('location',function (e) {
			// var lon = e.coords.longitude;
			// var lat = e.coords.latitude;
			// gps = lon + ' x ' + lat;
			// // Titanium.Geolocation.reverseGeocoder(lat, lon, function (evt) {
				// // var places = evt.places[0];
				// // address = places.street ? places.street : places.address;
				// // Ti.API.log("geo addr:" + address);
// // //				refreshLabel();
			// // });
			// Ti.API.log("gps:" + gps);
// //			refreshLabel();
		// });
		var Marker = Titanium.Map.createAnnotation({
		    latitude:0,
    		longitude:0,
		    title:"Appcelerator Headquarters",
		    subtitle:'Mountain View, CA',
		    pincolor:Titanium.Map.ANNOTATION_RED,
		    animate:true,
		    leftButton: '../images/appcelerator_small.png',
		    myid:1 // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
		});
		
		win.addEventListener("open", function () {
			Ti.Geolocation.getCurrentPosition(function (geo) {
				Ti.API.log(geo);
				
				win.map.setRegion({
					latitude: geo.coords.latitude, 
					longitude: geo.coords.longitude, 
					latitudeDelta: 0.01,
					longitudeDelta:0.01
				});

				Profile.updateLocation(geo.coords.longitude, geo.coords.latitude, {
					success: function (e, data) {
						Ti.API.log("location updated!");	
					}
				})
			})
			
		})

		var chatWin = Dope.UI.createNavigationGroupStack(win);
		
		return chatWin;
	}
})();
