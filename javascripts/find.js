Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');
Ti.App.fireEvent('show_indicator');
var win = Ti.UI.currentWindow;
var annotations = [];
var revision;
var mapview;
var usersLocation;
var currentMapBounds;
var jsonResponse;
var currentCarts;

Titanium.App.addEventListener('listInitialize', function() {
  Ti.App.fireEvent('drawCartsTable', {carts:currentCarts});
});

var newCartButton = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.ADD
});

newCartButton.addEventListener('click', function() {
  var editLocationWin = Titanium.UI.createWindow({
    url:'edit_location.js',
    backgroundColor:'#fff',
    title: "New Cart Location",
    cartLocation: usersLocation,
    isNewCart: true
  });
  Titanium.UI.currentTab.open(editLocationWin,{animated:true});
});

Titanium.App.addEventListener('newLocationAdded', function(newloc) {
  Ti.App.fireEvent('show_indicator');
  var url = "http://data.pdxapi.com/food_carts/";
  var cartData = { "geometry"     : { "type": "Point", 
                                      "coordinates": [newloc.geometry.longitude, newloc.geometry.latitude]
                                    }
                 }
  var jsonData = JSON.stringify(cartData);
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
      jsonResponse = this.responseText;
      setTimeout(function() {
        Ti.App.fireEvent('hide_indicator',{});
        var response = JSON.parse(jsonResponse);
    	  var win = Titanium.UI.createWindow({
      		url:'edit_details.js',
      		backgroundColor:'#fff',
      		title: "New Cart Details",
      		couch_id: response.id
      	});
        Titanium.UI.currentTab.open(win,{animated:true});
      },1000);
  };
  xhr.open("POST", url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(jsonData);
});

win.rightNavButton = newCartButton;


function getCarts(location) {
  var one_block = 0.0024;
  var lat = location.latitude;
  var lon = location.longitude;
  var url = "http://data.pdxapi.com/food_carts/_design/names/_spatial/points?bbox="+ (lon - one_block) + "," + (lat - one_block) + "," + (lon + one_block) + "," + (lat + one_block);
  Ti.API.info(url);
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
      Ti.App.fireEvent('hide_indicator',{});
      var response = JSON.parse(this.responseText).rows;
      var carts = Enumerable.map(response, function(cart){
        return {latitude: cart.bbox[1], longitude: cart.bbox[0], id:cart.id, name:cart.value.name};
      });
      currentCarts = carts;
      Ti.App.fireEvent('cartsUpdated', {carts:carts});
      showCarts(carts);
  };
  xhr.open("GET", url);
  xhr.send();
}

function hideAnnotations(){
  for (var a=annotations.length-1;a>=0;a--) {
    mapview.removeAnnotation(annotations[a]);
  }
  annotations = [];
}

function showCarts(carts) {
  function displayAnnotations() {
    for (var i in annotations) {
      mapview.addAnnotation(annotations[i]);
    }
  }
  
  hideAnnotations();
  
  for (var i = 0; i < carts.length; i++) {    
    var a = Ti.Map.createAnnotation({
        latitude: carts[i].latitude,
        longitude: carts[i].longitude,
        pincolor: Ti.Map.ANNOTATION_RED,
        title:carts[i].name,
      	rightButton: "../images/details.png",
        animate: false,
        pinImage: "../images/android-cart.png",
        couch_id: carts[i].id
    });
    annotations = annotations.concat(a);
  }  
  displayAnnotations();
}

Ti.Geolocation.purpose = "Find nearby Food Carts";

Titanium.Geolocation.getCurrentPosition(function(e) {
  // usersLocation = {latitude:45.5123668,longitude:-122.6536583,animate:true,latitudeDelta:0.001, longitudeDelta:0.001};
  var usersLocation = {latitude:e.coords.latitude,longitude:e.coords.longitude,animate:true,latitudeDelta:0.001, longitudeDelta:0.001};

  mapview = Titanium.Map.createView({
  	mapType: Titanium.Map.STANDARD_TYPE,
  	region:usersLocation,
  	animate:true,
  	regionFit:true,
  	userLocation:true
  });

  win.open(mapview);
  win.add(mapview);

  var findMeButton = Titanium.UI.createButtonBar({
  	labels:[{image:'../images/location.png', width:30}],
  	backgroundColor:'#A3D3F1',
  	style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
  	height:30,
  	width:'auto'
  });

  win.setLeftNavButton(findMeButton);
  
  findMeButton.addEventListener('click', function()
  {
  	mapview.setLocation(usersLocation);
  });
  
  setTimeout(function() { 
    mapview.zoom(1);
  
    mapview.addEventListener('click',function(evt) {
    	var annotation = evt.annotation;
    	var title = evt.title;
    	var clickSource = evt.clicksource;
    	var couch_id = evt.annotation.couch_id;

    	if (evt.clicksource == 'rightButton') {
    	  var win = Titanium.UI.createWindow({
      		url:'edit_details.js',
      		backgroundColor:'#fff',
      		title: title,
      		couch_id: couch_id
      	});
        Titanium.UI.currentTab.open(win,{animated:true});
    	}
    });

    mapview.addEventListener('regionChanged',function(evt){
      Ti.App.fireEvent('hide_indicator',{});
      currentMapBounds = GeoHelper.getMapBounds(evt);
      getCarts({ latitude: currentMapBounds.center.lat, longitude: currentMapBounds.center.lng });
    });
  },1000);
});
