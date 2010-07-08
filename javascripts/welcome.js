Titanium.include('../javascripts/application.js');
var win = Ti.UI.currentWindow;

var scrollView = Ti.UI.createScrollView({
  top: 0,
  left: 0,
  contentHeight: 'auto',
  contentWidth: 320
});

var welcomeLabel = Ti.UI.createLabel({
  top: 10,
  left: 10,
  width: 300,
  height: 'auto',
  color: '#fff',
	font:{fontSize:13, fontWeight:'normal'},
  text: "1) All data that you enter into this application will become freely accessible public data, will be stored on PDXAPI.com and will automatically be shared with all other users of the Portland Food Cart Finder! Think of this app like a wiki for food cart info. You can view the data from a desktop computer by visiting http://www.foodcartpages.com.\n\n" +
        "2) Personal privacy. Your personal information will not be collected on this application. I encourage thoughtful, opinion free reporting. This application is not intended to review or pass judgment on food carts. It's purpose is to locate, list hours of operation and store a current menu photo.\n\n" +
        "If you have any questions or concerns, please email me!\n\n" +
        "Max Ogden, max@maxogden.com"
});
scrollView.add(welcomeLabel);

var tosButton = Ti.UI.createButton({
  width: 301,
  height: 57,
  top: (Ti.Platform.name == 'android' ? 340 : 320),
  backgroundImage: '../images/button_dark_off.png',
  backgroundSelectedImage: '../images/button_dark_on.png',
	font:{fontSize:16, fontWeight:'bold'},
	color:"#fff",
  title: 'Okay'
});
tosButton.addEventListener('click', function() {
  Ti.App.fireEvent('remove_welcome');
});
scrollView.add(tosButton);

win.add(scrollView);
