# angular-geo-converter
Angular service to convert coordinates among different geodetic systems and most used projections

## Introduction
This angular service aims to convert geodetic coordinates, including Lambert 2, WGS84, UTM, NTF, ED50...

## Usage
Add the script dependence of angular-geo-convert.js:

  ```javascript
  <script src="angular-geo-converter.js"></script>
  ```
  
Add the module dependence in your root module of your angular application:

  ```javascript
  angular.module('app',['geoConverter'])
  ```

Call the service in your controller

  ```javascript
  angular.module('app').controller('geoCtrl',['geoConverter',function(geoConverter){
    var coordinates = geoConverter.lambert2wgs(595833,2418928);
    var coordinateX = coordinates.latitude;
    var coordinateY = coordinates.longitude;
  }])
  ```
  
## Convertions
Available convertions in current package:

* Lambert 2 to WGS84

  ```javascript
  var coordinates = geoConverter.lambert2wgs(595833,2418928);
  ```
  
* WGS84 to Lambert 2

  ```javascript
  var coordinates = geoConverter.wgs2lambert(48.3413,2.3198);
  ```
  
* Lambert 2 to ED50

  ```javascript
  var coordinates = geoConverter.lambert2ed50(595833,2418928);
  ```
  
* Lambert 2 to UTM

  ```javascript
  var coordinates = geoConverter.lambert2utm(595833,2418928);
  ```
  
* geoIn to geoOut

 All convertions are supported. Just call like
 
  ```javascript
 var coordinates = geoConverter.geoIn2geoOut(x,y);
  ```
  
  The available geodetic coordinates type for input and output
  
  ```sh
  geoIn : lambert, wgs, ntf, ed50, utm
  geoOut : lambert, wgs, ntf, ed50, utm
  ```
  
License
----

MIT


**Free Software, Hell Yeah!**
