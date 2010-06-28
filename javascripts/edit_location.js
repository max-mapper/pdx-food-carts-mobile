Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');

var win = Titanium.UI.currentWindow;
var annotations = [];
var revision;

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
    
   var bounds = GeoHelper.getMapBounds(evt);

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
   url:'../images/crosshair.png',
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
