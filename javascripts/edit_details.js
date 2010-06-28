Titanium.include('../javascripts/application.js');
Titanium.include('../javascripts/helpers.js');
var currentImageView;
var currentImageAdded = false;
var data;
var editWin = Titanium.UI.currentWindow;
var existingMenu = editWin.existingMenu;
var couchUrl = "http://data.pdxapi.com/food_carts/"+editWin.couch_id;

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

  var hoursForm = Ti.UI.createView({
    top: 250,
    left: 10,
    width: 300,
    height: 110,
    backgroundColor:'#333',
    borderRadius:6
  });

  var hoursTitleLabel = Ti.UI.createLabel({
    top: 5,
    left: 10,
    width: 300,
    height: 30,
    color: '#fff',
  	font:{fontSize:18, fontWeight:'bold'},
    text:'Hours'
  });
  hoursForm.add(hoursTitleLabel);

  var hoursField = Titanium.UI.createTextArea({
  	value:data.hours,
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
  hoursForm.add(hoursField);
  hoursField.addEventListener("return",function(e){
    hoursField.blur();
  });
  hoursForm.add(hoursField);
  scrollView.add(hoursForm);

  var photoForm = Ti.UI.createView({
    top: 370,
    left: 10,
    width: 300,
    height: 170,
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
  
  var newButtonOffset = 10;
  
  if (existingMenu == true) {
    var menuUrl = couchUrl + "/attachment";

  	var menuImage = Ti.UI.createImageView({
  		url:menuUrl,
  		top:40,
  		height:50,
  		width: 50
  	});
    
    photoForm.add(menuImage); 
    newButtonOffset = 100;
  }

  var photoButtonBg = Ti.UI.createView({
    top: newButtonOffset,
    left: ((photoForm.width - 200)/2),
    width: 200,
    height: 42,
    backgroundColor: '#000',
    borderRadius: 5
  });

  var photoAddButton = Ti.UI.createButton({
    top: 1,
    left: 1,
    width: 200,
    height: 42,
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
                          left: ((200 - 44)/2),
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

  var saveButton = Titanium.UI.createButton({
  	systemButton:Titanium.UI.iPhone.SystemButton.SAVE
  });

	editWin.rightNavButton = saveButton;

  saveButton.addEventListener('click', function() {
    var cartData = { "_id"          : data._id,
                     "_rev"         : data._rev,
                     "name"         : nameField.value,
                     "hours"        : hoursField.value,
                     "description"  : descriptionField.value,
                     "geometry"     : data.geometry
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
          showSuccess();
        };
        imagexhr.open('PUT', "http://data.pdxapi.com/food_carts/" + newData.id + "/attachment?rev=" + newData.rev);
        imagexhr.setRequestHeader('Content-Type', 'application/jpeg');
        imagexhr.setRequestHeader('Accept', 'application/jpeg');
        imagexhr.send(currentMedia);
      } else {
        showSuccess();
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
    showForm(data);
};

xhr.open("GET", "http://data.pdxapi.com/food_carts/"+editWin.couch_id);
xhr.send();