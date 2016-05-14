'use strict';

angular.module('vistoolkit').controller('temporalInfoController', ['$scope', 'communicator', 'dataManager',
  function($scope, communicator, dataManager){
    $scope.videoID = -1;
    $scope.courseID = -1;
    communicator.onChangeCourse($scope, function(courseID){
      $scope.courseID = courseID;
    });
    communicator.onChangeVideo($scope, function(videoInfo){
      $scope.videoID = videoInfo.videoId;
      dataManager.getDailyHotnessByVideo($scope.courseID, $scope.videoID,function(data){
        $scope.hotnessData = data;
      });

    });
    $scope.filterByDate = function(date){
      communicator.filterDate({
        startDate: date.getTime(),
        endDate: date.getTime()+7*24*3600*1000
      });
    }
  }
]);

