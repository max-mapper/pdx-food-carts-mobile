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
    userLocation:false
  });

  win.open(mapview);
  win.add(mapview);
  
  mapview.addEventListener('regionChanged',function(evt)
  {
    function displayAnnotations() {
      mapview.addAnnotations(annotations);
    }

    function hideAnnotations(){
      for (var a = annotations.length - 1; a >= 0; a--) {
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
    top:85,
    left:60,
    height:'auto',
    width:'auto'
  });
  
  win.add(view);
  
  var button = Ti.UI.createButton({
    title:'Done editing location',
    height:40,
    width:200,
    top:20  
  });
  
  win.addEventListener('close', function(){
    Ti.App.fireEvent('locationUpdated', {"geometry":
      { "latitude": annotations[0].latitude, 
        "longitude": annotations[0].longitude
      }}
    );
  });
  
  button.addEventListener('click', function() {
    win.close();
  });
  
  win.add(button);
}

showLocation(win.cartLocation);