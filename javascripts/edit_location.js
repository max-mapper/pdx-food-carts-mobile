Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');

var win = Titanium.UI.currentWindow;
var annotations = [];
var revision;
var isNewCart = win.isNewCart;

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
    image:'../images/crosshair.png',
    touchEnabled: false,
    top:85,
    left:60,
    height:'auto',
    width:'auto'
  });
  
  win.add(view);
  
  if (isNewCart == true) {
    var saveNewButton = Ti.UI.createImageView({
      image: "../images/savenewcart.png",
      height:40,
      width:145,
      top:20  
    });
    
    saveNewButton.addEventListener('click', function() {
      Ti.App.fireEvent('newLocationAdded', {"geometry":
        { "latitude": annotations[0].latitude, 
          "longitude": annotations[0].longitude
        }}
      );
      win.close();
    });
    
    win.add(saveNewButton);
  } else {
    var saveExistingbutton = Ti.UI.createImageView({
      image: "../images/savebutton.png",
      height:40,
      width:145,
      top:20  
    });
    
    saveExistingbutton.addEventListener('click', function() {
      Ti.App.fireEvent('locationUpdated', {"geometry":
        { "latitude": annotations[0].latitude, 
          "longitude": annotations[0].longitude
        }}
      );
      win.close();
    });
    
    win.add(saveExistingbutton);
  }
}

showLocation(win.cartLocation);