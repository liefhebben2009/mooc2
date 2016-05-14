'use strict';

angular.module('content').controller('contentController', ['$scope', 'communicator', 'dataManager', '$sce', '$timeout',
  function($scope, communicator, dataManager, $sce, $timeout){

        // videogular
        $scope.config = {
            preload: "none",
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
            ],
            theme: {
                // url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                url: "lib/videogular-themes-default/videogular.css"
            },
            width: $('#viscontent').width(),
            height: 500,
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
        $scope.currentTime = 0;
        $scope.durationTime = 0;
        $scope.selectedCourseId = -1;
        $scope.videoID = -1;
        $scope.period = {};
        $scope.country = "";
        $scope.selectedFreq=0;
        $scope.videoSrc = "";

        $scope.onUpdateTime = function($currentTime, $duration) {
            $scope.$apply(function () {
              var percentage = $currentTime / $duration * 100;
              $('#timeProgressBar').css('width', percentage+'%');
            });
        };

        communicator.onChangeVideo($scope, function(videoInfo){
          if (videoInfo) {
            $scope.videoSrc = videoInfo.videoSource;
            $scope.videoID = videoInfo.videoId;
            $scope.currentTime = videoInfo.currentTime;

            $scope.config.sources = [
              {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/mp4"},
              {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/webm"},
              {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/ogg"}
            ];
            setData(videoInfo.videoId);
            $timeout(function(){
                $scope.videogularAPI.seekTime(videoInfo.currentTime);
            }, 1000)
          }
        });

        communicator.onFilterCountry($scope, function(countryID){
          if (countryID) {
            $scope.country = countryID;
            setData($scope.videoID, {country: countryID});
          }
        });

        communicator.onFilterDate($scope, function(period){
          if (period) {
            $scope.period = period;
            setData($scope.videoID, {period: period});
          }
        });

        communicator.onChangeCourse($scope, function(courseID){
          if (courseID) {
            $scope.selectedCourseId = courseID;
          }
        });

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
         // $scope.$apply();
        };

        var processCoverageData = function(data){
            $scope.coverageData = data;
            $scope.$apply();
        }

        var getWeeks = function(seekData){
            var ret={};
            for(var i=0, len=seekData.length;i<len;i++){
                var tempKey=''+seekData[i].week;
                if(!ret.hasOwnProperty(tempKey)){
                    ret[tempKey]=1;
                } else {
                    ret[tempKey]++;
                }
            }
            return ret;
        }

        var processSeekData = function(data){
            var barHeight=40;
            var barMargin=10;

            $scope.seekData = data;
            $scope.mouseCount++;
            $scope.videoLength=d3.max(data, function(d){return d.prevTime;})

            var weeks=getWeeks($scope.seekData);
            $scope.weeks=weeks;
            var textHeight=Object.keys(weeks).length;

            $scope.dynamicHeight=(barHeight+barMargin)*2*(textHeight);
        };

        $scope.passDataToController=function(touse){
            $scope.seekDataPart=touse;
            console.log("enter sender function")
            $scope.$apply();
        };

        var processSeekDataWithBrush = function(data){
            $scope.seekData = data;
            $scope.$apply();
        };

        $scope.addMouseDown=function(){
            $scope.isMouseOn=false;
            console.log("mouse down")
        };

        $scope.mouseCount=0;

        $scope.addMouseUp=function(){
            $scope.mouseCount++;
            $scope.isMouseOn=true;
            console.log("mouse up")
        };

        $scope.threshold=30;

        function setData(videoID,filter){
            if (filter){
              if (filter.country){
                  dataManager.getActionCountInfoByCountry( $scope.selectedCourseId,videoID,filter.country,processData );
                  dataManager.getSeekInfoByCountry($scope.selectedCourseId,videoID,filter.country,processSeekData);
              } else if (filter.period){
                  dataManager.getActionCountInfoByTime($scope.selectedCourseId,videoID,filter.period.startDate,filter.period.endDate,processData );
                  dataManager.getSeekInfoByTime($scope.selectedCourseId,videoID,filter.period.startDate,filter.period.endDate,$scope.passDataToController);
              }
            } else{
                dataManager.getActionCountInfo($scope.selectedCourseId,videoID,processData);
                dataManager.getSeekInfo($scope.selectedCourseId,videoID,processSeekData);
            }
        };
  }
]);