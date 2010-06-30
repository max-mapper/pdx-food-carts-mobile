Titanium.include('javascripts/application.js');

Ti.UI.setBackgroundColor('white');

var currentCarts;
Titanium.App.addEventListener('cartsUpdated', function(carts) {
  currentCarts = carts.carts;
});

Titanium.App.addEventListener('listInitialize', function() {
  Ti.App.fireEvent('drawCartsTable', {carts:currentCarts});
});



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
  title:'Carts near you',
  barColor:"#333",
  backgroundColor:'#5a5c64',
  currentCarts: currentCarts
});
var listTab = Titanium.UI.createTab({  
  icon:'images/find.png',
  title:'List',
  window:listWin
});

tabGroup.addTab(findTab);  
tabGroup.addTab(listTab);

tabGroup.open();