Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');
var currentImageView;
var currentImageAdded = false;
var data;
var editWin = Titanium.UI.currentWindow;
var couchUrl = "http://data.pdxapi.com/food_carts/"+editWin.couch_id;
var cartLocation;
var imageUrl = "../images/no_menu.png";
var existingMenu = false;
var currentMedia = false;

Titanium.App.addEventListener('locationUpdated', function(newloc) {
  cartLocation = {
    "latitude": newloc.geometry.latitude, 
    "longitude": newloc.geometry.longitude
  };
});

function showSuccess(message) {
  Ti.UI.createAlertDialog({
    title:'Your changes have been uploaded successfully.',
    message: message
  }).show();
  editWin.close();
  Titanium.App.fireEvent('detailsSaved');
}

function showForm() {
  var scrollView = Ti.UI.createScrollView({
  	contentWidth:'auto',
  	contentHeight:'auto',
  	top:0,
  	showVerticalScrollIndicator:true,
  	showHorizontalScrollIndicator:true
  });
  
  scrollView.addEventListener('click', function() { });
  
  var editLocationButton = Titanium.UI.createImageView({
    image:"../images/editlocationbutton.png",
    height:40,
    width:145,
    left: 10,
    top:10
  });
 
  scrollView.add(editLocationButton);
  
  var saveButton = Titanium.UI.createImageView({
    image:"../images/savebutton.png",
    height:40,
    width:145,
    left: 165,
    top:10
  });
  
  scrollView.add(saveButton);
  
  editLocationButton.addEventListener('click', function(evt) {
    var editLocationWin = Titanium.UI.createWindow({
      url:'edit_location.js',
      backgroundColor:'#fff',
      title: "Editing",
      cartLocation: {latitude:data.geometry.coordinates[1],longitude:data.geometry.coordinates[0],animate:true,latitudeDelta:0.001, longitudeDelta:0.001},
      couch_id: editWin.couch_id,
      isNewCart: false
    });
    Titanium.UI.currentTab.open(editLocationWin,{animated:true});
  });

  var nameTitleLabel = Ti.UI.createLabel({
    top: 60,
    left: 10,
    width: 300,
    height: 15,
    color: '#000',
    font:{fontSize:12},
    text:'Cart Name'
  });
  scrollView.add(nameTitleLabel);

  var nameField = Titanium.UI.createTextField({
    value:data.name,
    height:40,
    width:300,
    left: 10,
    top:80,
    font:{fontSize:16},
    borderWidth:2,
    borderColor:'#bbb',
    borderRadius:5,
    suppressReturn:true,
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
  	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
  	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  scrollView.add(nameField);
  nameField.addEventListener("return",function(e){
    nameField.blur();
  });

  var descriptionTitleLabel = Ti.UI.createLabel({
    top: 130,
    left: 10,
    width: 300,
    height: 15,
    color: '#000',
    font:{fontSize:12},
    text:'Food Description'
  });
  scrollView.add(descriptionTitleLabel);

  var descriptionField = Titanium.UI.createTextArea({
    value:data.description,
    height:80,
    width:300,
    left: 10,
    top:150,
    font:{fontSize:12},
    textAlign:'left',
    borderWidth:2,
    borderColor:'#bbb',
    borderRadius:5,
    suppressReturn:true
  });
  scrollView.add(descriptionField);
  descriptionField.addEventListener("return",function(e){
    descriptionField.blur();
  });

  var hoursTitleLabel = Ti.UI.createLabel({
    top: 240,
    left: 10,
    width: 300,
    height: 15,
    color: '#000',
    font:{fontSize:12},
    text:'Hours'
  });
  scrollView.add(hoursTitleLabel);

  var hoursField = Titanium.UI.createTextField({
    value:data.hours,
    height:40,
    width:300,
    top:260,
    left: 10,
    font:{fontSize:16},
    borderWidth:2,
    borderColor:'#bbb',
    borderRadius:5,
    suppressReturn:true,
    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
  	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
  	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
  });
  scrollView.add(hoursField);
  hoursField.addEventListener("return",function(e){
    hoursField.blur();
  });

  var photoTitleLabel = Ti.UI.createLabel({
    top: 310,
    left: 10,
    width: 300,
    height: 15,
    color: '#000',
    font:{fontSize:12},
    text:'Menu Photo'
  });
  
  var menu = Ti.UI.createImageView({
    image:imageUrl,
    left: 10,
    top:330,
    height:100
  });
  
  var uploadButtonImage = '../images/upload_new_menu.png';
  
  if (data._attachments != null && data._attachments.menuphoto.length != 0) {
    existingMenu = true;
    menu.image = couchUrl + "/menuphoto";
    menu.addEventListener('click', function()
    { 
      var w = Titanium.UI.createWindow({
        backgroundColor: '#336699',
        scale: true
      });

      var close = Titanium.UI.createButton({
        title:'Close',
        top: 5,
        left: 60,
        height: 40,
        width: 200
      });

      w.add(close);

      close.addEventListener('click', function() {
        w.close();
      });

      var wv = Ti.UI.createWebView({
        top: 50,
        url:"http://pdxapi.com/image/food_carts/" + editWin.couch_id
      });

      w.add(wv);
      w.open();
    });
  }
  
  var photoButtonBg = Ti.UI.createView({
    top: 440,
    left: 60,
    width: 200,
    height: 82,
    borderRadius: 5
  });

  var photoAddButton = Ti.UI.createButton({
    top: 1,
    left: 1,
    width: 200,
    height: 42,
    borderWidth:2,
    borderColor:'#bbb',
    borderRadius:5,
    backgroundImage: uploadButtonImage,
    backgroundSelectedImage: uploadButtonImage,
    backgroundDisabledImage: uploadButtonImage
  });

  photoAddButton.addEventListener('click', function() {
    displayMediaChooser();
  });

  scrollView.add(photoTitleLabel);
  scrollView.add(menu);
  photoButtonBg.add(photoAddButton);
  scrollView.add(photoButtonBg);

  var chooseMediaSource = function(event) {
    switch(event.index) {
      case 0:
        newPhoto();
        break;
      case 1:
        chooseFromGallery();
        break;
      case event.destructive:
        if(currentImageAdded == true)  {
          currentImageAdded = false;
          currentMedia = false;
        }
        break;
    };
  };

  var chooseMedia = Ti.UI.createOptionDialog({
    title: 'Choose a menu photo'
  });
  chooseMedia.addEventListener('click', chooseMediaSource);

  function displayMediaChooser() {
    if(currentImageAdded == true) {
      chooseMedia.options = ['New Photo', 'Choose Existing', 'Remove Existing', 'Cancel'];
      chooseMedia.destructive = 2;  
      chooseMedia.cancel = 3;
    } else {
      chooseMedia.options = ['New Photo', 'Choose Existing','Cancel'];
      chooseMedia.cancel = 2;
    }
    chooseMedia.show();
  }

  function newPhoto() {
    Ti.Media.showCamera({
      mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
      success: function(event) {
        Ti.UI.createAlertDialog({
          title:'Photo added',
          message:"Don't forget to save your changes at the top of the form!"
        }).show();
        currentMedia = event.media;
        currentImageAdded = true;
      },
      error:function(error) {
        Ti.UI.createAlertDialog({
          title:'Sorry',
          message:'This device either cannot take photos or there was a problem saving this photo.'
        }).show();
      },
      allowImageEditing:true,
      saveToPhotoGallery:true
    });
  }

  function chooseFromGallery() {
    Titanium.Media.openPhotoGallery({
      success: function(event) {
        Ti.UI.createAlertDialog({
          title:'Photo added',
          message:"Don't forget to save your changes at the top of the form!"
        }).show();
    		currentMedia = event.media;
        currentImageAdded = true;
      }
    });
  };

  saveButton.addEventListener('click', function() {
    Ti.App.fireEvent('show_indicator');
    var cartData = { "_id"          : data._id,
                     "_rev"         : data._rev,
                     "name"         : nameField.value,
                     "hours"        : hoursField.value,
                     "description"  : descriptionField.value,
                     "geometry"     : { "type": "Point", 
                                        "coordinates": [cartLocation.longitude, cartLocation.latitude]
                                      }
                   }
    if (existingMenu == true) {
      cartData._attachments = data._attachments;
    }
    var jsonData = JSON.stringify(cartData);
          
          var xhr = Titanium.Network.createHTTPClient();
        
          xhr.onload = function() {
            if (currentImageAdded == true) {              
              var newData = JSON.parse(this.responseText);
              var imagexhr = Titanium.Network.createHTTPClient();
        
              imagexhr.onload = function() {
                Ti.App.fireEvent('hide_indicator',{});
                showSuccess("Please allow a moment or two for your updates to become available");
              };
              
              imagexhr.open('PUT', "http://data.pdxapi.com/food_carts/" + newData.id + "/menuphoto?rev=" + newData.rev);
              imagexhr.setRequestHeader('Content-Type', 'application/jpeg');
              imagexhr.setRequestHeader('Accept', 'application/jpeg');
              Ti.App.fireEvent('change_title', { title: 'Submitting' });
              imagexhr.send(currentMedia);
            } else {
              Ti.App.fireEvent('hide_indicator',{});
              showSuccess("Please allow a moment or two for your updates to become available");
            }
          };
        
          xhr.open('PUT', "http://data.pdxapi.com/food_carts/" + data._id);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send(jsonData);
  });
  
  var deleteButtonLabel = Ti.UI.createLabel({
    top: 520,
    left: 35,
    width: 250,
    height: 30,
    color: '#000',
    font:{fontSize:12},
    text:'Has this cart permanently closed or do you think that this data is worthless spam?'
  });
  
  var deleteButtonBg = Ti.UI.createView({
    top: 540,
    left: 60,
    width: 200,
    height: 80,
    borderRadius: 5
  });
  
  var deleteButton = Titanium.UI.createImageView({
    image:"../images/deletebutton.png",
    height:40,
    width:145,
    left: 27,
    top:20
  });
  
  scrollView.add(deleteButtonLabel);
  deleteButtonBg.add(deleteButton);
  scrollView.add(deleteButtonBg);
  
  deleteButton.addEventListener('click', function() {
    Ti.App.fireEvent('show_indicator');

    if (typeof(data.flags) == "undefined") {
      data.flags = 0;
    }
    
    var cartData = { "_id"          : data._id,
                     "_rev"         : data._rev,
                     "flags"        : data.flags + 1,
                     "name"         : data.name,
                     "hours"        : data.hours,
                     "description"  : data.description,
                     "geometry"     : data.geometry
                   }
                   
    if (existingMenu == true) {
      cartData._attachments = data._attachments;
    }
    
    var jsonData = JSON.stringify(cartData);
    var xhr = Titanium.Network.createHTTPClient();
  
    xhr.onload = function() {
      Ti.App.fireEvent('hide_indicator',{});
      showSuccess("This cart has been flagged for review. It will continue to be listed until an administrator looks into it. Thanks!");
    };
    
    xhr.open('PUT', "http://data.pdxapi.com/food_carts/" + data._id);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(jsonData);
  });
  
  editWin.add(scrollView);
}
Ti.App.fireEvent('show_indicator');
var xhr = Titanium.Network.createHTTPClient();
xhr.onload = function() {
    Ti.App.fireEvent('hide_indicator',{});
    data = JSON.parse(this.responseText);
    cartLocation = {
      "latitude": data.geometry.coordinates[1], 
      "longitude": data.geometry.coordinates[0]
    };
    showForm();
};

xhr.open("GET", "http://data.pdxapi.com/food_carts/"+editWin.couch_id);
xhr.send();