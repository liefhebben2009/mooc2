'use strict';

angular.module('vistoolkit').controller('videoPopInfoController', ['$scope', 'communicator', 'dataManager',
  function($scope, communicator, dataManager){
    $scope.courseID = -1;
    $scope.hotnessData = [];
    communicator.onChangeCourse($scope, function(courseID){
      $scope.courseId = courseID;

      dataManager.getHotness(courseID, function(data){
          $scope.courseID = courseID;
          $scope.data = [{
              key: "Hotness",
              values: data.map(function(d,i){
                  return {
                      "label": d.videoId,
                      "value": d.pop,
                      "color": "#428bca"
                  }
              })
          }];
      });
    });

    $scope.options = {
      chart: {
        type: 'discreteBarChart',
        height: 280,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 65
        },
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        // showValues: true,
        valueFormat: function(d){
          return d3.format(',.1f')(d/1000)+"k";
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'Video ID'
          // axisLabelDistance: 1
        },
        yAxis: {
          axisLabel: 'Popularity (#user)',
          axisLabelDistance: 20
        }
      }
    }
  }
]);