'use strict';

angular.module('vistoolkit').controller('courseInfoController', ['$scope', 'communicator', 'dataManager',
  function($scope, communicator, dataManager){
  	$scope.courseInfo = -1;
    communicator.onChangeCourse($scope, function (courseID) {
        if (courseID >= 0) {
            dataManager.getCourseInfo(courseID, function(data){
                $scope.courseInfo = data;
            });
        }
    });
  }
]);
