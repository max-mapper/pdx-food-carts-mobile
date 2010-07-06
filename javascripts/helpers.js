var DateHelper = {
  // Takes the format of "Jan 15, 2007 15:45:00 GMT" and converts it to a relative time
  // Ruby strftime: %b %d, %Y %H:%M:%S GMT
  time_ago_in_words_with_parsing: function(from) {
    var date = new Date; 
    date.setTime(Date.parse(from));
    return this.time_ago_in_words(date);
  },
  
  time_ago_in_words: function(from) {
    return this.distance_of_time_in_words(new Date, from);
  },
 
  distance_of_time_in_words: function(to, from) {
    var distance_in_seconds = ((to - from) / 1000);
    var distance_in_minutes = Math.floor(distance_in_seconds / 60);
 
    if (distance_in_minutes == 0) { return 'less than a minute ago'; }
    if (distance_in_minutes == 1) { return 'a minute ago'; }
    if (distance_in_minutes < 45) { return distance_in_minutes + ' minutes ago'; }
    if (distance_in_minutes < 90) { return 'about 1 hour ago'; }
    if (distance_in_minutes < 1440) { return 'about ' + Math.floor(distance_in_minutes / 60) + ' hours ago'; }
    if (distance_in_minutes < 2880) { return '1 day ago'; }
    if (distance_in_minutes < 43200) { return Math.floor(distance_in_minutes / 1440) + ' days ago'; }
    if (distance_in_minutes < 86400) { return 'about 1 month ago'; }
    if (distance_in_minutes < 525960) { return Math.floor(distance_in_minutes / 43200) + ' months ago'; }
    if (distance_in_minutes < 1051199) { return 'about 1 year ago'; }
 
    return 'over ' + (distance_in_minutes / 525960).floor() + ' years ago';
  }
};

var Enumerable = {
  map: function(array, fn) {
    if (typeof array.map == "function") {
      return array.map(fn);
    } else {
      var r = [];
      var l = array.length;
      for(i=0;i<l;i++) {
        r.push(fn(array[i]));
      }
      return r;
    }
  }
}

var GeoHelper = {
  /**
   * Get the screen boundaries as latitude and longitude values 
   */
  getMapBounds: function(region) {
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
}

var DebugHelper = {
  dumpObject: function(thisControl) {
      // Do we want funcs to be included?
      var incFuncs = true;
      // thisControl is the item you wish to debug
      for(p in thisControl) {
          // Define a default type
          var typeName = "property";
          try {
              // Grab a handle to allow us to check
              var typeHandle = thisControl[p];
              if (typeof typeHandle == "function") {
                  // We have a function
                  if (!incFuncs) {
                      // Ignore it
                      continue;
                  }
                  typeName = "function";
              }
          } catch (e) {
              // Oops - we have a problem - not an issue
              Ti.API.info("Exception with "+p);
          }
          // Basic info
          Ti.API.info("["+typeName+"] "+p);
          if (typeName != "function") {
              // Only display the contents of properties or array elements
              Ti.API.info("Value: "+thisControl[p]);
          }
      }
  }
}

