# angular-geo-converter
Angular service to convert coordinates among different geodetic systems and most used projections

## Introduction
This angular service aims to convert geodetic coordinates, including Lambert 2, WGS84, UTM, NTF, ED50...

## Usage
Add the script dependence of angular-geo-convert.js:

  ```javascript
  <script src="angular-geo-convert.js"></script>
  ```
  
Add the module dependence in your root module of your angular application:

  ```javascript
  angular.module('app',['geoConverter'])
  ```

Call the service in your controller

  ```javascript
  angular.module('app').controller('geoCtrl',['geoConverter',function(geoConverter){
    var coordinates = geoConverter.lambert2wgs(595833,2418928);
  }])
  ```
  
  
