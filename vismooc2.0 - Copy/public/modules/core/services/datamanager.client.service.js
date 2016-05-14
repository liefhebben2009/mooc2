'use strict';

angular.module('core').factory('dataManager', ['$http',
    function($http) {

        var mainPath = window.location.pathname;

        var getSentiment = function(courseId, callback){
            var tmpURL = mainPath + 'getSentiment?courseId='+courseId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getWordCloudData= function(courseId, userId, callback){
            var tmpURL = mainPath + 'getWordCloudData?courseId='+courseId + '&userId=' + userId;
            console.log(userId)
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getWordCloudDataByGeo= function(courseId, code3, callback){
            var tmpURL = mainPath + 'getWordCloudDataByGeo?courseId='+courseId + '&countryCode=' + code3;
            console.log(code3)
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getSentimentDetails= function(courseId, days, callback){
            var tmpURL = mainPath + 'getSentimentDetails?courseId=' + courseId + '&days=' + days;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getForumSocialNetwork = function(courseId, filterLevel, callback){
            if(filterLevel===0 || filterLevel){
            }else{
                filterLevel=0;
            }
            var tmpURL = mainPath + 'modules/vistoolkit/data/graph/' + courseId + '-' + filterLevel + ".json";
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getActionCountInfo = function(courseId,videoId, callback){
            var tmpURL = mainPath + 'getContentBasedData?type=action&courseId='+courseId+'&videoId=' + videoId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getSeekInfo = function(courseId,videoId, callback){
            var tmpURL = mainPath + 'getContentBasedData?type=seek&courseId='+courseId+'&videoId=' + videoId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getActionCountInfoByCountry = function(courseId, videoId,country,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=action&courseId='+courseId+'&videoId=' + videoId+ "&country=" + country;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };


        var getSeekInfoByCountry = function(courseId, videoId,country,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=seek&courseId='+courseId+'&videoId=' + videoId+ "&country=" + country;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getActionCountInfoByTime = function(courseId, videoId,start,end,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=action&courseId='+courseId+'&videoId=' + videoId+ "&startTime=" + start + "&endTime=" + end;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getSeekInfoByTime = function(courseId, videoId,start,end,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=seek&courseId='+courseId+'&videoId=' + videoId+ "&startTime=" + start + "&endTime=" + end;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getDailyHotnessByVideo = function(courseId, videoId,callback){
            var tmpURL = mainPath + 'getVideoPop?courseId='+courseId+'&videoId=' + videoId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getDemographicData = function(courseId,callback){
            var tmpURL = mainPath + 'getDemographicData?courseId='+courseId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getCourseInfo = function(courseId, callback){
            var tmpURL = mainPath + 'getCourseInfo?courseId=' + courseId ;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getCourseList = function(callback){
            var tmpURL = mainPath + 'getCourseList' ;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getHotness = function(courseId, callback){
            var tmpURL = mainPath + 'getHotness?courseId='+courseId ;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        var getVideoList = function(courseId, callback){
            var tmpURL = mainPath + 'getVideoList?courseId='+courseId ;
            $http.get(tmpURL).success( function(data){
                data.forEach(function(week){
                    week.videos.forEach(function(video){
                        if(! video.videoSource){
                            video.videoSource = "";
                        }else{
                            if(video.videoSource.substring(0, 4)==='http'){
                            }else{
                                video.videoSource = video.videoSource;
                            }
                        }
                    })
                });
                callback(data);
            });
        };

        // Public API
        return {
            'getSentiment': getSentiment,
            'getWordCloudData': getWordCloudData,
            'getWordCloudDataByGeo': getWordCloudDataByGeo,
            'getSentimentDetails': getSentimentDetails,
            'getForumSocialNetwork': getForumSocialNetwork,
            'getActionCountInfo': getActionCountInfo,
            'getSeekInfo': getSeekInfo,
            'getActionCountInfoByCountry': getActionCountInfoByCountry,
            'getSeekInfoByCountry': getSeekInfoByCountry,
            'getActionCountInfoByTime': getActionCountInfoByTime,
            'getSeekInfoByTime': getSeekInfoByTime,
            'getDailyHotnessByVideo': getDailyHotnessByVideo,
            'getDemographicData': getDemographicData,
            'getCourseInfo': getCourseInfo,
            'getCourseList': getCourseList,
            'getHotness': getHotness,
            'getVideoList': getVideoList
        };
    }
]);