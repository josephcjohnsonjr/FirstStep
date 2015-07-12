(function() {
  var app = angular.module('gemStore', []);

  app.controller('StoreController', function() {
    this.products = gems;
  });
 })();