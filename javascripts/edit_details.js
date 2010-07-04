Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');
var currentImageView;
var currentImageAdded = true;
var data;
var editWin = Titanium.UI.currentWindow;
var couchUrl = "http://data.pdxapi.com/food_carts/"+editWin.couch_id;
var cartLocation;
var imageUrl = "../images/no_menu.png";
var existingMenu = false;

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

function showForm(data) {
  // See
  var scrollView = Ti.UI.createScrollView({
    top:0,
    left:0,
    contentWidth:320,
    contentHeight:600,
    height:480,
    width:320,
    verticalBounce: false
  });
  
  var editLocationButton = Titanium.UI.createImageView({
    url:"../images/editlocationbutton.png",
    height:40,
    width:145,
    left: 10,
    top:10
  });
 
  scrollView.add(editLocationButton);
  
  var saveButton = Titanium.UI.createImageView({
    url:"../images/savebutton.png",
    height:40,
    width:145,
    right: 10,
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
      buttonImage: "../images/savebutton.png"
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
    url:imageUrl,
    top:330,
    height:100
  });
  
  var uploadButtonImage = '../images/upload_new_menu.png';
  
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
        url:"http://pdxapi.com/image/food_carts/" + editWin.couch_id
      });

      w.add(wv);
      w.open();
    });
  }
  
  var photoButtonBg = Ti.UI.createView({
    top: 440,
    left: ((scrollView.width - 200)/2),
    width: 200,
    height: 42,
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
  
  var ind=Titanium.UI.createProgressBar({
    width:200,
    height:50,
    min:0,
    max:1,
    value:0,
    style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
    top:490,
    message:'Uploading Image',
    font:{fontSize:12, fontWeight:'bold'},
    color:'#888'
  });

  scrollView.add(ind);

  // Media management
  var currentMedia = false;

  var chooseMediaSource = function(event) {
    switch(event.index) {
      case 0:
        newPhoto();
        break;
      case 1:
        chooseFromGallery();
        break;
      case event.destructive:
        if(currentImageAdded)  {
          photoButtonBg.remove(currentImageView);
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
    if(currentImageAdded) {
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
        var cropRect = event.cropRect;
        currentMedia = event.media;

        if(currentImageAdded)  {
          scrollView.remove(menu);
          currentImageAdded = false;
        }

        currentImageView = Ti.UI.createImageView({
                             top: 330,
                             left: ((200 - 44)/2),
                             image: event.media,
                             height: 100,
                             borderRadius: 2
                           });

        currentImageView.addEventListener('click', function(event) {
          displayMediaChooser();
        });
        scrollView.add(currentImageView);
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
    Ti.Media.openPhotoGallery({
      mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
      success: function(event) {
        var cropRect = event.cropRect;
        currentMedia = event.media;

        if(currentImageAdded)  {
          scrollView.remove(menu);
          currentImageAdded = false;
        }

        currentImageView = Ti.UI.createImageView({
                             top: 330,
                             image: event.media
                           });

        currentImageView.addEventListener('click', function(event) {
          displayMediaChooser();
        });
        scrollView.add(currentImageView);
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
              ind.show();
              photoButtonBg.hide();
              
              var newData = JSON.parse(this.responseText);
              var imagexhr = Titanium.Network.createHTTPClient();
        
              imagexhr.onload = function() {
                Ti.App.fireEvent('hide_indicator',{});
                showSuccess();
              };
              
              imagexhr.onsendstream = function(e)
              {
                ind.value = e.progress;
                Ti.App.fireEvent('change_title', { title: 'Submitting' });
              };
              imagexhr.open('PUT', "http://data.pdxapi.com/food_carts/" + newData.id + "/attachment?rev=" + newData.rev);
              imagexhr.setRequestHeader('Content-Type', 'application/jpeg');
              imagexhr.setRequestHeader('Accept', 'application/jpeg');
              imagexhr.send(currentMedia);
            } else {
              showSuccess(JSON.parse(this.responseText));
            }
          };
        
          xhr.open('PUT', "http://data.pdxapi.com/food_carts/" + data._id);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send(jsonData);
  
  });
  editWin.add(scrollView);
}

var xhr = Titanium.Network.createHTTPClient();
xhr.onload = function() {
    data = JSON.parse(this.responseText);
    cartLocation = data.geometry;
    showForm(data);
};

xhr.open("GET", "http://data.pdxapi.com/food_carts/"+editWin.couch_id);
xhr.send();