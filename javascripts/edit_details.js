Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');
var currentImageView;
var currentImageAdded = false;
var data;
var win = Titanium.UI.currentWindow;

function showSuccess(message) {    
  Ti.UI.createAlertDialog({
  	title:'Success!',
  	message: message
  }).show();
}

function showForm(data) {
  // See
  var scrollView = Ti.UI.createScrollView({
    top:0,
    left:0,
    contentWidth:320,
    contentHeight:710,
    height:480,
    width:320,
    verticalBounce: false
  });

  var nameForm = Ti.UI.createView({
    top: 10,
    left: 10,
    width: 300,
    height: 110,
    backgroundColor:'#333',
    borderRadius:6
  });

  var nameTitleLabel = Ti.UI.createLabel({
    top: 5,
    left: 10,
    width: 300,
    height: 30,
    color: '#fff',
  	font:{fontSize:18, fontWeight:'bold'},
    text:'Cart Name'
  });
  nameForm.add(nameTitleLabel);

  var nameField = Titanium.UI.createTextArea({
  	value:data.name,
  	height:70,
  	width:300,
  	top:40,
  	font:{fontSize:20, fontWeight:'bold'},
  	textAlign:'left',
  	borderWidth:2,
  	borderColor:'#bbb',
  	borderRadius:5,
  	suppressReturn:true
  });
  nameForm.add(nameField);
  nameField.addEventListener("return",function(e){
    nameField.blur();
  });
  nameForm.add(nameField);
  scrollView.add(nameForm);
  
  var descriptionForm = Ti.UI.createView({
    top: 130,
    left: 10,
    width: 300,
    height: 110,
    backgroundColor:'#333',
    borderRadius:6
  });

  var descriptionTitleLabel = Ti.UI.createLabel({
    top: 5,
    left: 10,
    width: 300,
    height: 30,
    color: '#fff',
  	font:{fontSize:18, fontWeight:'bold'},
    text:'Description'
  });
  descriptionForm.add(descriptionTitleLabel);

  var descriptionField = Titanium.UI.createTextArea({
  	value:data.description,
  	height:70,
  	width:300,
  	top:40,
  	font:{fontSize:12},
  	textAlign:'left',
  	borderWidth:2,
  	borderColor:'#bbb',
  	borderRadius:5,
  	suppressReturn:true
  });
  descriptionForm.add(descriptionField);
  descriptionField.addEventListener("return",function(e){
    descriptionField.blur();
  });
  descriptionForm.add(descriptionField);
  scrollView.add(descriptionForm);
  
  var photoForm = Ti.UI.createView({
    top: 250,
    left: 10,
    width: 300,
    height: 110,
    backgroundColor:'#333',
    borderRadius:6
  });
  
  var photoTitleLabel = Ti.UI.createLabel({
    top: 5,
    left: 10,
    width: 300,
    height: 30,
    color: '#fff',
   font:{fontSize:18, fontWeight:'bold'},
    text:'Menu photo'
  });
  
  var photoButtonBg = Ti.UI.createView({
    top: 40,
    left: ((photoForm.width - 46)/2),
    width: 46,
    height: 46,
    backgroundColor: '#000',
    borderRadius: 5
  });
  
  var photoAddButton = Ti.UI.createButton({
    top: 1,
    left: 1,
    width: 44,
    height: 44,
    backgroundImage: '../images/icon_camera.png',
    backgroundSelectedImage: '../images/icon_camera.png',
    backgroundDisabledImage: '../images/icon_camera.png'
  });
  
  photoAddButton.addEventListener('click', function() {
    displayMediaChooser();
  });
  
  photoForm.add(photoTitleLabel);
  photoButtonBg.add(photoAddButton);
  photoForm.add(photoButtonBg);
  scrollView.add(photoForm);
  
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
    title: 'Choose media'
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
          photoButtonBg.remove(currentImageView);
          currentImageAdded = false;
        }

        currentImageView = Ti.UI.createImageView({
                          top: 1,
                          left: 1,
                          image: event.media,
                          height: 44,
                          width: 44,
                          borderRadius: 2
                        });

        currentImageView.addEventListener('click', function(event) {
          displayMediaChooser();
        });
        photoButtonBg.add(currentImageView);
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
          photoButtonBg.remove(currentImageView);
          currentImageAdded = false;
        }

        currentImageView = Ti.UI.createImageView({
                          top: 1,
                          left: 1,
                          image: event.media,
                          height: 44,
                          width: 44,
                          borderRadius: 2
                        });

        currentImageView.addEventListener('click', function(event) {
          displayMediaChooser();
        });
        photoButtonBg.add(currentImageView);
        currentImageAdded = true;
      }
    });
  };

  var saveButton = Ti.UI.createButton({
    title:'Save',
    height:40,
    width:200,
    top:370  
  });
  saveButton.addEventListener('click', function() {
    var cartData = { "_id"          : data._id,
                     "_rev"         : data._rev,
                     "name"         : nameField.value,
                     "description"  : descriptionField.value,
                     "geometry"     : data.geometry
                   }
    var jsonData = JSON.stringify(cartData);
    var xhr = Titanium.Network.createHTTPClient();

    xhr.onload = function() {
      var newData = JSON.parse(this.responseText);
      var imagexhr = Titanium.Network.createHTTPClient();
      
      imagexhr.onload = function() {
        Ti.API.info(this.status);
        Ti.API.info(this.responseText);
        showSuccess('Your photo has uploaded successfully.');
      };
      Ti.API.info("http://data.pdxapi.com/food_carts/" + newData.id + "/attachment?rev=" + newData.rev);
      imagexhr.open('PUT', "http://data.pdxapi.com/food_carts/" + newData.id + "/attachment?rev=" + newData.rev);
      imagexhr.setRequestHeader('Content-Type', 'application/jpeg');
      imagexhr.setRequestHeader('Accept', 'application/jpeg');
      imagexhr.send(currentMedia);
    };

    xhr.open('PUT', "http://data.pdxapi.com/food_carts/" + data._id);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(jsonData);
    
  });
  scrollView.add(saveButton);
  win.add(scrollView);
}

var xhr = Titanium.Network.createHTTPClient();
xhr.onload = function() {
    data = JSON.parse(this.responseText);    
    showForm(data);
}; 
xhr.open("GET", "http://data.pdxapi.com/food_carts/"+win.couch_id);
xhr.send();