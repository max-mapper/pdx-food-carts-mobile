Titanium.include('javascripts/application.js');

Ti.UI.setBackgroundColor('white');

var tabGroup = Titanium.UI.createTabGroup();
var win = Titanium.UI.createWindow({  
  url:'javascripts/find.js',
  title:'Find Carts',
  barColor:"#333",
});
var findTab = Titanium.UI.createTab({  
  icon:'images/icon_find.png',
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
  icon:'images/icon_twitter.png',
  title:'Twitter',
  window:twitterWin
});

tabGroup.addTab(findTab);  
tabGroup.addTab(twitterTab);

tabGroup.open();