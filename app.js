Titanium.include('javascripts/application.js');

Ti.UI.setBackgroundColor('white');

var tabGroup = Titanium.UI.createTabGroup();
var win = Titanium.UI.createWindow({  
  url:'javascripts/report.js',
  title:'Find Carts',
  barColor:"#333",
});
var reportTab = Titanium.UI.createTab({  
  icon:'images/icon_report.png',
  title:'Find',
  window:win
});

var twitterWin = Titanium.UI.createWindow({  
  url:'javascripts/twitter.js',
  title:'Twitter #foodcarts',
  barColor:"#333",
  backgroundColor:'#5a5c64'
});
var twitterTab = Titanium.UI.createTab({  
  icon:'images/icon_twitter2.png',
  title:'Twitter',
  window:twitterWin
});

tabGroup.addTab(reportTab);  
tabGroup.addTab(twitterTab);

tabGroup.open();

// ---------------------------------------------------------------
// Create custom loading indicator
// ---------------------------------------------------------------
var indWin = null;
var actInd = null;
function showIndicator(title) {
	indicatorShowing = true;
  Ti.API.info("showIndicator with title " + title);
	
  	// window container
  	indWin = Titanium.UI.createWindow({
  		height:150,
  		width:150
  	});

  	// black view
  	var indView = Titanium.UI.createView({
  		height:150,
  		width:150,
  		backgroundColor:'#000',
  		borderRadius:10,
  		opacity:0.7
  	});
  	indWin.add(indView);

  	// loading indicator
  	actInd = Titanium.UI.createActivityIndicator({
  		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
  		height:30,
  		width:30
  	});
  	indWin.add(actInd);

  	// message
  	var message = Titanium.UI.createLabel({
  		text:title,
  		color:'#fff',
  		width:'auto',
  		height:'auto',
  		font:{fontSize:20,fontWeight:'bold'},
  		bottom:20
  	});
  	indWin.add(message);
  	indWin.open();
  	actInd.show();
};

function hideIndicator() {
  	actInd.hide();
  	indWin.close({opacity:0,duration:500});
  	indicatorShowing = false;
};

// ---------------------------------------------------------------
// Add global event handlers to hide/show custom indicator
// ---------------------------------------------------------------
Titanium.App.addEventListener('show_indicator', function(e) {
  if(Ti.Platform.name == 'android') {
    return;
  }
  
  if(e.title == null) { e.title = 'Loading'; }
  if(indicatorShowing == true) { hideIndicator(); }
	showIndicator(e.title);
});
Titanium.App.addEventListener('change_title', function(e) {
  if(e.title) {
    hideIndicator();
  	showIndicator(e.title);
  }
});
Titanium.App.addEventListener('hide_indicator', function(e) {
	hideIndicator();
});