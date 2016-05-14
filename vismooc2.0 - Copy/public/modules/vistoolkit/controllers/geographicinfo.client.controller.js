'use strict';

angular.module('vistoolkit').controller('geographicInfoController', ['$scope', 'communicator', 'dataManager',
  function($scope, communicator, dataManager){
    $scope.demographicInfo = -1;
    communicator.onChangeCourse($scope, function(courseID){
      if (courseID) {
        dataManager.getDemographicData(courseID, function(data) {
            $scope.demographicInfo = data;
        });
      }
    });

    $scope.filterByCountry = function(countryID){
      communicator.filterCountry(countryID);
    };
  }
]);
