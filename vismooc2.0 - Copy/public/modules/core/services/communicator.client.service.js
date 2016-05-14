'use strict';

angular.module('core').factory('communicator', ['$window', '$rootScope',
	function($window, $rootScope) {

		var SLIDECOMPONENT_MESSAGE = 'slideComponentChanged',
			SHOTIMG_MESSAGE = 'shotImgChanged',
			FLOWMAPSLIDE_MESSAGE = 'flowmapSlideChanged',
			SENTIMENT_MESSAGE= 'sentimentChanged',
			GRAPH_USERNAME_MESSAGE= 'graphUsernameChanged',
			CODE3_MESSAGE='code3Changed';

		var CHANGE_COURSE = "changeCourse",
        	CHANGE_VIDEO = "changeVideo",
        	FILTER_COUNTRY = "filterCountry",
        	FILTER_DATE = "filterDate",
        	FILTER_FREQ="filterFreq";

		//sentiment analysis
		var emitSentiment = function(data){
			$rootScope.$broadcast(SENTIMENT_MESSAGE, data);
		};

		var onSentiment = function(scope, callback){
			scope.$on(SENTIMENT_MESSAGE, function(event, data){
				callback(data);
			});
		};

		//click a user in social network
		var emitGraphUsername=function(data){
			$rootScope.$broadcast(GRAPH_USERNAME_MESSAGE, data);
		}

		var onGraphUsername= function(scope, callback){
			scope.$on(GRAPH_USERNAME_MESSAGE, function(event, data){
				callback(data);
			});
		};

		//click a country in the social network
		var emitCode3=function(data){
			$rootScope.$broadcast(CODE3_MESSAGE, data);
		}

		var onCode3= function(scope, callback){
			scope.$on(CODE3_MESSAGE, function(event, data){
				callback(data);
			});
		};

		// change slide bar value in flowmap view
		var emitFlowmapSlideChange = function(data){
			$rootScope.$broadcast(FLOWMAPSLIDE_MESSAGE, data);
		};

		var onFlowmapSlideChange = function(scope, callback){
			scope.$on(FLOWMAPSLIDE_MESSAGE, function(event, data){
				callback(data);
			});
		};

		// ShotImg

		var emitShotImgChange = function(data){
			$rootScope.$broadcast(SHOTIMG_MESSAGE, data);
		};

		var onShotImgChange = function(scope, callback){
			scope.$on(SHOTIMG_MESSAGE, function(event, data){
				callback(data);
			});
		};

		// Slide Component include  preview & leftArrow & rightArrow
		var emitSlideComponentChange = function(data){
			$rootScope.$broadcast(SLIDECOMPONENT_MESSAGE, data);
		};

		var onSlideComponentChange = function(scope, callback){
			scope.$on(SLIDECOMPONENT_MESSAGE, function(event, data){
				callback(data);
			});
		};

		// vismooc

		var changeCourse = function (courseID) {
            $rootScope.$broadcast(CHANGE_COURSE,
                courseID
            );
        };

        var onChangeCourse = function ($scope, handler) {
            $scope.$on(CHANGE_COURSE, function (event, message) {
                handler(message);
            });
        };

        var changeVideo = function (videoID) {
            $rootScope.$broadcast(CHANGE_VIDEO,
                videoID
            );
        };

        var onChangeVideo = function ($scope, handler) {
            $scope.$on(CHANGE_VIDEO, function (event, message) {
                handler(message);
            });
        };

        var filterCountry = function (countryID) {
            $rootScope.$broadcast(FILTER_COUNTRY,
                countryID
            );
        };

        var onFilterCountry = function ($scope, handler) {
            $scope.$on(FILTER_COUNTRY, function (event, message) {
                handler(message);
            });
        }

        var filterDate = function (period) {
            $rootScope.$broadcast(FILTER_DATE,
                period
            );
        };

        var onFilterDate = function ($scope, handler) {
            $scope.$on(FILTER_DATE, function (event, message) {
                handler(message);
            });
        };

		// Public API
		return {
			'emitSlideComponentChange': emitSlideComponentChange,
			'onSlideComponentChange': onSlideComponentChange,
			'emitShotImgChange': emitShotImgChange,
			'onShotImgChange': onShotImgChange,
			'emitFlowmapSlideChange': emitFlowmapSlideChange,
			'onFlowmapSlideChange': onFlowmapSlideChange,
			'emitSentiment': emitSentiment,
			'onSentiment': onSentiment,
			'emitGraphUsername': emitGraphUsername,
			'onGraphUsername': onGraphUsername,
			'emitCode3': emitCode3,
			'onCode3': onCode3,
			'changeCourse': changeCourse,
            'onChangeCourse': onChangeCourse,
            'changeVideo': changeVideo,
            'onChangeVideo': onChangeVideo,
            'filterCountry': filterCountry,
            'onFilterCountry': onFilterCountry,
            'filterDate': filterDate,
            'onFilterDate': onFilterDate
		};
	}
]);
