'use strict';

angular.module('vistoolkit').controller('forumSocialNetworkController', ['$scope', 'communicator', 'dataManager', '$timeout',
  function($scope, communicator, dataManager, $timeout){
      $scope.courseID = -1;
      $scope.option = {
        width: 1200,
        height: 600
      };

      $scope.threshold={value:3};
      $scope.showInfo="No selection";

      communicator.onChangeCourse($scope, function (courseID) {
        if (courseID >= 0) {
          $scope.courseID = courseID;
          var threshold=$scope.threshold;
          dataManager.getForumSocialNetwork(courseID, threshold.value, function(data){
             $scope.datacopy = data;
             $scope.data = data;
          });
            dataManager.getDemographicData($scope.courseID, function(data) {
                $scope.geodata= data;
            });
        }
      });

      communicator.onGraphUsername($scope,function(data){
          var userId=data[0];
          var username=data[1];
          $scope.showInfo='Selected user: '+username;

          dataManager.getWordCloudData($scope.courseID, userId, function(data){
              $scope.wordCloudData = data;
          });
      });


      $scope.clearSelection=function(){
          console.log('enter clear')

          $scope.wordCloudData=[];
          $scope.showInfo="No selection";
          $scope.countrycode='-';
      }

      $scope.countrycode='';
      communicator.onCode3($scope,function(data){
          $scope.$apply(function(){
              $scope.countrycode=data;
              $scope.showInfo='Selected country: '+data;
          });
          dataManager.getWordCloudDataByGeo($scope.courseID, $scope.countrycode, function(data){
              $scope.wordCloudData = data;
          });
      });

      $scope.changeThreshold=function(){
        console.log($scope.threshold.value);
            dataManager.getForumSocialNetwork($scope.courseID, $scope.threshold.value, function(data){
              console.log('data changed')
              console.log($scope)
              $scope.data= data;
              $scope.datacopy= data;
            });
      }
  }
]);






