'use strict';

angular.module('vistoolkit').controller('sentimentController', ['$scope', 'communicator', 'dataManager',
  function($scope, communicator, dataManager){
      $scope.courseID = -1;
      $scope.option = {
        width: 1200,
        height: 600
      };

      communicator.onChangeCourse($scope, function (courseID) {
        if (courseID >= 0) {
          $scope.courseID = courseID;

          dataManager.getSentiment(courseID, function(data){
              $scope.sentimentData = data;
              $scope.sentimentData2 = undefined;
              $scope.showGoBack = false;
          });
        }
      });

      $scope.clickFunc = function() {
        $scope.sentimentData2 = undefined;
      }

      communicator.onSentiment($scope,function(data){
        if(data === 'delete'){
          $scope.showGoBack = false;
          $scope.sentimentData2 = undefined;
          $scope.$apply();
        }else{
          $scope.showGoBack = true;
          dataManager.getSentimentDetails($scope.courseID, data.days, function(data){
              $scope.sentimentData2 = data;
          });
        }
      });
  }
]);



