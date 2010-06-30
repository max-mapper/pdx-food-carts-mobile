Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');

var win = Titanium.UI.currentWindow;
var data = [];
var rowData = [];

var tableView = Titanium.UI.createTableView({
	backgroundColor:'#5a5c64',
	separatorStyle: Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
	separatorColor:'#444'
});
win.add(tableView);

Titanium.App.addEventListener('cartsUpdated', function(carts) {
  win.currentCarts = carts.carts;
  data = [];
  rowData = [];
});

win.addEventListener('focus', function(){
  drawCartsTable();
});

Ti.App.fireEvent('listInitialize');

Titanium.App.addEventListener('drawCartsTable', function(carts) {
  win.currentCarts = carts.carts;
  drawCartsTable();
});


function buildData(cart) {
	var row = Ti.UI.createTableViewRow();
  row.height = 'auto';
  row.hasChild = false;
    
  var tweetLabel = Ti.UI.createLabel({
  	color:'#fff',
  	font:{fontSize:14, fontWeight:'normal'},
  	text:cart.name,
  	top:30,
  	left:68,
  	width:236,
  	height:'auto',
  	textAlign:'left'
  });
  row.add(tweetLabel);
  data.push(row);
}

function drawCartsTable() {
  for(var index in win.currentCarts) {
  	if(win.currentCarts[index] != null) {
  	  try{
  			buildData(win.currentCarts[index]);
  	  } catch(ex) {
  	    Titanium.API.error(ex);
  	  }
  	}
  }
  tableView.setData(data,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP});
}