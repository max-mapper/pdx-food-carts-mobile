Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');

var win = Ti.UI.currentWindow;
var annotations = [];
var revision;
var mapview;

function getCarts(location) {
  var one_block = 0.0024;
  var lat = location.latitude;
  var lon = location.longitude;
  var url = "http://data.pdxapi.com/food_carts/_design/names/_spatial/points?bbox="+ (lon - one_block) + "," + (lat - one_block) + "," + (lon + one_block) + "," + (lat + one_block);
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
      var response = JSON.parse(this.responseText).spatial;
      var carts = Enumerable.map(response, function(cart){
        return {latitude: cart.bbox[1], longitude: cart.bbox[0], id:cart.id, name:cart.value.name};
      });
      showCarts(carts);
  };
  Ti.API.info("looking up carts at "+url);
  xhr.open("GET", url);
  xhr.send();
}

function showCarts(carts) {
  function displayAnnotations() {
    mapview.addAnnotations(annotations);
  }

  function hideAnnotations(){
    for (var a=annotations.length-1;a>=0;a--) {
      mapview.removeAnnotation(annotations[a]);
    }
    annotations = [];
  }
  
  hideAnnotations();
  
  for (var i = 0; i < carts.length; i++) {    
    var a = Ti.Map.createAnnotation({
        latitude: carts[i].latitude,
        longitude: carts[i].longitude,
        pincolor: Ti.Map.ANNOTATION_RED,
        title:carts[i].name,
        rightButton: '../images/blue_edit.png',
        animate: false,
        couch_id: carts[i].id
    });
    annotations = annotations.concat(a);
  }  
  displayAnnotations();
  mapview.addEventListener('click',function(evt) {
    // map event properties
  	var annotation = evt.annotation;
  	var title = evt.title;
  	var clickSource = evt.clicksource;
  	var couch_id = evt.annotation.couch_id;

  	// use custom event attribute to determine if atlanta annotation was clicked
  	if (evt.clicksource == 'rightButton') {
  	  var win = Titanium.UI.createWindow({
    		url:'edit_details.js',
    		backgroundColor:'#fff',
    		title: "Editing " + title,
    		couch_id: couch_id
    	});
    	Titanium.UI.currentTab.open(win,{animated:true});
  	}
  });
}

Titanium.Geolocation.getCurrentPosition(function(e) {
  var location = {latitude:45.5123668,longitude:-122.6536583,animate:true,latitudeDelta:0.001, longitudeDelta:0.001};

  mapview = Titanium.Map.createView({
  	mapType: Titanium.Map.STANDARD_TYPE,
  	region:location,
  	animate:true,
  	regionFit:true,
  	userLocation:true
  });

  win.open(mapview);
  win.add(mapview);
  
  
  mapview.addEventListener('regionChanged',function(evt){
    var bounds = GeoHelper.getMapBounds(evt);
    getCarts({ latitude: bounds.center.lat, longitude: bounds.center.lng });
  });
  
});