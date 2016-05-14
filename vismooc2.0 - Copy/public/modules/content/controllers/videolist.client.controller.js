'use strict';

angular.module('content').controller('videoListController', ['$scope', 'communicator', 'dataManager', 'session',
  function($scope, communicator, dataManager, session){

    $scope.videoList = [];
    $scope.courseList = [];
    $scope.selectedVideoId = -1;
    $scope.selectedCourse = -1;

    var updateVideoList = function(courseID) {
      dataManager.getVideoList(courseID,function(data){
          $scope.videoList = data;
          var hashVideo = {};
          angular.forEach(data, function(group, igroup){
            angular.forEach(group.videos, function(v, iv){
              hashVideo[v.videoId] = '#v_group' + igroup;
            });
          });
          $scope.hashVideo = hashVideo;
      });
    };

    $scope.setSelected = function (video) {
      $scope.selectedVideoId = video.videoId;
      video.currentTime = 0;
      session.set('selectedVideo', video);
      communicator.changeVideo(video);
    };

    $scope.$watch('selectedCourse.courseId', function () {
      if ($scope.selectedCourse.courseId) {
        session.set('selectedCourse', $scope.selectedCourse.courseId);
        updateVideoList($scope.selectedCourse.courseId);
        communicator.changeCourse($scope.selectedCourse.courseId);
      }
    });

    communicator.onChangeVideo($scope, function(video){
      if ($scope.selectedVideoId != video.videoId){
          $scope.selectedVideoId = video.videoId;
          $('#videolist').scrollTop(0);
          $('#videolist').scrollTop($($scope.hashVideo[video.videoId]).position().top-50);
      }
    });

    dataManager.getCourseList(function(data){
        $scope.courseList = data;
    });
    
  }
]);

