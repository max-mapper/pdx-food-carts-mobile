Titanium.include('javascripts/application.js');
var indicatorShowing = false;

Ti.UI.setBackgroundColor('white');

var tabGroup = Titanium.UI.createTabGroup();
var findWin = Titanium.UI.createWindow({  
  url:'javascripts/find.js',
  title:'Find Carts',
  barColor:"#333",
});
var findTab = Titanium.UI.createTab({  
  icon:'images/radar.png',
  title:'Map',
  window:findWin
});

var listWin = Titanium.UI.createWindow({  
  url:'javascripts/list.js',
  title:'Carts Near You',
  barColor:"#333",
  backgroundColor:'#5a5c64'
});
var listTab = Titanium.UI.createTab({  
  icon:'images/find.png',
  title:'List',
  window:listWin
});

tabGroup.addTab(findTab);  
tabGroup.addTab(listTab);

var welcomeTabGroup = Titanium.UI.createTabGroup();
var welcomeWin = Titanium.UI.createWindow({
  url:'javascripts/welcome.js',
  backgroundColor:'#476e8b',
  title:'Welcome!',
  barColor:"#333",
  backTitle:'Close',
  tabBarHidden:true
});
var welcomeTab = Titanium.UI.createTab({  
  title:'Welcome!',
  window:welcomeWin
});
welcomeTabGroup.addTab(welcomeTab);

Ti.App.addEventListener('remove_welcome', function() {
  if (Titanium.Platform.name == 'android') {
    welcomeWin.close();
  } else {
    welcomeTabGroup.close();
  }
  Ti.App.Properties.setBool('welcomeViewed', true);
  tabGroup.open();
});

if (Ti.App.Properties.hasProperty('welcomeViewed')) {
  tabGroup.open();
} else {
  if (Titanium.Platform.name == 'android') {
    welcomeWin.open();
  } else {
    welcomeTabGroup.open();
  }
}

// ---------------------------------------------------------------
// Create custom loading indicator
// ---------------------------------------------------------------
var indWin = null;
var actInd = null;
function showIndicator(title) {
	indicatorShowing = true;
	
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