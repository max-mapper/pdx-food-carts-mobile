Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');

var win = Ti.UI.currentWindow;
var annotations = [];
var revision;
var mapview;

function getCarts(location) {
  var one_block = 0.0012;
  var lat = location.latitude;
  var lon = location.longitude;
  var url = "http://data.pdxapi.com/food_carts/_design/geojson/_spatial/points?bbox="+ (lon - one_block) + "," + (lat - one_block) + "," + (lon + one_block) + "," + (lat + one_block);
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onload = function() {
      var response = JSON.parse(this.responseText).spatial;
      var carts = Enumerable.map(response, function(cart){
        return {latitude: cart.bbox[1], longitude: cart.bbox[0], id:cart.id};
      });
      Ti.API.info(carts);
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
        animate: false
    });
    annotations = annotations.concat(a);
  }  
  displayAnnotations();
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
  
  getCarts({ latitude: location.latitude, longitude: location.longitude });
});