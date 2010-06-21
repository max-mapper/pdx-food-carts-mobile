Ti.UI.setBackgroundColor('white');

var win = Titanium.UI.createWindow();
var annotations = [];
var revision;
/**
 * Get the screen boundaries as latitude and longitude values 
 */
function getMapBounds(region) {
    var b = {};
    b.northWest = {}; b.northEast = {}; b.southWest = {}; b.southEast = {}; b.center = {};
 
    b.northWest.lat = region.latitude + region.latitudeDelta / 2;
    b.northWest.lng = region.longitude - region.longitudeDelta / 2;
 
    b.southWest.lat = region.latitude - region.latitudeDelta / 2;
    b.southWest.lng = region.longitude - region.longitudeDelta / 2;
 
    b.northEast.lat = region.latitude + region.latitudeDelta / 2;
    b.northEast.lng = region.longitude + region.longitudeDelta / 2;
 
    b.southEast.lat = region.latitude - region.latitudeDelta / 2;
    b.southEast.lng = region.longitude + region.longitudeDelta / 2;
 
    b.center.lat = (b.southWest.lat + b.northEast.lat) / 2;
    b.center.lng = (b.southWest.lng + b.northEast.lng) / 2;
    return b;
}

function showLocation(location) {
  
  var mapview = Titanium.Map.createView({
  	mapType: Titanium.Map.STANDARD_TYPE,
  	region:location,
  	animate:true,
  	regionFit:true,
  	userLocation:true
  });

  win.open(mapview);
  win.add(mapview);
  
  mapview.addEventListener('regionChanged',function(evt)
  {
    function displayAnnotations() {
      mapview.addAnnotations(annotations);
    }

    function hideAnnotations(){
      for (var a=annotations.length-1;a>=0;a--) {
        mapview.removeAnnotation(annotations[a]);
      }
      annotations = [];
    }
    
  	Titanium.API.info('maps region has updated to '+evt.longitude+','+evt.latitude);
  	var bounds = getMapBounds(evt);
  	Titanium.API.info('center: '+bounds.center.lat+','+bounds.center.lng);

    hideAnnotations();
    var a = Ti.Map.createAnnotation({
        latitude: bounds.center.lat,
        longitude: bounds.center.lng,
        pincolor: Ti.Map.ANNOTATION_RED,
        animate: false
    });
    
    annotations = annotations.concat(a);
    displayAnnotations(a);
  });
  
  var view = Ti.UI.createImageView({
  	url:'images/crosshair.png',
  	touchEnabled: false,
  	top:130,
  	left:60,
  	height:'auto',
  	width:'auto'
  });

  win.add(view);
  
  var button = Ti.UI.createButton({
		title:'Save',
		height:40,
		width:200,
		top:20	
	});
	button.addEventListener('click', function() {
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function(e)
		{
			Ti.UI.createAlertDialog({title:'Saved!', message:'response ' + this.responseText}).show();
		};
		xhr.open('PUT','http://data.pdxapi.com/food_carts/ef512bfdc9b17e9827f7275dd05e2195');
		xhr.setRequestHeader("Content-Type", "application/json");
  	
		xhr.send(JSON.stringify({_rev: revision, geometry:{ "type": "Point", "coordinates": [annotations[0].longitude, annotations[0].latitude]}}));
	});
  win.add(button);
}

var xhr = Titanium.Network.createHTTPClient();
xhr.onload = function() {
    var json = JSON.parse(this.responseText);
    revision = json._rev;
    var location = {latitude:json.geometry.coordinates[1],longitude:json.geometry.coordinates[0],animate:true,latitudeDelta:0.01, longitudeDelta:0.01};
    showLocation(location);
}; 
xhr.open("GET", "http://data.pdxapi.com/food_carts/ef512bfdc9b17e9827f7275dd05e2195");
xhr.send();