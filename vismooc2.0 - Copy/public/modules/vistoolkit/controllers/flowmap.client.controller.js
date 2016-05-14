'use strict';

angular.module('vistoolkit').controller('flowMapController', ['$scope', '$window', '$http', 'communicator', '$cookieStore', '$sce', 'dataManager',
	function($scope, $window, $http, communicator, $cookieStore, $sce, dataManager) {

        $scope.courseId = -1;
        $scope.videoId = -1;
        $scope.windowHeight = $($window).height();

    	communicator.onChangeCourse($scope, function(courseID){
      		$scope.courseId = courseID;
    	});

        // videogular
        $scope.config = {
            preload: "none",
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
            ],
            theme: {
                url: "lib/videogular-themes-default/videogular.css"
            },
            plugins: {
                controls: {
                    autoHide: true,
                    autoHideTime: 2000
                }
            }
        };

        $scope.onPlayerReady = function($API) {
            $scope.videogularAPI = $API;
        };

		var mainPath = window.location.pathname,
            videoId = 0,
            startTime = 0,
            endTime = 3,
            brushStart = false,
            isBrush = false,
            isFinished = false,
			getURL;

		var getServerData = function(videoId, startTime, endTime, callback){
			getURL = mainPath + 'animationtest?videoId=' + videoId + '&courseId=' + $scope.courseId + '&startTime=' + startTime + '&endTime=' + endTime;
			$http.get(getURL).success(function(data){
                console.log(getURL);
					callback(data);
			})
		};

		var callFunc = function(data){
			$scope.ClickAttackData = [];
            $scope.ClickAttackData.push($scope.courseId);
            $scope.ClickAttackData.push($scope.videoLength);
            $scope.ClickAttackData.push(isBrush);
            $scope.ClickAttackData.push(isFinished);
            $scope.ClickAttackData.push(startTime);
            $scope.ClickAttackData.push(endTime);
            $scope.ClickAttackData.push(data);
		};

        $scope.mouseDownRes = function(){
            startTime = this.videoTime;
            isFinished = false;
            brushStart =true;
        }

        $scope.moveRes = function(){
            if(brushStart){
                isBrush = true;
                endTime = this.videoTime;
                $scope.ClickAttackData = [];
                $scope.ClickAttackData.push($scope.courseId);
                $scope.ClickAttackData.push($scope.videoLength);
                $scope.ClickAttackData.push(isBrush);
                $scope.ClickAttackData.push(isFinished);
                $scope.ClickAttackData.push(startTime);
                $scope.ClickAttackData.push(endTime);
            }
        }

		$scope.mouseUpRes = function(){
			videoId = $scope.videoId;
            endTime = this.videoTime;
            isFinished = true;
            if(!isBrush){
                startTime = endTime;
                endTime = (+startTime) + 3;
            }
            if((+endTime) < (+startTime)){
                var temp = endTime;
                endTime = startTime;
                startTime = temp;
            }
            if((+endTime) < (+startTime) + 3) endTime = (+startTime) + 3;
			getServerData(videoId, startTime, endTime, callFunc);
            isBrush =false;
            brushStart = false;
            console.log(startTime);
            $scope.videogularAPI.seekTime(startTime);
		}

        // draw stacked graph begin
        var colors = d3.scale.actionCategory();
        colors('seeked');
        colors('pause');
        colors('play');
        colors('stalled');
        colors('error');
        colors('ratechange');

        $scope.multiChartOptions = {
            chart: {
                type: 'stackedAreaChart',
                height: 300,
                width: 794.3,
                margin : {
                    top: 20,
                    right: 0,
                    bottom: 60,
                    left: 80
                },
                x: function(d){return d.x;},
                y: function(d){return d.y;},
                useVoronoi: false,
                clipEdge: true,
                transitionDuration: 500,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        var sec=d%60;
                        var min=Math.floor(d/60);
                        if(sec===0){
                          sec='00';
                        }
                        return d3.time.format(min+'\''+sec+'\"');
                    }                               
                },
                yAxis: {
                    tickFormat: function(d){
                        return d;
                    }
                }
            }
        };

        var processData = function(data) {
          if (!data.clicks) return;
          $scope.multiChartdata = data.clicks.map(function (dat) {
            var length = dat.data.length;
            var result = dat.data.slice(3, length - 3).aggregate(3).map(function (dd, i) {
              return {
                x: i * 3,
                y: Math.floor(dd)
              };
            });
            return {
              key: dat.type,
              values: result,
              color: colors(dat.type)
            };
          });
        };

        // draw stacked graph over
		communicator.onChangeVideo($scope, function(videoInfo){
      		$scope.videoId = videoInfo.videoId;
            $scope.videoLength = videoInfo.videoLength + 1;
            $scope.$$childHead.videoTime = 0;
            $scope.config.sources = [
              {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/mp4"},
              {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/webm"},
              {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/ogg"}
            ];
            startTime = 0;
            endTime = 3;
            getServerData(videoId, startTime, endTime, callFunc);
            dataManager.getActionCountInfo($scope.courseId, videoInfo.videoId, processData);
    	});
	}
]);
