'use strict';

angular.module('vistoolkit').controller('correlationController', ['$scope', '$window', '$http', 'communicator', '$cookieStore',
	function($scope, $window, $http, communicator, $cookieStore) {
		// Parrellel controller logic
		// ...
        $scope.courseId = -1;

		var mainPath, _startTime, getURL;
		mainPath = window.location.pathname;

		var getServerData = function(callback){
			//$scope.startTime = _startTime;

			getURL = mainPath + 'ParallelCoor?courseId=' + $scope.courseId;

			$http.get(getURL).success(function(data){
                console.log(data);
				callback(data);
			})
		};

		var callFunc = function(data){
            var arr = [];
            var axisKeys = Object.keys(data[0]);
            var peakNum = data[0].peaks.length;

            for(var i = 0; i < data.length; i++){
                var obj = {};
                for(var j = 0; j < axisKeys.length; j++){
                    if(axisKeys[j] == 'peaks' || axisKeys[j] == 'userId')  continue;
                    obj[axisKeys[j]] = data[i][axisKeys[j]];
                }
                for(var j = 0; j < peakNum; j++){
                    obj['Peak' + j] = data[i]['peaks'][j];
                }
                var numDistr = [];
                var sum = 0;
                for(var j = 0; j < peakNum; j++){
                    var keyName = 'Peak' + j;
                    if(obj[keyName] > 0){
                        numDistr.push(obj[keyName]);
                        sum += obj[keyName];
                    }
                }
                if(sum > 10){
                    obj['activeness']  = sum/numDistr.length;
                }
                else    obj['activeness']   = 0;
                arr.push(obj);
            }
            $scope.PCData = [];
            $scope.PCData.push($scope.courseId);
            $scope.PCData.push(peakNum);
            $scope.PCData.push(arr);
		};

        communicator.onChangeCourse($scope, function(courseId){
            $scope.courseId = courseId;
            getServerData(callFunc);
        });
	}
]);
