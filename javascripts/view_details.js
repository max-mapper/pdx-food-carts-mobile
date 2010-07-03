Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');
var currentImageView;
var currentImageAdded = false;
var existingMenu = false;
var data;
var detailsWin = Titanium.UI.currentWindow;
var imageUrl = "../images/no_menu.png";
var couchUrl = "http://data.pdxapi.com/food_carts/"+detailsWin.couch_id;
var tv = Ti.UI.createTableView({minRowHeight:50});

function showSuccess(message) {    
  Ti.UI.createAlertDialog({
  	title:'Success!',
  	message: message
  }).show();
}

function showForm(data) {
  var rows = [];
	var row = Ti.UI.createTableViewRow({height:'auto'});

	textView = Ti.UI.createView({
		height:'auto',
		layout:'vertical',
		left:10,
		width: 280,
		bottom:10,
		right:10
	});
	
	var editButton = Titanium.UI.createButton({
  	title:"Edit this cart's info",
  	height:40,
  	width:200,
  	top:10
  });
 
  textView.add(editButton);
	
	textView.addEventListener('click', function(){}); // needed to pass clicks through to items inside view

	var name = Ti.UI.createLabel({
		text:data.name,
    font:{fontSize:16, fontWeight:'bold'},
		height:'auto',
		top: 20
	});
	textView.add(name);

	var description = Ti.UI.createLabel({
		text:data.description,
		top:10,
		height:'auto'
	});
	textView.add(description);
	
	var hoursTitle = Ti.UI.createLabel({
		text:"Hours",
		top: 10,
    font:{fontSize:16, fontWeight:'bold'},
		height:'auto'
	});
	textView.add(hoursTitle);
	
	var hoursData = "Hours of operation are unknown. Tap Edit to enter this cart's hours and share it with other Portland Cart Finder users.";
	
	if (data.hours != null && data.hours != "") {
    hoursData = data.hours;
  }
	
	var hours = Ti.UI.createLabel({
		text:hoursData,
		top:10,
		height:'auto'
	});
	textView.add(hours);
	
	var menuTitle = Ti.UI.createLabel({
		text:"Menu Photo",
		top: 10,
    font:{fontSize:16, fontWeight:'bold'},
		height:'auto'
	});
	textView.add(menuTitle);

	var menu = Ti.UI.createImageView({
		url:imageUrl,
		top:10,
		height:'auto'
	});
	
	if (data._attachments != null && data._attachments.attachment.length != 0) {
	  existingMenu = true;
    menu.url = couchUrl + "/attachment";
    
    menu.addEventListener('click', function()
    { 
      var w = Titanium.UI.createWindow({
        backgroundColor: '#336699',
        scale: true
      });

      var close = Titanium.UI.createButton({
    		title:'Close',
    		top: 5,
    		height: 40,
    		width: 200
    	});

  		w.add(close);

    	close.addEventListener('click', function()
    	{
    		w.close();
    	});

      var wv = Ti.UI.createWebView({
        top: 50,
  			url:"http://pdxapi.com/image/food_carts/" + detailsWin.couch_id
  		});

  		w.add(wv);
      w.open();
    });
  }

	textView.add(menu);
	row.add(textView);
	rows.push(row);
  tv.setData(rows);
  detailsWin.add(tv);

  Titanium.App.addEventListener('detailsSaved', function(e)
  {
  	setTimeout(function()
  	{
  		detailsWin.close({opacity:0,duration:500});
  	},1000);
  });

  editButton.addEventListener('click', function(evt) {
    var editWin = Titanium.UI.createWindow({
      url:'edit_details.js',
      backgroundColor:'#fff',
      title: "Editing",
      couch_id: detailsWin.couch_id,
      existingMenu: existingMenu
    });
    Titanium.UI.currentTab.open(editWin,{animated:true});
  });
}

function getData() {
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
      data = JSON.parse(this.responseText);    
      showForm(data);
  }; 
  xhr.open("GET", couchUrl);
  xhr.send();
}

getData();