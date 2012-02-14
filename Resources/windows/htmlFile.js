
(function () {
	Dope.UI.createHTMLViewWindow = function (title, fileName) {
		
		var win = Ti.UI.createWindow({title: title});
		
		var webView = Titanium.UI.createWebView({
		    backgroundColor:"#FFF",
		    showVerticalScrollIndicator:true,
		    showHorizontalScrollIndicator:false
		});

		var termsFile = Titanium.Filesystem.getFile(fileName);
		var termsBlob = termsFile.read();
//		var termsString = termsBlob.toString();
		webView.data = termsBlob;

		win.add(webView);

		return win;		
	}
})();