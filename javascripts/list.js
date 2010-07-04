Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');

var win = Titanium.UI.currentWindow;
var data = [];
var rowData = [];

var tableView = Titanium.UI.createTableView({
	backgroundColor:'#5a5c64',
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

tableView.addEventListener('click',function(evt) {
  var row = evt.row;
  var win = Titanium.UI.createWindow({
    url:'edit_details.js',
    backgroundColor:'#fff',
    title: row.cart_name,
    couch_id: row.couch_id
  });
  Titanium.UI.currentTab.open(win,{animated:true});
});


function buildData(cart) {
	var row = Ti.UI.createTableViewRow();
  row.height = 45;
  row.hasChild = true;
  row.couch_id = cart.id;
  row.cart_name = cart.name;
  	
  var cartName = Ti.UI.createLabel({
  	color:'#fff',
  	font:{fontSize:20, fontWeight:'normal'},
  	text:cart.name,
  	top:10,
  	left:10,
  	height:'auto',
  	textAlign:'left'
  });
  row.add(cartName);
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
  tableView.setData(data,{});
  data = [];
}