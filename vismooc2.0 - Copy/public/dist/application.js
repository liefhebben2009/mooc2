'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'peekvisor';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils',
											   'nvd3', 'mgcrea.ngStrap', 'ui.slider', 'ui.bootstrap.buttons', 'angular-intro'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular.module(ApplicationConfiguration.applicationModuleName).run(['$rootScope', '$location', '$window', '$cookieStore',
function ($rootScope, $location, $window, $cookieStore) {
    $rootScope.go = function (path, pageAnimationClass) {

        if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
            $rootScope.pageAnimationClass = 'crossFade';
        }
        
        else { // Use the specified animation
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }
        
        else { // Go to the specified path
            $location.path(path);
        }
    };

    var shotImg = ['./img/empty.png', './img/empty.png', './img/empty.png', './img/empty.png', './img/empty.png', './img/empty.png'];
    $cookieStore.put('shotImg', shotImg);
}]);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('peakanalysis');

var siteRootPath = window.location.pathname;

'use strict';

// Use application configuration module to register a new module

ApplicationConfiguration.registerModule('vismooc',[
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
    ]);

videojs.options.flash.swf = './lib/vismoocjs/video-js.swf';

var visMOOCApp = angular.module('vismooc');

var colors = d3.scale.actionCategory();
this.colors('seeked');
this.colors('pause');
this.colors('play');
this.colors('stalled');
this.colors('error');
this.colors('ratechange');

var serviceID = 'communicationService';
var serviceData = 'dataManagerService';


visMOOCApp.config(["$sceDelegateProvider", function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://w02.hkvu.hk/edX/**',
    'https://www.youtube.com**'
  ]);
}]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/content');

		// Home state routing
		$stateProvider.
		state('testview', {
			url: '/testview',
			templateUrl: 'modules/core/views/testview.client.view.html'
		}).
		state('peak', {
			url: '/peak',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'pip', '$rootScope',
	function($scope, $location, pip, $rootScope) {
		// This provides Authentication context.
		$scope.slideComponent = false;

		$scope.goView = function(action) {
			var nowURL = $location.path();
			if (action == 'next') {
				if (nowURL.indexOf('graphmds') != -1)
					$rootScope.go('/peak/flowmap', 'slideLeft');
				else if (nowURL.indexOf('flowmap') != -1)
					$rootScope.go('/peak/parrellel', 'slideLeft');
				else if (nowURL.indexOf('parrellel') != -1)
					$rootScope.go('/peak/entrance', 'crossFade');
			} else
			if (action == 'prev') {
				if (nowURL.indexOf('graphmds') != -1)
					$rootScope.go('/peak/entrance', 'crossFade');
				else if (nowURL.indexOf('flowmap') != -1)
					$rootScope.go('/peak/graphmds', 'slideRight');
				else if (nowURL.indexOf('parrellel') != -1)
					$rootScope.go('/peak/flowmap', 'slideRight');
			}
		};

		pip.onSlideComponentChange($scope, function(data){
			if (data == 'show') 
				$scope.slideComponent = true;
			else if (data == 'hide') 
				$scope.slideComponent = false;
		});
	}
]);
'use strict';


angular.module('core').controller('LeftDockController', ['$scope', '$window', '$http', '$cookieStore',
	function($scope, $window, $http, $cookieStore) {
		// This provides Authentication context.
		var initializeVideoList = function(){
		    var docked = 0;

		    $("#dock li ul").height($(window).height());

		    $("#dock .dock-keleyi-com").click(function () {
		        $(this).parent().parent().addClass("docked").removeClass("free");

		        docked += 1;
		        var dockH = ($(window).height()) / docked;
		        var dockT = 0;

		        $("#dock li ul.docked").each(function () {
		            $(this).height(dockH).css("top", dockT + "px");
		            dockT += dockH;
		        });
		        $(this).parent().find(".undock").show();
		        $(this).hide();

		        if (docked > 0)
		            $("#content").css("margin-left", "250px");
		        else
		            $("#content").css("margin-left", "60px");
		    });

		    $("#dock .undock").click(function () {
		        $(this).parent().parent().addClass("free").removeClass("docked")
		                                 .animate({ left: "-240px" }, 200).height($(window).height()).css("top", "0px");

		        docked = docked - 1;
		        var dockH = ($(window).height()) / docked
		        var dockT = 0;

		        $("#dock li ul.docked").each(function () {
		            $(this).height(dockH).css("top", dockT + "px");
		            dockT += dockH;
		        });
		        $(this).parent().find(".dock-keleyi-com").show();
		        $(this).hide();

		        if (docked > 0)
		            $("#content").css("margin-left", "250px");
		        else
		            $("#content").css("margin-left", "60px");
		    });

		    $("#dock li").hover(function () {
		        $(this).find("ul").animate({ left: "30px" }, 400);
		    }, function () {
		        $(this).find("ul.free").animate({ left: "-240px" }, 400);
		    });
		}

		initializeVideoList();

		var courseListObj = $cookieStore.get('courseListObj');
		$scope.selectedCourse = $cookieStore.get('courseChoosed');
		if (angular.isUndefined($scope.selectedCourse))
			$scope.selectedCourse = 4;
		else {
			var cid = $scope.selectedCourse;
			$scope.courseDescription = courseListObj[cid].description;
			$scope.courseImgPath = courseListObj[cid].img;
			$scope.instructor = courseListObj[cid].instructor;
			$scope.courseList = $cookieStore.get('courseList');
		};
		console.log(siteRootPath + 'getCourseList');
		if (angular.isUndefined(courseListObj)) {
			$http.get(siteRootPath + 'getCourseList').success(function(data){
				courseListObj = {};
				angular.forEach(data, function(d){
					courseListObj[d.courseId] = d;
				});
				$cookieStore.put('courseListObj', courseListObj);
				$cookieStore.put('courseList', data);
				$scope.courseList = data;
				$cookieStore.put('courseChoosed', 4);
				$scope.courseDescription = courseListObj['4'].description;
				$scope.courseImgPath = courseListObj['4'].img;
				$scope.instructor = courseListObj['4'].instructor;
			});
		}
		

		$scope.courseChange = function(){
			$cookieStore.put('courseChoosed', $scope.selectedCourse);
			$window.location.reload()
		};
	}
]);



'use strict';


angular.module('core').controller('PeakInfoController', ['$scope', '$location', 'pip', '$rootScope', '$http', '$cookieStore',
	function($scope, $location, pip, $rootScope, $http, $cookieStore) {
		// This provides Authentication context.
		var mainPath, getURL;
		mainPath = window.location.pathname;
		var selectedCourse = $cookieStore.get('courseChoosed');
		getURL = mainPath + 'peakPreviewInfo?courseId=' + selectedCourse;

		$http.get(getURL).success(function(data){
			$scope.peaks = data[0];
			
		});
	} 
]);
'use strict';


angular.module('core').controller('PreviewController', ['$scope', '$location', 'pip', '$rootScope', '$cookieStore', '$timeout', '$http',
	function($scope, $location, pip, $rootScope, $cookieStore, $timeout, $http) {
		var shotImg = $cookieStore.get('shotImg');
		$scope.showImg = shotImg.slice(shotImg.length-6 , shotImg.length);

		pip.onShotImgChange($scope, function(canvas){
			// var width = canvas.width,
			// 	height = canvas.height;
			// var oriContext = canvas.getContext('2d');
			// var finalCanvas = document.createElement("CANVAS");
			// var finalContext = finalCanvas.getContext("2d");
			// finalContext.fillStyle = "#FFFFFF";
			// finalContext.fillRect(0, 0, width, height);
			// finalContext.putImageData(oriContext.getImageData(0, 0, width, height), 0, 0);
			// finalContext.save();

			var img = canvas.toDataURL("image/png");
                img = img.replace('data:image/png;base64,', '');
            var finalImageSrc = 'data:image/png;base64,' + img;

            console.log(siteRootPath + 'saveBase64Img');
            $http.post(siteRootPath + 'saveBase64Img', {'image': img})
            	.success(function(message){
            		console.log(message);
            	});

			shotImg.push(finalImageSrc);
			$timeout(function(){
				$scope.showImg = shotImg.slice(shotImg.length-6 , shotImg.length).reverse();
			}, 500);
		});

		$scope.previewTo = function(which) {
			if ($scope.showImg[which] != './img/empty.png')
				window.open($scope.showImg[which]);
		};
	}
]);
'use strict';

angular.module('core').directive('peakImgHover', ["$window", "$location", "pip", function($window, $location, pip){
   return{
      restrict:'A',
      link: function(scope, element, attrs){

      		var d3 = $window.d3;
      		var hoverEle = d3.select(element[0]);

      		var nowURL;

		    hoverEle.on('mouseover', function(){

		    	nowURL = $location.path();
	      		if (nowURL.indexOf('graph') != -1)
	      			nowURL = 'graph';
	      			else 
	      		if (nowURL.indexOf('flowmap') != -1)
	      			nowURL = 'flowmap';
		    	
		    	if (nowURL == 'graph') {
		    		d3.selectAll('.graphnode')
      		  	  	  .style('opacity', 0.5);
      		  		$('#graphmds_container .peak'+attrs.pid).css('opacity', 1);
		    	};

	  		});

	  		hoverEle.on('mouseout', function(){
	  			nowURL = $location.path();
	      		if (nowURL.indexOf('graph') != -1)
	      			nowURL = 'graph';
	      			else 
	      		if (nowURL.indexOf('flowmap') != -1)
	      			nowURL = 'flowmap';

		    	if (nowURL == 'graph') {
		    		d3.selectAll('.graphnode')
      		  	  	  .style('opacity', 1);
	  			};
	  		});

	  		hoverEle.on('click', function(){
	  			nowURL = $location.path();
	      		if (nowURL.indexOf('graph') != -1)
	      			nowURL = 'graph';
	      			else 
	      		if (nowURL.indexOf('flowmap') != -1)
	      			nowURL = 'flowmap';
	  			
	  			if (nowURL == 'flowmap'){
	  				pip.emitFlowmapSlideChange(attrs.pid);
	  			};
	  		});
      }
   };
}]);
'use strict';

angular.module('core').factory('pip', ['$window', '$rootScope',
	function($window, $rootScope) {

		var SLIDECOMPONENT_MESSAGE = 'slideComponentChanged',
			SHOTIMG_MESSAGE = 'shotImgChanged',
			FLOWMAPSLIDE_MESSAGE = 'flowmapSlideChanged',
			SENTIMENT_MESSAGE= 'sentimentChanged',
			GRAPH_USERNAME_MESSAGE= 'graphUsernameChanged',
			CODE3_MESSAGE='code3Changed';


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
		};
	}
]);

'use strict';

//Setting up route
angular.module('peakanalysis').config(['$stateProvider',
	function($stateProvider) {
		// Peakanalysis state routing
		$stateProvider.
		state('peak.entrance', {
			url: '/entrance',
			templateUrl: 'modules/peakanalysis/views/entrance.client.view.html'
		}).
		state('peak.parrellel', {
			url: '/parrellel',
			templateUrl: 'modules/peakanalysis/views/parrellel.client.view.html',
			controller: 'ParrellelController'
		}).
		state('peak.flowmap', {
			url: '/flowmap',
			templateUrl: 'modules/peakanalysis/views/flowmap.client.view.html',
			controller: 'FlowmapController'
		}).
		state('peak.flowmapGlyph', {
			url: '/flowmapGlyph',
			templateUrl: 'modules/peakanalysis/views/flowmap.glyph.client.view.html',
			controller: 'FlowmapController'
		}).
		state('peak.graph', {
			url: '/graph',
			templateUrl: 'modules/peakanalysis/views/graph.client.view.html',
			controller: 'GraphController'
		})
		.state('peak.graphmds', {
			url: '/graphmds',
			templateUrl: 'modules/peakanalysis/views/graphmds.client.view.html',
			controller: 'GraphmdsController'
		});
	}
]);
'use strict';

angular.module('peakanalysis').controller('EntranceController', ['$scope', '$window', '$http', '$location', '$rootScope', 'pip', '$modal', '$cookieStore',
	function($scope, $window, $http, $location, $rootScope, pip, $modal, $cookieStore) {

		pip.emitSlideComponentChange('hide');

		var courseId = $cookieStore.get('courseChoosed');
		if (angular.isUndefined(courseId))
			courseId = 4;

		if (courseId == 4)
			$scope.courseName = 'JAVA'
		else
		if (courseId == 1)
			$scope.courseName = 'NCH';

		var enterView = $location.search().v;
		if (angular.isUndefined(enterView))
			enterView = 0;
		$('.entrance_view_' + enterView).css('width', '40%');

		$scope.canvasURL = '';
		$scope.shot = function() {
			html2canvas($('#test')).then(function(canvas){
	        		$scope.canvasURL = canvas.toDataURL();
	        		// $window.open($scope.canvasURL);
	        		// $('#divdivdiv').append(canvas);
	        		// console.log($scope.canvasURL);
	        	    // document.body.appendChild(canvas);
          	});
		};

	}
]);
'use strict';

angular.module('peakanalysis').controller('FlowmapController', ['$scope', '$window', '$http', 'pip', '$cookieStore', '$location', 'dataManagerService', '$timeout',
	function($scope, $window, $http, pip, $cookieStore, $location, dataManagerService, $timeout) {
		// Flowmap controller logic
		// ...
		pip.emitSlideComponentChange('show');

		$scope.peakIndex = $location.search().pid;
		if (angular.isUndefined($scope.peakIndex)) {
	        $scope.peakIndex = 1;
		}
		var mainPath, getURL;
		mainPath = window.location.pathname;

		var courseId = $cookieStore.get('courseChoosed');
		if (angular.isUndefined(courseId))
			courseId = 4;

        if(courseId == 1){
            $scope.peakNum = 35;
        }else if(courseId == 4){
            $scope.peakNum = 34;
        }

        pip.onFlowmapSlideChange($scope, function(data){
        	$scope.peakIndex = data;
        	$scope.filterChange();
        });

		var getServerData = function(peakIndex, callback){
			//$scope.startTime = _startTime;
			getURL = mainPath + 'animationtest?peakIndex=' + peakIndex + '&courseId=' + courseId;

			$http.get(getURL).success(function(data){
					//console.log("success");
					console.log(data);
					callback(data);
			})
		};

		var callFunc = function(data){
			var arr1 = [], arr2 = [], arr3 = [], arr4 = [];

			$scope.ClickAttackData = [];
            $scope.ClickAttackData.push(courseId);
			$scope.ClickAttackData.push(data);
		};

		$scope.filterChange = function(){
			var peakIndex = $scope.peakIndex;
			getServerData(peakIndex, callFunc);
		}
        getServerData($scope.peakIndex, callFunc);


        $('#peak_flowmap_chart').width($('#flowmap_container').width()+20);
        $scope.multiChartOptions = {
            chart: {
                // type: 'stackedAreaChart',
                type: 'lineChart',
                height: $('.flowmap_container').height()*0.2,
                margin : {
                    top: 10,
                    right: 0,
                    bottom: 10,
                    left: 50
                },
                showControls: false,
                x: function(d){return d.x;},
                y: function(d){return d.y;},
                useVoronoi: false,
                clipEdge: true,
                interpolate: 'cardinal',
                transitionDuration: 500,
                useInteractiveGuideline: true,
                showLegend: false,
                showXAxis: false,
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
                },
                fireClickEvent: function(e){
                  $scope.currentTime = e.pointXValue;
                  console.log($('#video'));
                  $('#video')[0].childNodes[0].currentTime = Math.floor($scope.currentTime * ($('#video')[0].childNodes[0].duration - 5) /($('#video')[0].childNodes[0].duration) + 2);
                }
            }
        };

        var processData = function(data) {
        	console.log(data);
		    if (!data.clicks) return;
		    $scope.multiChartdata = []
		    data.clicks.forEach(function (dat) {
		      var length = dat.data.length;
		      var result = dat.data.slice(3, length - 3).aggregate(3).map(function (dd, i) {
		        return {
		          x: i * 3,
		          y: Math.floor(dd)
		        };
		      });
		      if (dat.type == 'play' || dat.type=='pause') {
		          $scope.multiChartdata.push(
		            {
		              key: dat.type,
		              values: result,
		              // color: colors(dat.type)
		              color: '#FE7E13'
		            }
		          );
		      }
		    });
		    angular.forEach($scope.multiChartdata[0].values, function(d, i){
		      d.y += $scope.multiChartdata[1].values[i].y;
		    });
	        $scope.multiChartdata.splice(1,1);
	        $scope.multiChartdata[0].key = 'click';
		};

        dataManagerService.getActionCountInfo(4, 'i4x-HKUSTx-COMP102x-video-34fa085d32834ea680d3f15267feeb05', processData);
        										  

        $scope.shot = function() {
            html2canvas($('.flowmap_whole')).then(function(canvas){
                pip.emitShotImgChange(canvas);
            });
        };

        $scope.autoplay = function() {

            var nowIndex = -1;

            var timeCount = function(){
                nowIndex += 1;
                if (nowIndex >= $scope.peakNum) {
                    $scope.peakIndex = 0;
                    $scope.filterChange();
                    return;
                }
                $scope.peakIndex = nowIndex;
                $scope.filterChange();
                $timeout(timeCount , 500);
            };

            timeCount();
            
        };
	}
]);

'use strict';

angular.module('peakanalysis').controller('GraphController', ['$window', '$scope', '$http', 'pip',
	function($window ,$scope, $http, pip) {

		pip.emitSlideComponentChange('show');

		var intersect = function(a, b) {
	        var t;
	        if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
	        return a.filter(function (e) {
	        	for (var i = 0, len = b.length; i < len; i++){
	        		if (e.name == b[i].name)
	        			return true;
	        	}
	        	return false;
	        });
		}

		var union = function(a, b){
			a.concat(b);
			var lena = a.length;
			for (var i = 0; i < lena; i++){
				for (var j = i+1; j<lena; j++){
					if (a[i] === a[j])
						a.splice(j--, 1);
				}
			}	
		}

		var getSimilarity = function(arr1, arr2){
			var length = intersect(arr1, arr2).length;
			return length / (arr1.length + arr2.length - length);
		}

		var getMyColor = function(_videoId, ColorArr){

			 // if (ColorArr.length == 0) { return null; }
 			 for(var i = 0, nowObj; nowObj = ColorArr[i]; i++){
			 	if (_videoId == nowObj.videoId)
			 		return nowObj.color;
       		 }
       		 return null;
    	}

		var videoIdRange = d3.range(3, 36, 2);
        var weekNum = 10;
		var videoLength = [905, 215, 1226, 851, 663, 881, 1195, 470, 810, 373, 713, 401, 539, 902, 745, 571, 297];

		var w = d3.scale.linear().range([30, 60]);
		var h = d3.scale.linear().range([30, 45]);

		$http.post(siteRootPath + 'getGlyphInfo', {})
			.success(function(data, status, headers, config){
				 console.log(data);

				var colors = [],
					usedcolors = 0;

				// get nodes
				var nodes = [];					
				data.forEach(function(d){
					var tmpNode = {};
                    //tmpNode['name'] = d.videoId.toString() + '#' + d.currentTime.toString();
					//var tmpcolor = getMyColor(d.videoId, colors);
                    tmpNode['name'] = d.week.toString()+ '#' + d.currentTime.toString();  //java
                    var tmpcolor = getMyColor(d.videoId, colors);
                    //console.log(tmpcolor);

					if (tmpcolor != null){
						tmpNode['group'] = tmpcolor;
					} else{
						usedcolors++;
						colors.push({
							'videoId': d.videoId,
                            //'videoId': d._id,
							'color': usedcolors
						});
						tmpNode['group'] = usedcolors;
					}
					nodes.push(tmpNode);
				});
                console.log(nodes);

				// get links,    there are links for those whose similarity >=0.5
				var links = [];
                var linkCount = [];
                for(var i = 0; i < data.length; i++ ){
                    linkCount.push(0);
                }
			    for (var i = 0, obj1; obj1 = data[i]; i++){
                    var simTh = 0.2;
                    //while(linkCount[i] < 2){
                    //    for (var j = i + 1, obj2; obj2 = data[j]; j++){
                    //        var sim = getSimilarity(obj1.peopleInfo, obj2.peopleInfo);
                    //        if ((sim >= simTh) && (sim <  simTh + 0.1)){
                    //            var tmpLink = {};
                    //            tmpLink['source'] = i;
                    //            tmpLink['target'] = j;
                    //            tmpLink['strength'] = sim;
                    //            links.push(tmpLink);
                    //            linkCount[i]++;
                    //            linkCount[j]++;
                    //        }
                    //    }
                    //    simTh -= 0.1;
                    //}
                    for (var j = i + 1, obj2; obj2 = data[j]; j++) {
                        var sim = getSimilarity(obj1.peopleInfo, obj2.peopleInfo);
                        //var sim = 0.5;
                        if (sim >= simTh){
                            var tmpLink = {};
                            tmpLink['source'] = i;
                            tmpLink['target'] = j;
                            tmpLink['strength'] = sim;
                            links.push(tmpLink);
                        }
                    }
			    }

				w.domain(d3.extent(data, function(d){ return d.peakWidth }));
				h.domain(d3.extent(data, function(d){ return d.actionNum }));

				var peaks = data.map(function(d){
					var actionWidth = w(d.peakWidth) + 20;
					var actionHeight = h(d.actionNum) + 20;
					var actionPosition = d.currentTime/d.videoLength;
                    //var videoWeekPosition = videoIdRange.indexOf(d.videoId)/(videoIdRange.length-1);
                    var videoWeekPosition = d.week / weekNum;
					var line1Position = 1 - d.peopleInfo.length / d.actionNum;

					var peopleInfo = d.peopleInfo.sort(function(a, b){ return b.Count - a.Count; });
					var nowCount = 0;
		            var upLimit = Math.floor(d.actionNum*0.9);
		            for (var i = 0, count; count = peopleInfo[i].Count; i++){
		                if (nowCount >= upLimit)
		                    break;
		                nowCount += count;
		            }

                    //var grade = d.grade;

                    //var line2Position = 1 - i / d.actionNum;
                    var line2Position = i / d.peopleInfo.length;
		            

                    //calculate the distribution
                    var countArr = [];
                    var sum = 0;
                    var std = 0;
                    var anomaly = 0;
                    for(var i = 0; i < d.peopleInfo.length; i++){
                        countArr.push(d.peopleInfo[i].Count);
                        sum += d.peopleInfo[i].Count;
                        if(d.peopleInfo[i].Count > 10)  anomaly += d.peopleInfo[i].Count;
                    }
                    anomaly /= sum;
                    var average = sum/d.peopleInfo.length;
                    for(var i = 0; i < d.peopleInfo.length; i++){
                        std += Math.sqrt((average - d.peopleInfo[i].Count) * (average - d.peopleInfo[i].Count));
                    }
                    std /= d.peopleInfo.length;

					return {
						'actionWidth': actionWidth,
						'actionHeight': actionHeight,
						'actionPosition': actionPosition,
						'videoWeekPosition': videoWeekPosition,
						'line1Position': line1Position,
						'line2Position': line2Position,
                        //'grade': grade,
                        'index': data.indexOf(d),
                        'ave': average,
                        'std': std,
                        'anomaly': anomaly
					}
				});

                for(var i = 0; i < peaks.length; i++){
                    var sum = data[i].grade.reduce(function(pv, cv) { return pv + cv; }, 0);
                    var w1 = d3.scale.linear().range([(peaks[i].actionWidth - 20) * 0.3, (peaks[i].actionWidth - 20) * 1]);
                    var h1 = d3.scale.linear().range([(20-peaks[i].actionWidth), (peaks[i].actionWidth - 20)]);
                    w1.domain(d3.extent(peaks, function(d){ return d.ave }));
                    h1.domain(d3.extent(peaks, function(d){ return d.std }));
                    peaks[i].distrAve = w1(peaks[i].ave);
                    peaks[i].distrStd = h1(peaks[i].std);
                    peaks[i].grade = [];
                    for(var j = 0; j < data[i].grade.length; j++){
                        peaks[i].grade.push(data[i].grade[j]/sum);
                    }
                }

                console.log(peaks);

			    var finalData = {
			    	'nodes': nodes,
			    	'links': links,
			    	'peaks': peaks
			    };
			    $scope.peaks = peaks;
			     //console.log(finalData);
			    $scope.$broadcast('forceData', finalData);
			});

		$scope.shot = function() {
			console.log('start shot');
            html2canvas($('#graph_container'), {
            	useCORS: true,
            }).then(function(canvas) {
            	console.log('shot successfully');
			    pip.emitShotImgChange(canvas);
	        });
        };
	}
]);

'use strict';

angular.module('peakanalysis').controller('GraphmdsController', ['$window', '$scope', '$http', 'pip', '$cookieStore',
	function($window ,$scope, $http, pip, $cookieStore) {

		pip.emitSlideComponentChange('show');

		var mainPath = window.location.pathname;

		var intersect = function(a, b) {
	        var t;
	        if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
	        return a.filter(function (e) {
	        	for (var i = 0, len = b.length; i < len; i++){
	        		if (e.name == b[i].name)
	        			return true;
	        	}
	        	return false;
	        });
		}

		var union = function(a, b){
			a.concat(b);
			var lena = a.length;
			for (var i = 0; i < lena; i++){
				for (var j = i+1; j<lena; j++){
					if (a[i] === a[j])
						a.splice(j--, 1);
				}
			}	
		}

		var getSimilarity = function(arr1, arr2){
			var length = intersect(arr1, arr2).length;
			return length / (arr1.length + arr2.length - length);
		}

		var getMyColor = function(_videoId, ColorArr){

			 // if (ColorArr.length == 0) { return null; }
 			 for(var i = 0, nowObj; nowObj = ColorArr[i]; i++){
			 	if (_videoId == nowObj.videoId)
			 		return nowObj.color;
       		 }
       		 return null;
    	}

		var videoIdRange = d3.range(3, 36, 2);
        var weekNum = 10;
		var videoLength = [905, 215, 1226, 851, 663, 881, 1195, 470, 810, 373, 713, 401, 539, 902, 745, 571, 297];

		var w = d3.scale.linear().range([30, 60]);
		var h = d3.scale.linear().range([30, 45]);

		var courseId = $cookieStore.get('courseChoosed');
		if (angular.isUndefined(courseId))
			courseId = 4;
		$http.get(mainPath + 'getGlyphInfo?courseId=' + courseId)
			.success(function(data, status, headers, config){

				var colors = [],
					usedcolors = 0;

				// get nodes
				var nodes = [];					
				data.forEach(function(d){
					var tmpNode = {};
                    //tmpNode['name'] = d.videoId.toString() + '#' + d.currentTime.toString();
					//var tmpcolor = getMyColor(d.videoId, colors);
                    // tmpNode['name'] = d.week.toString()+ '#' + d.currentTime.toString();  //java
                    var tmpcolor = getMyColor(d.videoId, colors);
                    //console.log(tmpcolor);

					if (tmpcolor != null){
						tmpNode['group'] = tmpcolor;
					} else{
						usedcolors++;
						colors.push({
							'videoId': d.videoId,
                            //'videoId': d._id,
							'color': usedcolors
						});
						tmpNode['group'] = usedcolors;
					}
					nodes.push(tmpNode);
				});

				// get links,    there are links for those whose similarity >=0.5
				var links = [];
                var linkCount = [];
                for(var i = 0; i < data.length; i++ ){
                    linkCount.push(0);
                }

                var simMatrix = [];
                angular.forEach(d3.range(data.length), function(){
                	simMatrix.push(d3.range(data.length));
                });
                var minSim = 1, maxSim = 0;
			    for (var i = 0, obj1; obj1 = data[i]; i++){
                    var simTh = 0.2;
                    //while(linkCount[i] < 2){
                    //    for (var j = i + 1, obj2; obj2 = data[j]; j++){
                    //        var sim = getSimilarity(obj1.peopleInfo, obj2.peopleInfo);
                    //        if ((sim >= simTh) && (sim <  simTh + 0.1)){
                    //            var tmpLink = {};
                    //            tmpLink['source'] = i;
                    //            tmpLink['target'] = j;
                    //            tmpLink['strength'] = sim;
                    //            links.push(tmpLink);
                    //            linkCount[i]++;
                    //            linkCount[j]++;
                    //        }
                    //    }
                    //    simTh -= 0.1;
                    //}
                    simMatrix[i][i] = 1;
                    for (var j = i + 1, obj2; obj2 = data[j]; j++) {
                        var sim = getSimilarity(obj1.peopleInfo, obj2.peopleInfo);
                        simMatrix[i][j] = simMatrix[j][i] = sim;
                        //var sim = 0.5;
                        if (minSim > sim)
                        	minSim = sim;
                        if (maxSim < sim)
                        	maxSim = sim;

                        if (sim >= simTh){
                            var tmpLink = {};
                            tmpLink['source'] = i;
                            tmpLink['target'] = j;
                            tmpLink['strength'] = sim;
                            links.push(tmpLink);
                        }
                    }
			    }
			    var fs = d3.scale.linear().range([1, 0]).domain([minSim, maxSim]).clamp(true);
			    d3.range(data.length).forEach(function(row){
			    	d3.range(data.length).forEach(function(column){
			    		simMatrix[row][column] = fs(simMatrix[row][column]);
			    	});
			    });
			    var coordinate = LG.utils.Mds.mds(simMatrix);


				w.domain(d3.extent(data, function(d){ return d.peakWidth }));
				h.domain(d3.extent(data, function(d){ return d.actionNum }));

				var peaks = data.map(function(d){
					var actionWidth = w(d.peakWidth) + 20;
					var actionHeight = h(d.actionNum) + 20;
					var actionPosition = d.currentTime/d.videoLength;
                    //var videoWeekPosition = videoIdRange.indexOf(d.videoId)/(videoIdRange.length-1);
                    if(courseId == 1)   var videoWeekPosition = videoIdRange.indexOf(d.videoId)/(videoIdRange.length-1);
                    else if (courseId == 4) var videoWeekPosition = d.week / weekNum;
					var line1Position = 1 - d.peopleInfo.length / d.actionNum;

					var peopleInfo = d.peopleInfo.sort(function(a, b){ return b.Count - a.Count; });
					var nowCount = 0;
		            var upLimit = Math.floor(d.actionNum*0.9);
		            for (var i = 0, count; count = peopleInfo[i].Count; i++){
		                if (nowCount >= upLimit)
		                    break;
		                nowCount += count;
		            }

                    //var grade = d.grade;

                    //var line2Position = 1 - i / d.actionNum;
                    var line2Position = i / d.peopleInfo.length;
		            

                    //calculate the distribution
                    var countArr = [];
                    var sum = 0;
                    var std = 0;
                    var anomaly = 0;
                    for(var i = 0; i < d.peopleInfo.length; i++){
                        countArr.push(d.peopleInfo[i].Count);
                        sum += d.peopleInfo[i].Count;
                        if(d.peopleInfo[i].Count > 10)  anomaly += d.peopleInfo[i].Count;
                    }
                    anomaly /= sum;
                    var average = sum/d.peopleInfo.length;
                    for(var i = 0; i < d.peopleInfo.length; i++){
                        std += Math.sqrt((average - d.peopleInfo[i].Count) * (average - d.peopleInfo[i].Count));
                    }
                    std /= d.peopleInfo.length;

					return {
						'actionWidth': actionWidth,
						'actionHeight': actionHeight,
						'actionPosition': actionPosition,
						'videoWeekPosition': videoWeekPosition,
						'line1Position': line1Position,
						'line2Position': line2Position,
                        //'grade': grade,
                        'index': data.indexOf(d),
                        'ave': average,
                        'std': std,
                        'anomaly': anomaly
					}
				});

                for(var i = 0; i < peaks.length; i++){
                    var sum = data[i].grade.reduce(function(pv, cv) { return pv + cv; }, 0);
                    var w1 = d3.scale.linear().range([(peaks[i].actionWidth - 20) * 0.3, (peaks[i].actionWidth - 20) * 1]);
                    var h1 = d3.scale.linear().range([(20-peaks[i].actionWidth), (peaks[i].actionWidth - 20)]);
                    w1.domain(d3.extent(peaks, function(d){ return d.ave }));
                    h1.domain(d3.extent(peaks, function(d){ return d.std }));
                    peaks[i].distrAve = w1(peaks[i].ave);
                    peaks[i].distrStd = h1(peaks[i].std);
                    peaks[i].grade = [];
                    for(var j = 0; j < data[i].grade.length; j++){
                        peaks[i].grade.push(data[i].grade[j]/sum);
                    }
                }

			    var finalData = {
			    	'nodes': nodes,
			    	'links': links,
			    	'peaks': peaks,
			    	'coordinate': coordinate,
			    	'peakBasicInfo': data
			    };
			    $scope.peaks = peaks;
			    $scope.$broadcast('forceData', finalData);
			});

			$scope.shot = function() {
				console.log('start shot');
	            html2canvas($('#graphmds_container'), {
	            	useCORS: true,
	            }).then(function(canvas) {
	            	console.log('shot successfully');
				    pip.emitShotImgChange(canvas);
		        });
	        };
	}
]);

'use strict';

angular.module('peakanalysis').controller('ParrellelController', ['$scope', '$window', '$http', 'pip', '$cookieStore',
	function($scope, $window, $http, pip, $cookieStore) {
		// Parrellel controller logic
		// ...
        pip.emitSlideComponentChange('show');

		var mainPath, _startTime, getURL;
		mainPath = window.location.pathname;

        var courseId = $cookieStore.get('courseChoosed');
        if (angular.isUndefined(courseId))
            courseId = 4;

		var getServerData = function(callback){
			//$scope.startTime = _startTime;

			getURL = mainPath + 'ParallelCoor?courseId=' + courseId;
			console.log(getURL);

			$http.get(getURL).success(function(data){
					console.log("success");
					console.log(data);
					callback(data);
			})
		};

		var callFunc = function(data){
            //add the activeness axis
            var arr = [];
            //var peakNum = 41; //nch
            var peakNum = 32;   //java
            for(var i = 0; i < data.length; i++){
                var obj = data[i];
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
            $scope.PCData.push(courseId);
            $scope.PCData.push(arr);

			//$scope.PCData = [];
			//$scope.PCData.push(data);
		};

		getServerData(callFunc);

        $scope.shot = function() {
            html2canvas($('#parrellel_coordinate')).then(function(canvas){
                pip.emitShotImgChange(canvas);
                // var img = canvas.toDataURL("image/png");
                // img = img.replace('data:image/png;base64,', '');
                // var finalImageSrc = 'data:image/png;base64,' + img;
                // window.open(finalImageSrc);
                // img = img.replace('data:image/png;base64,', '');
                // var finalImageSrc = 'data:image/png;base64,' + img;
                // window.open(img);
            });
        };

	}
]);

'use strict';

angular.module('peakanalysis').controller('PeakModalController', ['$scope', '$window', '$http', 'pip', '$cookieStore', '$location', 'dataManagerService', '$rootScope',
	function($scope, $window, $http, pip, $cookieStore, $location, dataManagerService, $rootScope) {
		// Flowmap controller logic
		// ...
		$scope.courseId = $cookieStore.get('courseChoosed');
		if (angular.isUndefined($scope.courseId))
			$scope.courseId = 4;

		$scope.multiChartOptions = {
            chart: {
                // type: 'stackedAreaChart',
                type: 'lineChart',
                height: 150,
                margin : {
                    top: 20,
                    right: 0,
                    bottom: 10,
                    left: 30
                },
                showControls: false,
                x: function(d){return d.x;},
                y: function(d){return d.y;},
                useVoronoi: false,
                clipEdge: true,
                interpolate: 'cardinal',
                transitionDuration: 500,
                useInteractiveGuideline: true,
                showLegend: false,
                showXAxis: false,
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
                },
                fireClickEvent: function(e){
                  $scope.currentTime = e.pointXValue;
                  $('#video')[0].childNodes[0].currentTime = Math.floor($scope.currentTime * ($('#video')[0].childNodes[0].duration - 5) /($('#video')[0].childNodes[0].duration) + 2);
                }
            }
        };

        var processData = function(data) {
		    if (!data.clicks) return;
		    $scope.multiChartdata = []
		    data.clicks.forEach(function (dat) {
		      var length = dat.data.length;
		      var result = dat.data.slice(3, length - 3).aggregate(3).map(function (dd, i) {
		        return {
		          x: i * 3,
		          y: Math.floor(dd)
		        };
		      });
		      if (dat.type == 'play' || dat.type=='pause') {
		          $scope.multiChartdata.push(
		            {
		              key: dat.type,
		              values: result,
		              // color: colors(dat.type)
		              color: '#FE7E13'
		            }
		          );
		      }
		    });
		    angular.forEach($scope.multiChartdata[0].values, function(d, i){
		      d.y += $scope.multiChartdata[1].values[i].y;
		    });
	        $scope.multiChartdata.splice(1,1);
            $scope.multiChartdata[0].key = 'click';
            // console.log($scope.multiChartdata);
		};

        dataManagerService.getActionCountInfo($scope.courseId, $scope.peakInfo.videoId, processData);
        

	    $scope.goFlowview = function() {
            // $location.path('/peak/flowmap').search({pid: $scope.peakId});
	    	$rootScope.go('/peak/flowmapGlyph', 'slideLeft');
	    	$scope.$hide();
	    }
	}
]);

'use strict';

angular.module('peakanalysis').directive('entranceHover', ["$window", function($window){
   return{
      restrict:'A',
      link: function(scope, element, attrs){

      		var d3 = $window.d3;
      		var hoverEle = d3.select(element[0]);
      		hoverEle.on('mouseover', function(){
      			d3.selectAll('.entrance_view')
      			  .style('width', '5%');
      			hoverEle
      			  .style('width', '40%');

               $('.view_title h1').each(function(index, value) {
                  if (index == attrs['tid'])
                     $(value).fadeIn(1000);
                  else
                     $(value).css('display', 'none');
               });

               $('.view_description p').each(function(index, value) {
                  if (index == attrs['tid'])
                     $(value).fadeIn(1000);
                  else
                     $(value).css('display', 'none');
               });
               
      		});
      }
   };
}]);
'use strict';

angular.module('peakanalysis').directive('staticmap', function() {
	return {
		restrict: 'EA',
		template: '',
		scope: {
			data: '='
		},
		link: function (scope, element, attrs) {

            d3.select("#flowmapInput").on("change", function() {
                d3.select("#peakSelected").text(this.value);
            });

            var width = $('.peak_flowmap_container').width(),
            	height = $('.peak_flowmap_container').height(),
            	topheight = $('.peak_flowmap_map').height();

			var svg = d3.select(element[0])
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("opacity", 0.8);


			scope.$watch('data',function(data){
				//console.log('dir');
				console.log(data);

				//clear previous svg
				svg.selectAll("*").remove();



                //svg.append("line")
                //    .attr("x1", 0)
                //    .attr("y1", 505)
                //    .attr("x2", width)
                //    .attr("y2", 505)
                //    .attr("stroke-width", 5)
                //    .attr("stroke", "black");

                // var videoaxisScale = d3.scale.linear()
                //     .domain([0, 663])
                //     .range([0, width]);

                //var videoAxis = d3.svg.axis()
                //    .scale(videoaxisScale)
                //    .orient('bottom')
                //.tickPadding(8);

                //svg.append('g')
                //    .attr('class', 'video axis')
                //    //.attr('stroke', '#aaaaaa')
                //    //.attr("width", width)
                //    //.attr("height", 510)
                //    .attr('transform', 'translate(0, ' + 510 + ')')
                //    .call(videoAxis);

                var courseId = data[0];
				var dataTmp = data[1];

				//variables for plot
				var w = width;
				var h = topheight;
				var timelinePos = height * 0.7;
				//var videoLength = 216;
				//var dayTotal = 60;  //nch
                //var dayTotal = 64; //gt
                if(courseId == 1)   var dayTotal = 60; //nch
                else if(courseId == 4)  var dayTotal = 74; //java
                var dayCount = [];
                for(var i = 0; i < dayTotal; i++){
                    dayCount.push({'click': 0, 'people': 0});
                }

				var colorTestR = ["#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"];
				var colorTestB = ["#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"];

				//var startTime = _startTime;

				//set the radius range
				//var radiusArray = [];
				//for (var i = 0; i <dataTmp.length; i++) {
				//	radiusArray.push(dataTmp[i].count);
				//}
				//console.log(radiusArray);
				//var max = d3.max(radiusArray);
				var max = 100;

				function geoCoorCalculate(longitude, latitude) {
					var coor = {};
					coor.x = (longitude + 175) / 360 * w;
					coor.y = (75 - latitude) / 160 * h;
					return coor;
				}

				//main
				var lines = [];
                var countryTop = ['USA', 'CHN', 'GBR', 'CAN', 'DEU', 'BRA', 'ESP', 'AUS', 'FRA', 'IND', 'RUS'];
                var countryMax = {};
                for(var j = 0; j < countryTop.length; j++){
                    countryMax[countryTop[j]] = [];
                }
                // if((dataTmp[i].code3 != 'USA') && (dataTmp[i].code3 != 'CHN')) continue;

				for(var i=0; i<dataTmp.length; i++){
					var radius = Math.log(dataTmp[i].count/max*30);
                    if(countryTop.indexOf(dataTmp[i].code3) < 0)    continue;
                    countryMax[dataTmp[i].code3].push(dataTmp[i]);
                    dayCount[dataTmp[i].day - 1].people++;
                    dayCount[dataTmp[i].day - 1].click += dataTmp[i].count;
					//var radius = (dataTmp[i].count/max*5);
					if(radius < 0.1) radius = 0.1;
					//drawgeostatic(dataTmp[i], svg);

					var t = 0.1;
					var arrTemp = [];
					var p1 = geoCoorCalculate(dataTmp[i].longitude, dataTmp[i].latitude);
                    if(dataTmp[i].code3 == 'BRA')   p1.y += 20;
					var p2 = {x: (dataTmp[i].day)/dayTotal*w, y: timelinePos - 4};
					var p3 = {x: 0.5 * ( p1.x + p2.x) , y: h + 0.1 * p1.x};
					var cp1 = {x: p1.x, y: t*p1.y + (1-t)*p3.y};
					var cp2 = {x: (1-t)*p1.x + t*p3.x, y: p3.y};
					var cp3 = {x: t*p3.x + (1-t)*p2.x, y: p3.y};
					var cp4 = {x: p2.x, y: (1-t)*p3.y + t*p2.y};

					var pathStr = 'M'+ p1.x + ',' + p1.y + ' C'
						+ cp1.x + ',' + cp1.y + ' '
						+ cp2.x + ',' + cp2.y + ' '
						+ p3.x + ',' + p3.y;

                    var path = svg.append("path")
						.attr("d", pathStr)
						.attr("stroke", function(){
							var colorTemp = Math.floor(radius*2);
							//return colorTestB[4];
                            return "#FE7E13";
						})
						.attr("stroke-width", radius*2)
						.attr("fill", "none")
                        .attr("opacity", 0.4);

				pathStr = 'M'+ p3.x + ',' + p3.y + ' C'
					+ cp3.x + ',' + cp3.y + ' '
					+ cp4.x + ',' + cp4.y + ' '
					+ p2.x + ',' + p2.y;

				path = svg.append("path")
					.attr("d", pathStr)
					.attr("stroke", function(){
						var colorTemp = Math.floor(radius*2);
						//return colorTestB[4];
                        return "#FE7E13";
					})
					.attr("stroke-width", radius*2)
					.attr("fill", "none")
                    .attr("opacity", 0.4);

                    //var circle = svg.append("circle")
						//.attr("r", radius*8)
						//.style("fill", "#62A0CA")
						//.attr("cx", p1.x)
						//.attr("cy", p1.y)
						//.attr("opacity", 1);
                    //
                    //var circle = svg.append("circle")
                    //    .attr("r", radius * (5*Math.random()+ 1))
                    //    .style("fill", "#ffffff")
                    //    .attr("cx", p1.x)
                    //    .attr("cy", p1.y)
                    //    .attr("opacity", 1);


			}
                if(courseId == 1){
                    var timeaxisScale = d3.time.scale()
                        .domain([new Date(2013, 6, 21, 0, 0, 0), new Date(2013, 8, 16, 0, 0, 0)])   //nch
                        //.domain([new Date(2013, 6, 9, 0, 0, 0), new Date(2013, 8, 10, 0, 0, 0)])  //gt
                        //.domain([new Date(2014, 5, 19, 0, 0, 0), new Date(2014, 8, 2, 0, 0, 0)])   //java
                        .rangeRound([0, width]);
                }
                else if(courseId == 4){
                    var timeaxisScale = d3.time.scale()
                        //.domain([new Date(2013, 6, 21, 0, 0, 0), new Date(2013, 8, 16, 0, 0, 0)])   //nch
                        //.domain([new Date(2013, 6, 9, 0, 0, 0), new Date(2013, 8, 10, 0, 0, 0)])  //gt
                        .domain([new Date(2014, 5, 19, 0, 0, 0), new Date(2014, 8, 2, 0, 0, 0)])   //java
                        .rangeRound([0, width]);
                }

                var xAxis = d3.svg.axis()
                    .scale(timeaxisScale)
                    .orient('top')
                    // .nice(d3.time.day, 7);
                    //.ticks(d3.time.days, 7)
                    .tickFormat(d3.time.format('%b %d'))
                    .tickSize(0);
                //.tickPadding(8);

                var axisSelector = svg.append('g')
                    .attr('class', 'axis')
                    //.attr('stroke', '#aaaaaa')
                    //.attr("width", width)
                    //.attr("height", 510)
                    .attr('transform', 'translate(0, ' + (timelinePos) + ')')
                    .call(xAxis);

                axisSelector.select('path')
                    .attr('fill', 'none')
                    .attr('stroke', '#a9a9a9')
                    .attr('stroke-width', '2')
                    .style("stroke-dasharray", ("2, 4"))
                    .attr('shape-rendering', 'crispEdges')
                    .style('shape-rendering', 'crispEdges');
                for(var i = 0 ; i < countryTop.length; i++){
                    countryMax[countryTop[i]] = countryMax[countryTop[i]].sort(function (a, b) {
                        return b.count - a.count
                    });
                    var p = {};
                    if(countryMax[countryTop[i]].length > 0) {
                        p = geoCoorCalculate(countryMax[countryTop[i]][0].longitude, countryMax[countryTop[i]][0].latitude);
                        if (countryMax[countryTop[i]][0].code3 == 'BRA') p.y += 30;
                        radius = Math.log(countryMax[countryTop[i]][0].count / max * 30);
                        if (radius < 0.1) radius = 0.1;
                        svg.append("circle")
                            .attr("r", radius * 8)
                            .style("fill", "#d73027")
                            .attr("cx", p.x)
                            .attr("cy", p.y)
                            .attr("opacity", 0.4);
                    }
                    if(countryMax[countryTop[i]].length > 1) {
                        radius = Math.log(countryMax[countryTop[i]][1].count / max * 30);
                        if (radius < 0.1) radius = 0.1;
                        svg.append("circle")
                            .attr("r", radius * 6)
                            .style("fill", "#FE7E13")
                            .attr("cx", p.x)
                            .attr("cy", p.y)
                            .attr("opacity", 1);
                    }
                }
                var attackLinerange = d3.scale.linear()
                    .domain([0, dayCount.slice(0).sort(function(a, b){return b.click - a.click})[0].click])
                    .range([0, 0.2*height]);
                for(var i = 0; i < dayTotal; i++) {
                    svg .append('line')
                        .attr('x1', (i + 1) * width / dayTotal)
                        .attr('y1', timelinePos + 4)
                        .attr('x2', (i + 1) * width / dayTotal)
                        .attr('y2', timelinePos + attackLinerange(dayCount[i].click) + 4)
                        .style('stroke', '#FE7E13')
                        .attr("opacity", 1)
                        .style("stroke-dasharray", ("8, 4"))
                        .style('stroke-width', 0.5 * width / dayTotal);
                }
				//var bundle = d3.layout.bundle();
                //.
				//var line = d3.svg.line()
				//	.interpolate("bundle")
				//	.tension(1)
				//	.x(function(d) { return d.x; })
				//	.y(function(d) { return d.y; })
				//	.attr("stroke", "black");
                //
				////console.log(lines);
				//var link = svg.append("g").selectAll(".link");
				//link = link.data(lines)
				//	.enter().append("path")
				//	.each(function(d){d.source = d[0], d.target = d[d.length - 1]; })
				//	.attr("class", "link")
				//	.attr("d", line);

			})
		}
	}
});

'use strict';

angular.module('peakanalysis').directive('map', function () {
    return {
        restrict: 'EA',
        template: '',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            //var data = scope[attrs.attackData];
            //var courseId = element;
            //console.log(courseId);
            //var svg = element.find('svg');
            var map = new Datamap({
                //scope: 'world',
                element: element[0],
                height: $('.peak_flowmap_map').height(),
                width: $('.peak_flowmap_map').width(),
                projection: 'equirectangular',

                geographyConfig: {hideAntarctica: false},

                fills: {
                    //defaultFill: '#eeeec6'
                    defaultFill: '#ffffe5'
                }
            });


            scope.$watch('data', function (data) {

                var dataTmp = data[1];


                var countryCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var countryNames = ["ARG", "AUS", "BRA", "CAN", "CHN", "COL", "FRA", "DEU", "GRC", "HKG", "IND", "ITA", "MEX", "NLD", "PHL", "POL", "ROU", "RUS", "SGP", "ESP", "UKR", "GBR", "USA"];
                for (var i = 0; i < dataTmp.length; i++) {
                    for (var j = 0; j < countryNames.length; j++) {
                        if (countryNames[j] == dataTmp[i].code3) {
                            countryCount[j] += dataTmp[i].count;
                        }
                    }
                }
                console.log(countryCount);

                //set the color range
                var color = d3.scale.linear().range(['#ffffe5', '#41ab5d']);
                var max = d3.max(countryCount);
                color.domain([0, Math.log(max+1)]);

                console.log(max);

                d3.select(element[0]).selectAll('.datamaps-subunit')
                    .style('fill', function (d) {

                        if (countryNames.indexOf(d.id) < 0) {
                            return color(0);
                        } else {
                            //console.log(countryNames.indexOf(d.id));
                            return color(Math.log(countryCount[countryNames.indexOf(d.id)]+1));
                        }
                    })
                    .style('stroke', '#dddddd');

            });

        }
    }
});

'use strict';

angular.module('peakanalysis').directive('peakGraph', ["$window", "$compile", function($window, $compile){
   return{
      restrict:'EA',
      scope: {

      },
      template:"<svg></svg>",
       link: function(scope, elem, attrs){

       			var d3 = $window.d3;
          		var rawSvg=elem.find('svg');

           		var width = $('#graph_container').width(),
				    height = $('#graph_container').height();

				    // $window.innerWidth-350

				var color = d3.scale.category20();

				// var force = d3.layout.force()
				//     .charge(-120)
				//     .linkDistance(30)
				//     .size([width, height]);

				var force = d3.layout.force()
							.size([width, height])
							.charge(-370)
							.linkDistance(100)
                            //.linkStrength(0.5)
							//.gravity(0.9)

							
				var svg = d3.select(rawSvg[0])
						    .attr("width", width)
						    .attr("height", height);

				scope.$on('forceData', function(event, graph){
					  scope.peaks = graph.peaks;
					  force
					      .nodes(graph.peaks)
					      .links(graph.links)
					      .linkStrength( function(d){ return d.strength; })
					      .start();

					  var link = svg.selectAll(".link")
					      .data(graph.links)
					    .enter().append("line")
                          .attr("stroke", '#AEAEAE')
                          .attr("stroke-opacity", 0.6)
                          .attr("stroke-width", function(d) {
                          	return d.strength*10;
                          });

					  // var node = svg.selectAll(".node")
					  //     .data(graph.nodes)
					  //   .enter().append("circle")
					  //     .attr("class", "node")
					  //     .attr("r", 8)
					  //     .style("fill", function(d) { return color(d.group); })
					  //     .call(force.drag);

        // <glyph1 peak="peaks[10]" style="margin-left: 50px; margin-top: 50px"></glyph1>


					  var node = svg.selectAll(".node")
					      .data(graph.peaks)
					    .enter().append("g")
					      .attr("glyph", "")
					      .attr("class", "graphnode")
					      .attr("peak", function(d, i){ return i;})
					      // .style("fill", function(d) { return color(d.group); })
					      .call(force.drag)
					      .call(function(){
					      		$compile(this[0].parentNode)(scope);
					      });

					  node.append("title")
					      .text(function(d, i) { return graph.nodes[i].name; });

					  force.on("tick", function() {
					    link.attr("x1", function(d) { return d.source.x; })
					        .attr("y1", function(d) { return d.source.y; })
					        .attr("x2", function(d) { return d.target.x; })
					        .attr("y2", function(d) { return d.target.y; });

					    // node.attr("cx", function(d) { return d.x; })
					    //     .attr("cy", function(d) { return d.y; });
					    node
							.attr('transform', function(d, i) { return 'translate(' + d.x + ', ' + d.y + ')';} );
							// .attr('transform', function(d, i) { return 'translate(' + (d.x-d.actionWidth/2) + ', ' + (d.y-d.actionHeight/2) + ')';} );

					  });

				});
       }
   };
}]);

'use strict';

angular.module('peakanalysis').directive('glyph', ['$window',
	function($window) {
		return {
			restrict: 'EA',
			scope: true,
			link: function postLink(scope, element, attrs) {
				// Glyph directive logic
				var d3 = $window.d3;

					var rbWidth = 20,
					rbHeight = 20;

					var plotSize = 5;
					var peak = scope.peaks[attrs.peak];


					var width = peak.actionWidth,
						height = peak.actionHeight,
						percentageLine1 = peak.line1Position,
						percentageLine2 = peak.line2Position,
						rightBarRectPosition = peak.videoWeekPosition,
						bottomBarRectPosition = peak.actionPosition,
                        grade = peak.grade,
                        ave = peak.distrAve,
                        std = peak.distrStd,
                        anomaly = peak.anomaly;

                if(peak.index == 33)    rightBarRectPosition += 0.07;
                var barOffset = 5;
                var forlist = 0;
                var weekNum = [4, 7, 12, 17];
                var color = d3.scale.linear().range(['#fff7fb', '#014636']);
                color.domain([0, 1]);

                var svg = d3.select(element[0])
								.attr('width', width)
								.attr('height', height);




					// drawRect
						var rectWidth = width - rbWidth,
						rectHeight = height - rbHeight;
                        //console.log(width);
                        //console.log(rbWidth);
                        //console.log(rectWidth);

						var rect = svg.append('g')
									  .attr('transform', 'translate(1, 1)');



						//// treemap
						//var treemap = d3.layout.treemap()
						//    .size([rectWidth, rectHeight])
						//    .sticky(true)
						//    .value(function(d) { return d.size; });
                        //
						//var treedata = {
						//	 "name": "flare",
						//	 "children": [
						//	    {"name": "90 - 100", "size": grade[0], "color": "#2DA463"},
						//	    {"name": "75 - 90", "size": grade[1], "color": "#9CCF70"},
						//	    {"name": "60 - 75", "size": grade[2], "color": "#DBE697"},
						//	    {"name": "45 - 60", "size": grade[3], "color": "#FAE195"},
						//	    {"name": "30 - 45", "size": grade[4], "color": "#F6986A"},
						//	    {"name": " 0 - 30", "size": grade[5], "color": "#DB453D"}
						//	  ]
						//	};
                        //
						//var position = function(selection){
						//	selection.attr('x', function(d){ return d.x-rectWidth/2+forlist })
						//			 .attr('y', function(d){ return d.y-rectHeight/2 })
						//			 .attr('width', function(d){ return Math.max(0, d.dx) })
						//			 .attr('height', function(d){ return Math.max(0, d.dy) })
						//			 .style('stroke-width', 0)
	  					//			 .style("fill", function(d) { return d.children ? 'none' : d.color; });
						//};
                        //
						//var maprect = rect.datum(treedata).selectAll(".maprect")
						//	.data(treemap.nodes)
						//	.enter().append("rect")
						//	.call(position);

						rect
							.append('rect')
							.attr('width', rectWidth)
							.attr('height', rectHeight)
							.attr('x', -rectWidth/2+forlist)
							.attr('y', -rectHeight/2)
							.style('stroke', '#251818')
							.style('stroke-width', 1)
							.style('fill', 'none');

						//rect
						//	.append('line')
						//	.attr('x1', 0-rectWidth/2+forlist)
						//	.attr('y1', percentageLine2*rectHeight-rectHeight/2)
						//	.attr('x2', rectWidth-rectWidth/2+forlist)
						//	.attr('y2', percentageLine2*rectHeight-rectHeight/2)
						//	.style('stroke', '#3E3838')
						//	.style('stoke-width', 1);
                        //rect
                         //   .append('rect')
                         //   .attr('x', 0-rectWidth/2+forlist)
                         //   .attr('y', percentageLine1*rectHeight-rectHeight/2-plotSize/2)
                         //   .attr('width', percentageLine2*rectWidth)
                         //   .attr('height', plotSize)
                         //   .style('fill', 'black')
                         //   // .style('stroke', 'pink')
                         //   .style('fill-opacity', 0.8);

                //draw grade
                var h = 0;
                var gradeColor = ["#2DA464", "#9CCF70", "#DBE697", "#FAE195", "#F6986A", "#DB453D"];
                for(var i = 0; i < grade.length; i++){
                    h += grade[i] * rectWidth;
                    rect
                        .append("rect")
                        .attr('x', rectWidth / 2 - h)
                        .attr('y', -rectHeight / 2)
                        .attr('width', grade[i] * rectWidth)
                        .attr('height', rectHeight)
                        .style("fill", gradeColor[i])
                        .style('stroke-width', 0);
                }

                ////line 80% action #people && total #people
                //rect
                //    .append('line')
                //    .attr('x1', 0-rectWidth/2+forlist)
                //    .attr('y1', percentageLine1*rectHeight-rectHeight/2)
                //    .attr('x2', rectWidth-rectWidth/2+forlist)
                //    .attr('y2', percentageLine1*rectHeight-rectHeight/2)
                //    .style('stroke', '#3E3838')
                //    .style('stoke-width', 1);

                //draw anomaly line
                rect
                    .append('line')
                    .attr('x1', 0-rectWidth/2)
                    .attr('y1', -anomaly*rectHeight + rectHeight/2)
                    .attr('x2', rectWidth/2)
                    .attr('y2', -anomaly*rectHeight + rectHeight/2)
                    .style('stroke', '#000000')
                    //.style('stroke', '#3E3838')
                    .style('stoke-width', 1);

                // drawrightBar

                    var rightBar = svg.append('g')
                        .attr('transform', 'translate(1, 1)');

                    rightBar
                        .append('line')
                        .attr('x1', rectWidth / 2 + barOffset)
                        .attr('y1', -rectHeight / 2)
                        .attr('x2', rectWidth / 2 + barOffset)
                        .attr('y2', rectHeight / 2)
                        .style('stroke', 'rgb(99,99,99)')
                        .style('stoke-width', 1);

                    rightBar
                        .append('rect')
                        .attr('x', rectWidth / 2 + barOffset - plotSize / 2)
                        .attr('y', rightBarRectPosition * rectHeight - rectWidth /2)
                        .attr('width', plotSize)
                        .attr('height', plotSize)
                        .style('fill', 'blue')
                        .style('stroke-width', 0)
                        // .style('stroke', 'pink')
                        .style('fill-opacity', 0.8);

                    //for (var i = 0; i < weekNum.length - 1; i++) {
                    //    rightBar
                    //        .append('line')
                    //        .attr('x1', rectWidth / 2 + barOffset)
                    //        .attr('y1', -rectHeight / 2 + weekNum[i] / weekNum[weekNum.length - 1] * rectHeight)
                    //        .attr('x2', rectWidth / 2 + barOffset * 2)
                    //        .attr('y2', -rectHeight / 2 + weekNum[i] / weekNum[weekNum.length - 1] * rectHeight)
                    //        .style('stroke', 'rgb(99,99,99)')
                    //        .style('stoke-width', 0.5);
                    //}


                // drawtbottomBar

                	var bottomBar = svg.append('g')
                					   .attr('transform', 'translate(1,1)');

                bottomBar
                        .append('line')
                        .attr('x1', - rectWidth / 2)
                        .attr('y1', rectHeight / 2 + barOffset)
                        .attr('x2', rectWidth / 2)
                        .attr('y2', rectHeight / 2 + barOffset)
                        .style('stroke', 'rgb(99,99,99)')
                        .style('stoke-width', 1);

                bottomBar
                        .append('rect')
                        .attr('x', bottomBarRectPosition * rectWidth - rectWidth / 2)
                        .attr('y', rectHeight / 2 + barOffset - plotSize / 2)
                        .attr('width', plotSize)
                        .attr('height', plotSize)
                        .style('fill', 'blue')
                        .style('stroke-width', 0)
                        // .style('stroke', 'pink')
                        .style('fill-opacity', 0.8);

                //
                //// drawBottomBar
                //
                //    var bottomBar = svg.append('g')
                //        .attr('transform', 'translate(1, 1)');
                //
                //    bottomBar
                //        .append('line')
                //        .attr('x1', 0 - rectWidth / 2)
                //        .attr('y1', rectHeight / 2 + barOffset)
                //        .attr('x2', rectWidth / 2)
                //        .attr('y2', rectHeight / 2 + barOffset)
                //        .style('stroke', 'rgb(99,99,99)')
                //        .style('stoke-width', 1);
                //
                //    bottomBar
                //        .append('rect')
                //        .attr('x', rightBarRectPosition * rectWidth - rectWidth / 2)
                //        .attr('y', rectHeight / 2 + barOffset - plotSize / 2)
                //        .attr('width', plotSize)
                //        .attr('height', plotSize)
                //        .style('fill', 'blue')
                //        // .style('stroke', 'pink')
                //        .style('fill-opacity', 0.8);
                //
                //    for (var i = 0; i < weekNum.length - 1; i++) {
                //        bottomBar
                //            .append('line')
                //            .attr('x1', -rectWidth / 2 + weekNum[i] / weekNum[weekNum.length - 1] * rectWidth)
                //            .attr('y1', rectHeight / 2 + barOffset)
                //            .attr('x2', -rectWidth / 2 + weekNum[i] / weekNum[weekNum.length - 1] * rectWidth)
                //            .attr('y2', rectHeight / 2 + barOffset + barOffset)
                //            .style('stroke', 'rgb(99,99,99)')
                //            .style('stoke-width', 0.5);
                //    }
                //
                //
                //// drawtTopBar
                //
                //	var TopBar = svg.append('g')
                //					   .attr('transform', 'translate(1,1)');
                //
                //    TopBar
                //        .append('line')
                //        .attr('x1', 0 - rectWidth / 2 + std)
                //        .attr('y1', -rectHeight / 2 - barOffset)
                //        .attr('x2', -rectWidth / 2 + ave + std)
                //        .attr('y2', -rectHeight / 2 - barOffset)
                //        .style('stroke', 'rgb(99,99,99)')
                //        .style('stoke-width', 1);
                //
                //    TopBar
                //        .append('rect')
                //        .attr('x', rightBarRectPosition * ave - rectWidth / 2 + std)
                //        .attr('y', -rectHeight / 2 - barOffset - plotSize / 2)
                //        .attr('width', plotSize)
                //        .attr('height', plotSize)
                //        .style('fill', 'blue')
                //        // .style('stroke', 'pink')
                //        .style('fill-opacity', 0.8);
                //
                //
                ////draw deacon
                //var deacon = svg.append('g')
                //						  .attr('transform', 'translate(1, 1)');
                //var corners = [];
                //corners.push({'x': -rectWidth/2, 'y':  rectHeight/2});
                //corners.push({'x': rectWidth/2, 'y':  rectHeight/2});
                //corners.push({'x': -rectWidth/2 + std + ave, 'y':  -rectHeight/2});
                //corners.push({'x': -rectWidth/2 + std, 'y': - rectHeight/2});
                //
                //deacon
                //    .append('line')
                //    .attr('x1', corners[0].x)
                //    .attr('y1', corners[0].y)
                //    .attr('x2', corners[1].x)
                //    .attr('y2', corners[1].y)
                //    .style('stroke', '#3E3838')
                //    .style('stoke-width', 1);
                //
                //deacon
                //    .append('line')
                //    .attr('x1', corners[3].x)
                //    .attr('y1', corners[3].y)
                //    .attr('x2', corners[2].x)
                //    .attr('y2', corners[2].y)
                //    .style('stroke', '#3E3838')
                //    .style('stoke-width', 1);
                //
                //deacon
                //    .append('line')
                //    .attr('x1', corners[0].x)
                //    .attr('y1', corners[0].y)
                //    .attr('x2', corners[3].x)
                //    .attr('y2', corners[3].y)
                //    .style('stroke', '#3E3838')
                //    .style('stoke-width', 1);
                //
                //deacon
                //    .append('line')
                //    .attr('x1', corners[1].x)
                //    .attr('y1', corners[1].y)
                //    .attr('x2', corners[2].x)
                //    .attr('y2', corners[2].y)
                //    .style('stroke', '#3E3838')
                //    .style('stoke-width', 1);
                //
                //var lineFunction = d3.svg.line()
                //    .x(function(d) { return d.x; })
                //    .y(function(d) { return d.y; })
                //    .interpolate("linear");
                //
                //var lineData = [];
                //for(var i = 0; i < grade.length; i++){
                //    lineData = [];
                //    lineData.push({'x': corners[0].x*i/grade.length + corners[3].x*(grade.length-i)/grade.length, 'y': corners[0].y*i/grade.length + corners[3].y*(grade.length-i)/grade.length});
                //    lineData.push({'x': corners[1].x*i/grade.length + corners[2].x*(grade.length-i)/grade.length, 'y': corners[1].y*i/grade.length + corners[2].y*(grade.length-i)/grade.length});
                //    lineData.push({'x': corners[1].x*(i+1)/grade.length + corners[2].x*(grade.length-i-1)/grade.length, 'y': corners[1].y*(i+1)/grade.length + corners[2].y*(grade.length-i-1)/grade.length});
                //    lineData.push({'x': corners[0].x*(i+1)/grade.length + corners[3].x*(grade.length-i-1)/grade.length, 'y': corners[0].y*(i+1)/grade.length + corners[3].y*(grade.length-i-1)/grade.length});
                //    deacon
                //        .append("path")
                //        .attr("d", lineFunction(lineData))
                //        .attr("stroke", "blue")
                //        .attr("stroke-width", 0.5)
                //        //.attr("fill", color(Math.sqrt(grade[i])));
                //        .attr("fill", color(0));
                //}

			}
		};
	}
]);

'use strict';

angular.module('peakanalysis').directive('graphmds', ["$window", "$compile", "$modal", function($window, $compile, $modal){
   return{
      restrict:'EA',
      scope: {

      },
      template:"<svg></svg>",
       link: function(scope, element, attrs){

       			var d3 = $window.d3;
          	var rawSvg=element.find('svg');

            var outerWidth = $('#graphmds_container').width();
            var outerHeight = $('#graphmds_container').height();
            var margin = {top: 50, right: 100, bottom: 50, left: 100};  
            var width = outerWidth - margin.left - margin.right,
                height = outerHeight - margin.top - margin.bottom;

            var svg = d3.select(rawSvg[0])
                .attr('width', outerWidth)
                .attr('height', outerHeight)
               .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var myModal = $modal({
                    title: 'My Title', 
                    content: 'My Content', 
                    show: false, 
                    template: 'modules/peakanalysis/views/template/graph.glyph.modal.html',
                    scope: scope
                  });
            scope.showModal = function() {
              myModal.$promise.then(myModal.show);
            };

            scope.$on('forceData', function(event, graph){
                // console.log(graph);
                var coordinate = graph.coordinate;
                var nodes = graph.nodes;
                var peakBasicInfo = graph.peakBasicInfo;
                scope.peaks = graph.peaks;
                var peaks = graph.peaks;

                var xdomain = d3.extent(coordinate, function(d){ return d[0]; });
                var ydomain = d3.extent(coordinate, function(d){ return d[1]; });

                var x = d3.scale.linear().range([0, width]).domain(xdomain);
                var y = d3.scale.linear().range([0, height]).domain(ydomain);

                angular.forEach(coordinate, function(d){
                  d[0] = x(d[0]);
                  d[1] = y(d[1]);
                });

                preventOverlap(coordinate, 35, 30);

                var drawGlyph = function(glyph) {


                  glyph.selectAll(".node")
                       .data(peaks)
                      .enter().append("g")
                       .attr('transform', function(d, i) { return 'translate(' + coordinate[i][0] + ', ' + coordinate[i][1] + ')';} )
                       .attr("glyph", "")
                       .attr("class", function(d, i){ return "graphnode peak" + i; })
                       .attr("peak", function(d, i){ return i;})
                       .on("click", function(d, i){
                          var timeFrom = peakBasicInfo[i].currentTime;
                          var timeTo = peakBasicInfo[i].currentTime + peakBasicInfo[i].peakWidth;
                          peakBasicInfo[i].fromTime = Math.floor(timeFrom / 60) + 'm' + (timeFrom % 60) + 's';
                          peakBasicInfo[i].toTime = Math.floor(timeTo / 60) + 'm' + (timeTo % 60) + 's';
                          scope.peakTitle = "peak#" + i;
                          scope.peakId = i;
                          scope.peakInfo = peakBasicInfo[i];
                          scope.showModal();
                       })
                      .append("title")
                       .text(function(d, i) { return nodes[i].name; })
                      .call(function(){
                         $compile(this[0].parentNode)(scope);
                      });
                };

                var drawEdge = function(edge) {
                };

                svg.append('g')
                    .call(drawGlyph);

                svg.append('g')
                    .call(drawEdge);

            });

            var preventOverlap = function(coordinate, radius, times, rate){
               var t = times == undefined ? 3 : times;
               var r = rate == undefined ? 1 : rate;
               var overlaps = 0;
               var items = coordinate;
               var count = 0;
               while(count < t){
                   //console.log(count);
                   for (var i = 0; i < items.length-1; i++) {

                       for (var j = i+1 ; j < items.length; j++) {
                           var dx = items[i][0] - items[j][0];
                           var dy = items[i][1] - items[j][1];
                           var dd = Math.sqrt(dx * dx + dy * dy);
                           if(dd < (2 * radius) ) {
                               overlaps ++;
                               var l = radius - dd / 2;
                               var xx = l * (dx / dd);
                               var yy = l * (dy / dd);

                               items[i][0] = items[i][0] + xx;
                               items[i][1] = items[i][1] + yy;
                               items[j][0] = items[j][0] - xx;
                               items[j][1] = items[j][1] - yy;

                               overlaps ++;
                           }
                       }
                   }
                   count ++;
               }
            };

       }
   };
}]);

'use strict';

angular.module('peakanalysis').directive('pcoords', function() {
	return {
		restrict: 'EA',
		template: '',
		scope: {
			data: '='
		},
		link: function (scope, element, attrs) {
            console.log(scope);
            console.log(element);
            var width = $(element.parent()).width();
            var height = $(element.parent()).height();


			//var svg = d3.select(element[0])
			//	.append("svg")
			//	.attr("width", 1000)
			//	.attr("height", 425)
			//	.attr("opacity", 0.8);

			//svg.append("line")
			//	.attr("x1", 0)
			//	.attr("y1", 400)
			//	.attr("x2", 700)
			//	.attr("y2", 400)
			//	.attr("stroke-width", 5)
			//	.attr("stroke", "black");

			scope.$watch('data',function(newValue, oldValue){
                if (newValue == oldValue) return;
                var data = newValue;

                var isDrawline = false;
				//clear previous svg
				//svg.selectAll("*").remove();

                var courseId = data[0];
				var dataTmp = data[1];
				var dataSub = [];
                var dataFiltered = [];
                var fidelityUp = 20;
                var fidelityLow = 0;

                if(courseId == 4) {
                    var peakInfo = [
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-b3fda93c4a834941833938476bb523a4',
                            "currentTime": 90,
                            "duration": 27,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-34fa085d32834ea680d3f15267feeb05',
                            "currentTime": 258,
                            "duration": 15,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-a08315fc6cf94115a87cf54eea25f8f4',
                            "currentTime": 300,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-77241c1ca2c04ed484a4fdf5b2be2b11',
                            "currentTime": 120,
                            "duration": 18,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-998df4d395ff49c3a28f2c412877b31b',
                            "currentTime": 96,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-15995d131e824f51829ed8fa7c66f0f3',
                            "currentTime": 258,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-a801c259109c4142af52627719d86276',
                            "currentTime": 63,
                            "duration": 27,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-dc84f1613615468ab4398116e65c44ec',
                            "currentTime": 135,
                            "duration": 48,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-41be73088c1f4ce9a49d1d6a1023c749',
                            "currentTime": 132,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-c4f82aa0be544e75972611ef2e38bdd9',
                            "currentTime": 3,
                            "duration": 27,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-9af430c237cc437ab0b79524dbad39b9',
                            "currentTime": 132,
                            "duration": 45,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-272c5ddf3090448a8c4ba6431a412dd3',
                            "currentTime": 255,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-9e3afc26c7a9476689520604916c5f30',
                            "currentTime": 294,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-202b44fa40e54f37a5a21ec9e4ec4c83',
                            "currentTime": 177,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-2f1a5bc4d3df4117b23ebf84ea0a1463',
                            "currentTime": 168,
                            "duration": 48,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-35ce36436c2b4b5abb4b9b94277f529f',
                            "currentTime": 135,
                            "duration": 48,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-48f450f9c4294c64a5fa84ae46464968',
                            "currentTime": 57,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-d48dbda9e97843108322c3305bc1c36e',
                            "currentTime": 360,
                            "duration": 36,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-9be6136b9b434652b7d7234f03c81c0f',
                            "currentTime": 111,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-2680e14cba5e43f488d9c9fc73e25cb9',
                            "currentTime": 291,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-d86629a449b04f60bc822939efc0e832',
                            "currentTime": 387,
                            "duration": 33,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-0d07c7ccf9ff48ce9dff58a59638138b',
                            "currentTime": 6,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-d96395769f254797bd02e23b27ab674b',
                            "currentTime": 45,
                            "duration": 27,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-4bbee764bc3c454e9d713c4671d76adc',
                            "currentTime": 180,
                            "duration": 36,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-efe9da4eec274da2b4e1604413d53569',
                            "currentTime": 99,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-345d0f4f55fa4cd3bf1dcce8a6235714',
                            "currentTime": 171,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-4e274308c82945eebe807be64e1e928d',
                            "currentTime": 9,
                            "duration": 27,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-a139188f9b2f4058be128f81b81a1731',
                            "currentTime": 57,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-677dc993a9ca4bada0216b8bb1931c69',
                            "currentTime": 150,
                            "duration": 30,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-c0172ef01c0b464cb74d099dec72f4a9',
                            "currentTime": 141,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-95a62e7a89434e708a97c3ff43ab9158',
                            "currentTime": 270,
                            "duration": 39,
                            "issubPeak": false
                        },
                        {
                            "videoId": 'i4x-HKUSTx-COMP102x-video-0db020fdd24d4928bbce21364445063b',
                            "currentTime": 600,
                            "duration": 39,
                            "issubPeak": false
                        }
                    ];    //java
                }else if(courseId == 1) {
                    var peakInfo = [
                        {
                            "videoId": 3,
                            "currentTime": 15,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 5,
                            "currentTime": 21,
                            "duration": 6,
                            "issubPeak": false
                        },
                        {
                            "videoId": 5,
                            "currentTime": 57,
                            "duration": 9,
                            "issubPeak": false
                        },
                        {
                            "videoId": 3,
                            "currentTime": 300,
                            "duration": 9,
                            "issubPeak": true
                        },
                        {
                            "videoId": 3,
                            "currentTime": 612,
                            "duration": 24,
                            "issubPeak": true
                        },
                        {
                            "videoId": 7,
                            "currentTime": 108,
                            "duration": 66,
                            "issubPeak": false
                        },
                        {
                            "videoId": 7,
                            "currentTime": 321,
                            "duration": 69,
                            "issubPeak": false
                        },
                        {
                            "videoId": 7,
                            "currentTime": 672,
                            "duration": 48,
                            "issubPeak": true
                        },
                        {
                            "videoId": 9,
                            "currentTime": 141,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 9,
                            "currentTime": 231,
                            "duration": 39,
                            "issubPeak": false
                        },
                        {
                            "videoId": 9,
                            "currentTime": 480,
                            "duration": 42,
                            "issubPeak": false
                        },
                        {
                            "videoId": 9,
                            "currentTime": 714,
                            "duration": 36,
                            "issubPeak": true
                        },
                        {
                            "videoId": 11,
                            "currentTime": 414,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 11,
                            "currentTime": 198,
                            "duration": 39,
                            "issubPeak": true
                        },
                        {
                            "videoId": 13,
                            "currentTime": 153,
                            "duration": 18,
                            "issubPeak": true
                        },
                        {
                            "videoId": 13,
                            "currentTime": 621,
                            "duration": 24,
                            "issubPeak": true
                        },
                        {
                            "videoId": 13,
                            "currentTime": 684,
                            "duration": 42,
                            "issubPeak": true
                        },
                        {
                            "videoId": 15,
                            "currentTime": 72,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 15,
                            "currentTime": 219,
                            "duration": 18,
                            "issubPeak": true
                        },
                        {
                            "videoId": 15,
                            "currentTime": 564,
                            "duration": 75,
                            "issubPeak": false
                        },
                        {
                            "videoId": 17,
                            "currentTime": 177,
                            "duration": 12,
                            "issubPeak": true
                        },
                        {
                            "videoId": 17,
                            "currentTime": 291,
                            "duration": 18,
                            "issubPeak": false
                        },
                        {
                            "videoId": 19,
                            "currentTime": 15,
                            "duration": 24,
                            "issubPeak": true
                        },
                        {
                            "videoId": 21,
                            "currentTime": 24,
                            "duration": 12,
                            "issubPeak": true
                        },
                        {
                            "videoId": 21,
                            "currentTime": 90,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 21,
                            "currentTime": 240,
                            "duration": 6,
                            "issubPeak": true
                        },
                        {
                            "videoId": 21,
                            "currentTime": 312,
                            "duration": 9,
                            "issubPeak": true
                        },
                        {
                            "videoId": 23,
                            "currentTime": 15,
                            "duration": 18,
                            "issubPeak": false
                        },
                        {
                            "videoId": 23,
                            "currentTime": 369,
                            "duration": 18,
                            "issubPeak": true
                        },
                        {
                            "videoId": 23,
                            "currentTime": 486,
                            "duration": 18,
                            "issubPeak": true
                        },
                        {
                            "videoId": 25,
                            "currentTime": 33,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 25,
                            "currentTime": 96,
                            "duration": 12,
                            "issubPeak": true
                        },
                        {
                            "videoId": 25,
                            "currentTime": 300,
                            "duration": 12,
                            "issubPeak": true
                        },
                        {
                            "videoId": 27,
                            "currentTime": 15,
                            "duration": 18,
                            "issubPeak": false
                        },
                        {
                            "videoId": 27,
                            "currentTime": 333,
                            "duration": 33,
                            "issubPeak": false
                        },
                        {
                            "videoId": 27,
                            "currentTime": 408,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 29,
                            "currentTime": 27,
                            "duration": 24,
                            "issubPeak": true
                        },
                        {
                            "videoId": 29,
                            "currentTime": 303,
                            "duration": 63,
                            "issubPeak": true
                        },
                        {
                            "videoId": 33,
                            "currentTime": 132,
                            "duration": 21,
                            "issubPeak": false
                        },
                        {
                            "videoId": 33,
                            "currentTime": 216,
                            "duration": 24,
                            "issubPeak": false
                        },
                        {
                            "videoId": 35,
                            "currentTime": 96,
                            "duration": 12,
                            "issubPeak": true
                        }
                    ];  //nch
                }
                var countryNames = ["ARG", "AUS", "BRA", "CAN", "CHN", "COL", "FRA", "DEU", "GRC", "HKG", "IND", "ITA", "MEX", "NLD", "PHL", "POL", "ROU", "RUS", "SGP", "ESP", "UKR", "GBR", "USA"];

                //var peakTotal = [0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0];

				for(var i = 0; i < dataTmp.length; i++){
					var obj = {};
					var seekCount = 0;
                    var peakCount = 0;
                    obj['country'] = dataTmp[i].country;
                    if(countryNames.indexOf(obj['country']) < 0)    continue;
                    obj['grade'] = dataTmp[i].grade;
                    obj['droptime'] = 0;
                    obj['droptime'] = dataTmp[i].dropTime;
                    if(courseId == 4) {
                        obj['posts'] = dataTmp[i].forumposts;
                        if ([obj['posts']] > 100)    obj['posts'] = 100;
                    }
                    //obj['review'] = dataTmp[i].review;
                    //obj['delay'] = dataTmp[i].delay;
                    obj['loyalty'] = 0;
                    obj['review'] = dataTmp[i].review;
                    //if(obj['review'] > 3)   obj['review'] = 3;
                    obj['delay'] = dataTmp[i].delay;
                    if(obj['delay'] < 0)    obj['delay'] = 0;
                    obj['activeness'] = dataTmp[i].activeness;
                    if(obj['activeness'] > 10) obj['activeness'] = 10;
                    //if(obj['grade'] < 60) obj['test'] = 10;
                    //if(obj['grade'] < 1) continue;
                    var droptime = 0;
                    for(var j= 0; j < peakInfo.length; j++){
                        peakCount++;
                        var axisKey = 'Peak' + j;
                        //peakTotal[j] += dataTmp[i][axisKey];
                        //if(peakInfo[j].issubPeak == true) continue;
                        if(dataTmp[i][axisKey] > 0){
                            seekCount ++;
                            droptime = peakCount;
                        }
                        //console.log(dataTmp[i][axisKey]);
                        //if(peakCount > 30)  continue;
                        if(j > 20)  continue;
						if(dataTmp[i][axisKey] < 20){
							obj[axisKey] = dataTmp[i][axisKey];
						}else{
							obj[axisKey] = 20;
						}
                    }
                    //obj['droptime'] = droptime;   //nch only
                    obj['loyalty'] = seekCount;
                    //if(seekCount > 500) obj['seeked'] = 500;
					//if(seekCount < 1)	continue;
					dataSub.push(obj);
				}
                //console.log(peakTotal);
				console.log(dataSub);

                var pc = d3.parcoords()(element[0])
                    .data(dataSub)
                    .bundlingStrength(0)
                    .smoothness(0)
                    .bundleDimension("country")
                    //.tickValues([0, 1, 5, 10, 50, 100])
                    .color("#FE7E13")
                    .alpha(0.05)
                    //.composite("darker")
                    .margin({top: 24, left: 20, bottom: 12, right: 0})
                    .mode("queue")
                    .isDrawline(isDrawline)
                    .render();
                    //.createAxes()
                    //.shadows()
                    //.reorderable()
                    //.brushMode("1D-axes");



                var axisKeys = Object.keys(pc.yscale);

                //pc.yscale[axisKeys[0]] = d3.scale.range([0, 600]);
                //pc.yscale[axisKeys[1]] = d3.scale.linear()
                //    .domain([50, 0])
                //    .range([0, 566]);
                //for(var i=7; i<axisKeys.length; i++){
                //    pc.yscale[axisKeys[i]] = d3.scale.pow().exponent(.3)
                //        .domain([20, 0])
                //        .range([0, 566]);
                //}
                if(courseId == 1)   var attrAxesNum = 7;
                else if(courseId ==4)   var attrAxesNum =8;
                for(var i=attrAxesNum; i<axisKeys.length; i++){
                    pc.yscale[axisKeys[i]] = d3.scale.linear()
                        .domain([20.5, 0.5])
                        .range([0, height - 35]);
                        //.range(pc.yscale[axisKeys[0]].range());
                }

                pc.render()
                    .createAxes()
                    //.shadows()
                    .reorderable()
                    .brushMode("1D-axes");

                d3.select("#filterLow").on("change", function() {
                    fidelityLow = this.value;
                    d3.select("#lowerBound").text(this.value);

                    dataFiltered = [];
                    var axisKeys = Object.keys(pc.yscale);
                    for(var i = 0; i < dataSub.length; i++){
                        var obj = {};
                        for(var j = 0; j < 7 + fidelityLow; j++){
                            obj[axisKeys[j]] = dataSub[i][axisKeys[j]];
                        }
                        dataFiltered.push(obj);
                    }

                    d3.select("#total").text(dataFiltered.length);

                    console.log(dataFiltered);
                    pc.data(dataFiltered)
                        .createAxes()
                        //.shadows()
                        .reorderable()
                        .brushMode("1D-axes")
                        .render();
                });

                //change opacity
                d3.select("#filterUp").on("change", function() {
                    var opacity = this.value;
                    d3.select("#upperBound").text(this.value);

                    pc
                        .alpha(opacity)
                        .render();
                });

                //change drawing mode
                d3.select("#changemodebutton").on("click", function(){
                    console.log(isDrawline);
                    isDrawline = !isDrawline;
                    pc
                        .isDrawline(isDrawline)
                        .render();
                })

                d3.selectAll('path.domain')
                  .attr('fill', 'none')
                  .attr('stroke', '#222')
                  .attr('stroke-width', 1);

                d3.selectAll('.dimension .brush rect')
                  .attr('fill', 'transparent')
                  .attr('stroke', 'none')
                  .attr('stroke-width', 0);

                d3.selectAll('.dimension .brush .extent')
                  .attr('fill', 'transparent')
                  .attr('stroke', '#9E9E9E')
                  .attr('stroke-width', 4);


			})
		}
	}
});

'use strict';

//Setting up route
angular.module('vismooc').config(['$stateProvider',
	function($stateProvider) {
		// Vismooc state routing
		$stateProvider.
		state('content', {
			url: '/content',
			templateUrl: 'modules/vismooc/views/content.client.view.html'
		});
	}
]);


visMOOCApp.controller('AnimationCtrl',['$scope',serviceID, serviceData, AnimationCtrl]);
function AnimationCtrl($scope, pubsubService, dataManagerService){
    $scope.courseInfo = -1;
    $scope.aside = {title: 'Title', content: 'Hello Aside<br />This is a multiline message!'};
    pubsubService.onChangeCourse($scope, function(courseID){
        if (courseID >= 0) {
            dataManagerService.getCourseInfo(courseID, function(data){
                $scope.courseInfo = data;
            });
        }
    });
}


var contentBasedController = visMOOCApp.controller('contentBasedCtrl',['$scope', serviceID, serviceData, '$sce', contentBasedCtrl]);
function contentBasedCtrl($scope, pubsubService, dataManagerService, $sce){

          console.log($('#viscontent').innerWidth());
          console.log($('#viscontent').width());

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

        $scope.onUpdateTime = function($currentTime, $duration) {
            $scope.$apply(function () {
              var percentage = $currentTime / $duration * 100;
              $('#timeProgressBar').css('width', percentage+'%');
            });
        };

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
                },
                fireClickEvent: function(e){
                  $scope.currentTime = e.pointXValue;
                  console.log($('#video'));
                  $('#video')[0].childNodes[0].currentTime = Math.floor($scope.currentTime * ($('#video')[0].childNodes[0].duration - 5) /($('#video')[0].childNodes[0].duration) + 2);
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
  pubsubService.onChangeVideo($scope, function(videoInfo){
    if (videoInfo) {
      $scope.videoSrc = videoInfo.videoSource;
      $scope.videoID = videoInfo.videoId;
      $scope.currentTime = 0;

      $scope.config.sources = [
        {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/webm"},
        {src: $sce.trustAsResourceUrl(videoInfo.videoSource), type: "video/ogg"}
      ];
      setData(videoInfo.videoId);
    }
  });

  pubsubService.onFilterCountry($scope, function(countryID){
    if (countryID) {
      $scope.country = countryID;
      setData($scope.videoID, {country: countryID});
    }
  });

  pubsubService.onFilterDate($scope, function(period){
    if (period) {
      $scope.period = period;
      setData($scope.videoID, {period: period});
    }
  });

  pubsubService.onChangeCourse($scope, function(courseID){
    if (courseID) {
      $scope.selectedCourseId = courseID;
    }
  });


  $scope.IntroOptions = {
        steps:[
        {
            element: '#seekline_id',
            intro: "Orange lines are forward seeks, which show that users\
            skip certain part of the video, while blue lines are backward seeks, \
            which mean that users review some part of the video."
        },
        {
            element: '#stacked_id',
            intro: "The stacked bar chart shows the number of actions per second of the video. \
            X-axis indicates the position corresponding to the video, while Y-axis displays the number of actions.\
            Different colors indicate different kinds of actions.",
            position: 'top'
        },

        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };
    $scope.ShouldAutoStart = function() {
        return true;
    }
    $scope.count=0;
    $scope.showTooltip=function(){
      console.log("called show tooltip");      
      if($scope.count>0){
        // $scope.CallMe();
      }else{
        $scope.CallMe();
        $scope.count++;
      }
    }


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
  var getWeeks=function(seekData){
    var ret={};
    for(var i=0, len=seekData.length;i<len;i++){
      var tempKey=''+seekData[i].week;
      if(!ret.hasOwnProperty(tempKey)){
        ret[tempKey]=1;
      }else{
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
    // console.log("seek data changed")
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
  }

  var processSeekDataWithBrush = function(data){
      $scope.seekData = data;
      $scope.$apply();
  }


  $scope.addMouseDown=function(){
    $scope.isMouseOn=false;
    console.log("mouse down")
  }
  $scope.mouseCount=0;
  $scope.addMouseUp=function(){
    $scope.mouseCount++;
    $scope.isMouseOn=true;
    console.log("mouse up")
  }
  $scope.threshold=30;



  function setData(videoID,filter){
    if (filter){
      if (filter.country){
          dataManagerService.getActionCountInfoByCountry( $scope.selectedCourseId,videoID,filter.country,processData );
          dataManagerService.getSeekInfoByCountry($scope.selectedCourseId,videoID,filter.country,processSeekData);
      } else if (filter.period){
          dataManagerService.getActionCountInfoByTime($scope.selectedCourseId,videoID,filter.period.startDate,filter.period.endDate,processData );
          dataManagerService.getSeekInfoByTime($scope.selectedCourseId,videoID,filter.period.startDate,filter.period.endDate,$scope.passDataToController);
      }
    } else{
        dataManagerService.getActionCountInfo($scope.selectedCourseId,videoID,processData);
        dataManagerService.getSeekInfo($scope.selectedCourseId,videoID,processSeekData);
    }
  }
}


visMOOCApp.directive('currentVideoPlayTime', function () {
 return {
   controller: ["$scope", "$element", function ($scope, $element){
     $scope.onTimeUpdate = function(){
       $scope.$apply(function () {
         $scope.currentPlayTime = $element[0].currentTime;
         var percentage = $element[0].currentTime / $element[0].duration * 100;
         $('#timeProgressBar').css('width', percentage+'%');
       });
     }
   }],
   link: function(scope, ele){
     ele.bind('timeupdate', scope.onTimeUpdate);
   }
 }
});


visMOOCApp.controller('courseInfoCtrl',['$scope',serviceID, serviceData, courseInfoCtrl]);
function courseInfoCtrl($scope, pubsubService, dataManagerService) {
    $scope.courseInfo = -1;
    pubsubService.onChangeCourse($scope, function (courseID) {
        if (courseID >= 0) {
            dataManagerService.getCourseInfo(courseID, function(data){
                $scope.courseInfo = data;
            });
        }
    });
}


visMOOCApp.controller('forumSocialNetwork',['$scope',serviceID, serviceData, 'pip', '$timeout', forumSocialNetwork]);
function forumSocialNetwork($scope, pubsubService, dataManagerService, pip, $timeout){
      $scope.courseID = -1;
      $scope.option = {
        width: 1200,
        height: 600
      };

      $scope.threshold={value:3};
      $scope.showInfo="No selection";

      pubsubService.onChangeCourse($scope, function (courseID) {
        if (courseID >= 0) {
          $scope.courseID = courseID;
          var threshold=$scope.threshold;
          dataManagerService.getForumSocialNetwork(courseID, threshold.value, function(data){
             $scope.datacopy = data;
             $scope.data = data;
          });
            dataManagerService.getDemographicData($scope.courseID, function(data) {
                $scope.geodata= data;
            });
        }
      });

    pip.onGraphUsername($scope,function(data){
        var userId=data[0];
        var username=data[1];
        $scope.showInfo='Selected user: '+username;

        dataManagerService.getWordCloudData($scope.courseID, userId, function(data){
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
    pip.onCode3($scope,function(data){
        $scope.$apply(function(){
            $scope.countrycode=data;
            $scope.showInfo='Selected country: '+data;
        });
        dataManagerService.getWordCloudDataByGeo($scope.courseID, $scope.countrycode, function(data){
            $scope.wordCloudData = data;
        });
    });

    $scope.changeThreshold=function(){
      console.log($scope.threshold.value);
          dataManagerService.getForumSocialNetwork($scope.courseID, $scope.threshold.value, function(data){
            console.log('data changed')
            console.log($scope)
            $scope.data= data;
            $scope.datacopy= data;
          });
    }

    $scope.IntroOptions = {
        steps:[
        {
            element: '#graph_id',
            intro: "This graph diagram shows how users interact with each other in the forum.\
            ",
            position: 'left'
        },
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };

    $scope.count=0;
    $scope.showTooltip=function(){
      if($scope.count>0){
      }else{
        $scope.CallMe();
        $scope.count++;
      }
    }
    // $scope.addMouseDown=function(){
    //   $scope.isMouseOn=false;
    //   console.log($scope.isMouseOn)
    //   console.log("mouse down")
    // }
    // $scope.addMouseUp=function(){
    //   $scope.isMouseOn=true;
    //   console.log($scope.isMouseOn)
    //   console.log("mouse up")
    // }
}


visMOOCApp.controller('geographicInfoCtrl',['$scope',serviceID, serviceData, geographicInfoCtrl]);
function geographicInfoCtrl($scope, pubsubService, dataManagerService){
  $scope.demographicInfo = -1;
  pubsubService.onChangeCourse($scope, function(courseID){
    if (courseID) {
      dataManagerService.getDemographicData(courseID, function(data) {
          $scope.demographicInfo = data;
      });

    }
  });

  $scope.filterByCountry = function(countryID){
    pubsubService.filterCountry(countryID);
  };

    $scope.IntroOptions = {
        steps:[
        {
            element: '#step4',
            intro: "User distribution is shown here demographically. You can click each country to \
            filter users and it will affect the seek diagram and event graph.",
            position: 'left'
        },
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };
    $scope.ShouldAutoStart = function() {
        return true;
    }
    $scope.count=0;
    $scope.showTooltip=function(){
      console.log("called show tooltip");      
      if($scope.count>0){
        // $scope.CallMe();
      }else{
        $scope.CallMe();
        $scope.count++;
      }
    }
}







visMOOCApp.controller('sentimentCtrl',['$scope',serviceID, serviceData, 'pip', sentimentCtrl]);
function sentimentCtrl($scope, pubsubService, dataManagerService, pip){
      $scope.courseID = -1;
      $scope.option = {
        width: 1200,
        height: 600
      };

      pubsubService.onChangeCourse($scope, function (courseID) {
        if (courseID >= 0) {
          $scope.courseID = courseID;

          dataManagerService.getSentiment(courseID, function(data){
              $scope.sentimentData = data;
              $scope.sentimentData2 = undefined;
              $scope.showGoBack=false;
          });

        }
      });

      $scope.clickFunc=function(){
        $scope.sentimentData2=undefined;
      }


      pip.onSentiment($scope,function(data){
        if(data==='delete'){
          $scope.showGoBack=false;
          $scope.sentimentData2=undefined;
          console.log($scope.sentimentData2)
          $scope.$apply();
        }else{
          $scope.showGoBack=true;
          console.log(data.days)
          dataManagerService.getSentimentDetails($scope.courseID, data.days, function(data){
              $scope.sentimentData2 = data;
          });
        }
      });

    $scope.IntroOptions = {
        steps:[
        {
            element: '#sentiment_id',
            intro: "This diagram shows what users discussed in the forum during the course period.\
            ",
            position: 'left'
        },
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };

    $scope.count=0;
    $scope.showTooltip=function(){
      if($scope.count>0){
      }else{
        $scope.CallMe();
        $scope.count++;
      }
    }
}


visMOOCApp.controller('temporalInfoCtrl',['$scope',serviceID, serviceData, temporalInfoCtrl]);
function temporalInfoCtrl($scope,pubsubService,dataManagerService){
  $scope.videoID = -1;
  $scope.courseID = -1;
  pubsubService.onChangeCourse($scope, function(courseID){
    $scope.courseID = courseID;
  });
  pubsubService.onChangeVideo($scope, function(videoInfo){
    $scope.videoID = videoInfo.videoId;
    dataManagerService.getDailyHotnessByVideo($scope.courseID, $scope.videoID,function(data){
      $scope.hotnessData = data;
    });

  });
  $scope.filterByDate = function(date){
    pubsubService.filterDate({
      startDate: date.getTime(),
      endDate: date.getTime()+7*24*3600*1000
    });
  }

  $scope.IntroOptions = {
        steps:[
        {
            element: '#calender_id',
            intro: "You can see how video popularity varies every day using this\
            calendar view. Each block represents a month while each unit means a day.",
            position: 'left'
        },
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };

    $scope.count=0;
    $scope.showTooltip=function(){
      console.log("called show tooltip");      
      if($scope.count>0){
        // $scope.CallMe();
      }else{
        $scope.CallMe();
        $scope.count++;
      }
    }

}


visMOOCApp.controller('videoListCtrl', ['$scope', serviceID, serviceData, videoListCtrl]);
function videoListCtrl($scope,pubsubService, dataManagerService) {
  $(".sidebartest").height($(window).height()-81);

  $scope.videoList = [];
  $scope.courseList = [];


  function updateVideoList(courseID) {

    dataManagerService.getVideoList(courseID,function(data){
        $scope.videoList = data;
        $(".introjs-helperLayer").remove();
        $(".introjs-overlay").remove();
        introJs().setOption("showStepNumbers", "false");
        introJs().start();
    });
  }

  $scope.selectedVideoId = -1;
  $scope.selectedCourse = -1;

  $scope.$watch('selectedCourse.courseId', function () {
    if ( $scope.selectedCourse.courseId) {
      updateVideoList($scope.selectedCourse.courseId);
      pubsubService.changeCourse($scope.selectedCourse.courseId);
    }
  });

  $scope.setSelected = function (video) {
    $scope.selectedVideoId = video.videoId;
    pubsubService.changeVideo(video);
    console.log(video);
  };

    dataManagerService.getCourseList(function(data){
        $scope.courseList = data;
    });

  $scope.IntroOptions = {
        steps:[
        {
            element: '#step1',
            intro: "Please select your course here.",
            position: 'right'
        }
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };
    $scope.ShouldAutoStart = function() {
        return true;
    }

}



visMOOCApp.controller('videoPopInfoCtrl',['$scope',serviceID, serviceData, videoPopInfoCtrl]);
function videoPopInfoCtrl($scope, pubsubService, dataManagerService){
  $scope.courseID = -1;
  $scope.hotnessData = [];
  pubsubService.onChangeCourse($scope, function(courseID){
    $scope.courseId = courseID;

    dataManagerService.getHotness(courseID, function(data){
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
      showValues: true,
      valueFormat: function(d){
        return d3.format(',.1f')(d/1000)+"k";
      },
      transitionDuration: 500,
      xAxis: {
        axisLabel: 'Video ID'
//        axisLabelDistance: 1
      },
      yAxis: {
        axisLabel: 'Popularity (#user)',
        axisLabelDistance: 20
      }
    }
  };

}



'use strict';
angular.module('vismooc')
.controller('vHomeCtrl',
    ["$sce", function ($sce) {
        this.config = {
            preload: "none",
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
            ],
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                controls: {
                    autoHide: true,
                    autoHideTime: 5000
                }
            }
        };
    }]
);
(function () {

  'use strict';

  visMOOCApp.directive('calenderView', [function () {
      return {
        restrict: 'AE',
        scope: {
//          closeFunc: '=',
          data: '=',      //chart data, [required]
          startDate: '=',      //directive global api, [optional]
          endDate: '=',   //global events that directive would subscribe to, [optional]
          config: '=?',    //global directive configuration, [optional]
          filterCallback: '=',
          callMe:'='
        },
        link: function (scope, element, attr) {
          var parser = function(data) {
            var stats = {};
            for (var i = 0; i < data.length; i++) {
              stats[(data[i].date/1000)] = data[i].value;
            }
            return stats;
          };

          var startDateD = new Date(scope.startDate*1);
          var endDateD = new Date(scope.endDate*1);
          var range = endDateD.getMonth() - startDateD.getMonth() + 1;
          range = Math.max(range,5);
          var data = parser(scope.data);
          console.log(data);
          var cal = new CalHeatMap();
          cal.init({
            data: data,
            itemSelector: element[0],
            start: startDateD,
            domain : "month",
            subDomain : "day",
            range: range,
            cellSize: 20,
            onClick: function(date, count){
              scope.filterCallback(date);
            }
          });

          if(data){
            $(".introjs-helperLayer").remove();
            $(".introjs-overlay").remove();
            scope.callMe();
          }
        }
      };
    }]);
})();

(function () {

  'use strict';

  visMOOCApp.directive('geoinfo', [function () {
      return {
        restrict: 'AE',
        scope: {
          closeFunc: '=',
          data: '=',      //chart data, [required]
          api: '=?',      //directive global api, [optional]
          filterCallback: '=',   //global events that directive would subscribe to, [optional]
          config: '=?' ,   //global directive configuration, [optional]
          callMe:'='
        },
        link: function (scope, element, attr) {
          var datas = scope.data;
//          console.log(datas);
          var color = d3.scale.linear().range(['#edf8b1', '#2c7fb8']);
          var codeArray = [];
          for (var i = 0; i < datas.length; i++) {
            codeArray.push(datas[i].code3);
          }
          var map = new Datamap({element:  element[0], height: 280, width: 280 * 2.5,
            fills: {
              defaultFill: '#edf8b1' //any hex, color name or rgb/rgba value
            },
            geographyConfig: {
              popupTemplate: function (geo, data) {
                return ['<div class="hoverinfo"><strong>',
                    geo.properties.name + ' : ' + ((codeArray.indexOf(geo.id) > 0) ? datas[codeArray.indexOf(geo.id)].count : 0),
                  '</strong></div>'].join('');
              }
            }

          });


          var max = d3.max(datas.map(function (d) {
            return d.count;
          }));


          color.domain([0, Math.log(max)]);

          d3.select(element[0]).selectAll('.datamaps-subunit')
            .style('fill', function (d) {

              if (codeArray.indexOf(d.id) < 0) {
                return color(0);
              } else {
//                console.log(d);
                return color(Math.log(datas[codeArray.indexOf(d.id)].count));
              }
            })
            .style('stroke', '#dddddd')
            .on('click', function (d) {
                console.log(d.id);
                scope.filterCallback(d.id);
            });

          if(datas){
            console.log(scope.callMe)
            scope.callMe();
            console.log('call tooltip')
          }
        }
      };
    }]);
})();
(function () {

  'use strict';

  visMOOCApp.directive('graph', ['pip', function (pip) {

      return {
        restrict: 'AE',
        scope: {
          data: '=',      //chart data, [required]
          option: '=',
          callMe:'=',
          threshold:'=',
          countrycode:'='
        },
        link: function (scope, element, attr) {

          var svg,xScale,yScale,widthScale,xAxis,yAxis,rScale,w,h,padding;
          
          // var transition=function(){}
          var drawGraph = function(){
            w = 800;
            h = 800;
            padding = 100;

            var mappedNodes = {};
            var copyNodes={};

            scope.data.nodes.forEach(function(d){
              mappedNodes[d.id] = d;
            })

            xScale = d3.scale.linear()
                    .domain([d3.min(scope.data.nodes,function(d){
                      return d.x;
                    }), d3.max(scope.data.nodes, function(d){
                      return d.x;
                    })])
                    .range([padding,w-padding]);
            yScale = d3.scale.linear()
                     .domain([d3.min(scope.data.nodes,function(d){
                      return d.x;
                    }), d3.max(scope.data.nodes, function(d){
                      return d.x;
                    })])
                    .range([padding,h-padding]);

            rScale = d3.scale.linear()
                     .domain([d3.min(scope.data.nodes,function(d){
                      return d.size;
                    }), d3.max(scope.data.nodes, function(d){
                      return d.size;
                    })])
                    .range([2,11]);

            widthScale = d3.scale.linear()
                    .domain([d3.min(scope.data.edges,function(d){
                      return d.size;
                    }), d3.max(scope.data.edges, function(d){
                      return d.size;
                    })])
                    .range([0.1,4]);
            /*
            yScale = d3.scale.linear()
                    .domain([0.5,-0.5])
                    .range([padding,h-padding]);

            */
            if(d3.select(element[0]).select('svg').length){
              d3.select(element[0]).select('svg').remove();
            }
            svg = d3.select(element[0])
                  .append("svg")
                  .attr("width",w)
                  .attr("height",h);

             svg.selectAll('.edge')
              .data(scope.data.edges)
              .enter()
              .append('path')
              .attr("class",function(d){

                  var code=scope.countrycode;
                  if(code==='-') return 'edge';
                  if(code){
                      if(mappedNodes[d.source].code3===code &&
                          mappedNodes[d.target].code3===code
                        ) return 'edge';

                      return 'opacityedge'
                      
                  }else{
                      return 'edge';
                  }
              })
              .attr('d',function(d){
                // var path = "M" + xScale(mappedNodes[d['source']].x) + "," + yScale(mappedNodes[d['source']].y);
                // path = path + "C" +  xScale(mappedNodes[d['target']].x) + "," + yScale(mappedNodes[d['source']].y) + " ";
                // path = path + xScale(mappedNodes[d['source']].x) + "," + yScale(mappedNodes[d['target']].y) + " ";
                // path = path + xScale(mappedNodes[d['target']].x) + "," + yScale(mappedNodes[d['target']].y);
                // return path; 
                var r = (xScale(mappedNodes[d['target']].x) - xScale(mappedNodes[d['source']].x)) * (xScale(mappedNodes[d['target']].x) - xScale(mappedNodes[d['source']].x));
                r = r + (yScale(mappedNodes[d['target']].y) - yScale(mappedNodes[d['source']].y)) * (yScale(mappedNodes[d['target']].y) - yScale(mappedNodes[d['source']].y));
                r = Math.sqrt(r) * 2;
                var path = "M" + xScale(mappedNodes[d['source']].x) + "," + yScale(mappedNodes[d['source']].y);
                path = path + "A" +  r + "," + r + " 0 0 1";
                path = path + xScale(mappedNodes[d['target']].x) + "," + yScale(mappedNodes[d['target']].y);
                return path; 
              })
              .style("fill", "none")
              .style("stroke-width", function(d){return widthScale(d.size)})
              .style("stroke",function(d){return d.color});

               svg.selectAll(".node")
                .data(scope.data.nodes)
                .enter()
                .append("circle")
                .attr("class",function(d){
                    var code=scope.countrycode;
                    if(code==='-') return 'node';
                    if(code){
                        if(d.code3===code){
                            return 'node';
                        }
                        return 'opacitynode';
                    }else{
                        return 'node';
                    }
                })
                .attr("cx",function(d){
                  return xScale(d.x);
                })
                .attr("cy",function(d){
                  return yScale(d.y);
                })
                .attr("r",function(d){
                  return rScale(d.size);
                })
                .attr("fill", function(d) {
                  if(d.color==='#CCC')
                    return '#888'
                  return d.color;
                })
                .on("mouseover", function(d) {
                    var selectedNodes = [];
                    // selectedNodes.push(d);
                    // svg.selectAll(".")
                    svg.selectAll(".edge")
                    .filter(function(dd){
                       if (dd.source==d.id || dd.target==d.id)
                        {
                          selectedNodes.push(dd.source);
                          selectedNodes.push(dd.target);
                          return null;
                        } else {
                          return this;
                        }
                    })
                    .attr('opacity',"0.1");

                    svg.selectAll(".node")
                    .filter(function(dd){
                      if (selectedNodes.indexOf(dd.id)>=0) return null;
                      else return this;
                    })
                    .attr('opacity',"0.1")

                    d3.select(this)
                      .append('svg:title')
                      .append('class', 'hint')
                      .text(function(d){
                        return d.code3;
                      })
                })
                .on("mouseout", function(d) {
                    svg.selectAll(".edge")
                    .attr('opacity',"1");
                    svg.selectAll(".node")
                    .attr('opacity',"1");
                })
                .on("click", function(d) {
                  pip.emitGraphUsername([d.id, d.username]);
                })



                //add legend from here
                var margin={
                  left:50,
                  top:50,
                  right:30,
                  buttom:20,
                }
                var legendWidth=200;
                var legendHeight=20;


                var legendGText=svg.append("g")
                      .attr("transform", "translate(" + margin.left+ "," + (margin.top) + ")");

                legendGText.append("text")
                    .attr("x", 40)
                    .attr("y", -5)
                    .text("Student's grade")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");
                legendGText.append("text")
                    .attr("x", 450)
                    .attr("y", -5)
                    .text("Student's activeness")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");


                legendGText.append("text")
                    .attr("x", 0)
                    .attr("y", legendHeight+15)
                    .text("15")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");
                legendGText.append("text")
                    .attr("x", legendWidth-20)
                    .attr("y", legendHeight+15)
                    .text("100")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");
                legendGText.append("text")
                    .attr("x", legendWidth+10)
                    .attr("y", legendHeight+15)
                    .text("No grade")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");


                legendGText.append("text")
                    .attr("x", 450)
                    .attr("y", legendHeight+15)
                    .text("less")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");
                legendGText.append("text")
                    .attr("x", 550)
                    .attr("y", legendHeight+15)
                    .text("more")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");


                var idGradient="gradient_id"
                var legendG=svg.append("g")
                      .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

                    legendG.append("circle")
                      .attr("cx", 460)
                      .attr("cy", legendHeight-10)
                      .attr("r", 2)
                      .attr("fill", "red")
                    legendG.append("circle")
                      .attr("cx", 568)
                      .attr("cy", legendHeight-10)
                      .attr("r", 11)
                      .attr("fill", "red")


                    legendG.append("rect")
                          .attr("fill","black")
                          .attr("opacity",0.4)
                          .attr("x",legendWidth+20)
                          .attr("y",0)
                          .attr("width",legendHeight)
                          .attr("height",legendHeight)

                    legendG.append("defs")
                          .append("linearGradient")
                              .attr("id",idGradient)
                              .attr("x1","0%")
                              .attr("x2","100%")
                              .attr("y1","0%")
                              .attr("y2","0%"); 

                    legendG.append("rect")
                          .attr("fill","url(#" + idGradient + ")")
                          .attr("x",0)
                          .attr("y",0)
                          .attr("width",legendWidth)
                          .attr("height",legendHeight)
                          .attr("rx",2)  //rounded corners, of course!
                          .attr("ry",2);

                    var hueStart = 160, hueEnd = 0;
                    var numberHues = 35;
                    var opacityStart = 1.0, opacityEnd = 1.0;
                    var theHue, rgbString, opacity,p;

                    var deltaPercent = 1/(numberHues-1);
                    var deltaHue = (hueEnd - hueStart)/(numberHues - 1);
                    var deltaOpacity = (opacityEnd - opacityStart)/(numberHues - 1);

                    //kind of out of order, but set up the data here 
                    var theData = [];
                    for (var i=0;i < numberHues;i++) {
                        theHue = hueStart + deltaHue*i;
                        //the second parameter, set to 1 here, is the saturation
                        // the third parameter is "lightness"    
                        rgbString = d3.hsl(theHue,1,0.6).toString();
                        opacity = opacityStart + deltaOpacity*i;
                        p = 0 + deltaPercent*i;
                        //onsole.log("i, values: " + i + ", " + rgbString + ", " + opacity + ", " + p);
                        theData.push({"rgb":rgbString, "opacity":opacity, "percent":p});       
                    }

                    //now the d3 magic (imo) ...
                    var stops = d3.select('#' + idGradient).selectAll('stop')
                                        .data(theData);
                                        
                        stops.enter().append('stop');
                        stops.attr('offset',function(d) {
                                                return d.percent;
                                    })
                                    .attr('stop-color',function(d) {
                                                return d.rgb;
                                    })
                                    .attr('stop-opacity',function(d) {
                                                return d.opacity;
                                    });


                    if(scope.data){
                      $(".introjs-helperLayer").remove();
                      $(".introjs-overlay").remove();
                      scope.callMe();
                    }

              }

          scope.$watch('countrycode', function(data){
            if (data){
              drawGraph();
            } 
          }, true);

          scope.$watch('data', function(data){
            if (data){
              drawGraph();
            } 
          }, true);
        }
      };
    }]);
})();
(function () {

    'use strict';

    visMOOCApp.directive('graphgeo', ['pip', function (pip) {

        return {
            restrict: 'AE',
            scope: {
              geodata: '=',      //chart data, [required]
              selectedCountry: '=',
            },
            link: function (scope, element, attr) {
                // console.log('enter graphGeo')


                // var drawWorldMap=function(){
                //     if(d3.select(element[0]).select('svg').length){
                //         d3.select(element[0]).select('svg').remove();
                //     }

                //     var map = new Datamap({element: element[0]});

                // }
                var drawWorldMap=function(){
                    var datas = scope.geodata;
                    var height, width;
                    height = element[0].offsetHeight;
                    width = element[0].offsetWidth;
          //          console.log(datas);
                    var color = d3.scale.linear().range(['#edf8b1', '#2c7fb8']);
                    var codeArray = [];
                    for (var i = 0; i < datas.length; i++) {
                      codeArray.push(datas[i].code3);
                    }
                    var map = new Datamap({element:  element[0], height:height, width:width,
                      fills: {
                        defaultFill: '#edf8b1' //any hex, color name or rgb/rgba value
                      },
                      geographyConfig: {
                        popupTemplate: function (geo, data) {
                          return ['<div class="hoverinfo"><strong>',
                              geo.properties.name + ' : ' + ((codeArray.indexOf(geo.id) > 0) ? datas[codeArray.indexOf(geo.id)].count : 0),
                            '</strong></div>'].join('');
                        },
                        // popupOnHover: false
                      },

                    });


                    var max = d3.max(datas.map(function (d) {
                      return d.count;
                    }));


                    color.domain([0, Math.log(max)]);

                    d3.select(element[0]).selectAll('.datamaps-subunit')
                      .style('fill', function (d) {

                        if (codeArray.indexOf(d.id) < 0) {
                          return color(0);
                        } else {
          //                console.log(d);
                          return color(Math.log(datas[codeArray.indexOf(d.id)].count));
                        }
                      })
                      .style('stroke', '#dddddd')
                      .on('click', function (d) {
                          console.log(d.id);
                          pip.emitCode3(d.id);
                      });

                }
                scope.$watch('geodata', function(data){
                    if (data){
                      drawWorldMap();
                    } 
                }, true);
            }
          };
      }]);
})();
(function () {

  'use strict';

  visMOOCApp.directive('heatmap', [function () {
      return {
        restrict: 'AE',
        scope: {
//          closeFunc: '=',
          seekData: '=',      //chart data, [required]
          config: '=?'    //global directive configuration, [optional]
        },
        link: function (scope, element, attr) {

          var renderer, camera, scene;
          var height = element[0].offsetHeight;
          var width = element[0].offsetWidth;
          var toUse=[];
          var videoLength;


          var initVideoLength=function(){
            videoLength=d3.max(scope.seekData, function(d){
              return +d.currentTime;
            })
          }


          var drawDensity= function() {
            initVideoLength();
            var heatmap = createWebGLHeatmap({canvas: element[0], intensityToAlpha: true});
            var dataLength = scope.seekData.length;

            var backwardNum=0;
            var forwardNum=0;
            for (var i = scope.seekData.length - 1; i >= 0; i--) {
              if(scope.seekData[i].currentTime<scope.seekData[i].prevTime){
                backwardNum++;
              }else{
                forwardNum++;
              }
            };

            var horiRatio=width/videoLength;
            var precision=1;

            for (var i = 0; i < dataLength; i++) {
              var interval=scope.seekData[i].currentTime-scope.seekData[i].prevTime;

              var intervalAbs=Math.abs(interval);
              var number=Math.ceil(intervalAbs/precision);
              var intensity=0;
              var size=12;

              for(var j=0;j<number;j++){
                var tempX=(scope.seekData[i].prevTime+interval*j/number)*horiRatio;
                var tempY=0;
                if(interval<0){//forward
                  tempY=height/2+j/number*height/2;
                  intensity=50/backwardNum;
                }else if(interval>0){
                  tempY=j/number*height/2;
                  intensity=50/forwardNum;
                }
                heatmap.addPoint(tempX, tempY, size, intensity);
              }
            }

            heatmap.update(); // adds the buffered points
            heatmap.display(); // adds the buffered points
          }; 

          // var freshData = function() {
          // // var freshData = function(seekData, flag) {

          //   var heatmap = createWebGLHeatmap({canvas: element[0], intensityToAlpha: true});
          //   // var heatmap = createWebGLHeatmap({canvas: element[0], intensityToAlpha: true, firstview:flag});
          //   var height = element[0].offsetHeight;
          //   var width = element[0].offsetWidth;
          //   var dataLength = scope.seekData.length;
            
          //   var videoLength=d3.max(seekData, function(d){
          //     return d.currentTime;
          //   })

          //   var backwardNum=0;
          //   var forwardNum=0;
          //   for (var i = scope.seekData.length - 1; i >= 0; i--) {
          //     if(scope.seekData[i].currentTime<scope.seekData[i].prevTime){
          //       backwardNum++;
          //     }else{
          //       forwardNum++;
          //     }
          //   };

          //   var horiRatio=width/videoLength;
          //   var precision=1;

          //   for (var i = 0; i < dataLength; i++) {
          //     var interval=scope.seekData[i].currentTime-scope.seekData[i].prevTime;

          //     var intervalAbs=Math.abs(interval);
          //     var number=Math.ceil(intervalAbs/precision);
          //     var intensity=0;
          //     var size=12;

          //     for(var j=0;j<number;j++){
          //       var tempX=(scope.seekData[i].prevTime+interval*j/number)*horiRatio;
          //       var tempY=0;
          //       if(interval<0){//forward
          //         tempY=height/2+j/number*height/2;
          //         intensity=50/backwardNum;
          //       }else if(interval>0){
          //         tempY=j/number*height/2;
          //         intensity=50/forwardNum;
          //       }
          //       heatmap.addPoint(tempX, tempY, size, intensity);
          //     }
          //   }

          //   heatmap.update(); // adds the buffered points
          //   heatmap.display(); // adds the buffered points
          // };

          scope.api = {
            initDraw: drawDensity
            // refresh: freshData
          };
          scope.$watch('seekData', function(data){
            if (data) {
              // positionOne=0;
              // positionTwo=width;
              scope.api.initDraw();
            } 
          }, true);
          // scope.$watch('seekData', function(data){if (data) scope.api.refresh(); }, true);
        }
      };
    }]);
})();
(function () {

  'use strict';

  visMOOCApp.directive('seekline', [function () {
      return {
        restrict: 'AE',
        scope: {
//          closeFunc: '=',
          seekDataPart: '=',      //chart data, [required]
          seekData: '=',      //chart data, [required]
//          config: '=?',    //global directive configuration, [optional]
          option: '=',
          videoLength:'=',
          callMe:'&',
        },
        link: function (scope, element, attr) {

          var renderer, camera, scene;
          var height = element[0].offsetHeight;
          var width = element[0].offsetWidth;
          console.log(element.parent().width());
          console.log($('#viscontent').css('width'));
          console.log(element.parent()[0].offsetWidth);
          var videoLength;

          var clearCanvas=function  (name) {
            var count=scene.children.length;

            for(var i=count-1;i>=0;i--){
              if(scene.children[i].name===name)
                scene.remove(scene.children[i]);
            }
            renderer.clear();
          }
          var defineEnv=function () {
            renderer = new THREE.WebGLRenderer({canvas:element[0], alpha:true, antialias:true})
            renderer.setSize(width, height);
            renderer.autoClear = true;
            camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
            camera.position.z=10;
            camera.lookAt(new THREE.Vector3(-0, -0, 0));
            scene = new THREE.Scene();
            clearCanvas();
            // body...
          }();

          var initVideoLength=function(){
            videoLength=scope.videoLength;
          }

          var initData=function(input){

            var toUse={
              forward:[],
              backward:[],
            };

            initVideoLength();
            var toUseTemp=input;

            for(var i=0;i<toUseTemp.length;i++){
              var temp=toUseTemp[i];
              if(temp.currentTime>temp.prevTime){
                toUse.forward.push(temp);
              }else{
                toUse.backward.push(temp);
              }
            }

            return toUse;
          }

               var defineMaterial=function(seek){
                var forward;
                if((seek.currentTime-seek.prevTime)>0){
                  forward="forward";
                }else{
                  forward="not";
                }

                var material;
                if(forward=="forward"){
                  material = new THREE.LineBasicMaterial({
                      color: 0xff7800,
                      linewidth:0.6,
                      opacity:0.1
                  });
                  material.transparent=true;
                }else{
                  material = new THREE.LineBasicMaterial({
                      color: 0x133cac,
                      linewidth:1,
                      opacity:0.1
                  });
                  material.transparent=true;
                }

                return material;
              }
          var drawLine= function(dataToDraw) {

              var lines= new THREE.Geometry();
              for(var i=0;i<dataToDraw.length;i++){
                var temp=dataToDraw[i];
                var x1=temp.prevTime/videoLength*width-width/2;
                var x2=temp.currentTime/videoLength*width-width/2;
                var y1=(temp.prevTime>temp.currentTime)? 0: height/2;
                var y2=(temp.prevTime>temp.currentTime)? -height/2: 0;
                lines.vertices.push(new THREE.Vector3(x1, y1, 0));
                lines.vertices.push(new THREE.Vector3(x2, y2, 0));
              }

              var line=new THREE.Line(lines, defineMaterial(dataToDraw[0]), THREE.LinePieces);
              line.name="line";
              scene.add(line);
              renderer.render(scene, camera);
          }

          var drawAll=function(data){
            var toUse=initData(data);
            clearCanvas("line"); 

            for(var key in toUse){
              if(toUse.hasOwnProperty(key)){
                if(toUse[key].length>0){
                  drawLine(toUse[key]);
                }
              }
            }

          }

          function exitIntro(targetElement) {
              //remove overlay layer from the page
              console.log(targetElement);
              var overlayLayer = targetElement.querySelector('.introjs-overlay');

              //return if intro already completed or skipped
              if (overlayLayer == null) {
                return;
              }

              //for fade-out animation
              overlayLayer.style.opacity = 0;
              setTimeout(function () {
                if (overlayLayer.parentNode) {
                  overlayLayer.parentNode.removeChild(overlayLayer);
                }
              }, 500);

              //remove all helper layers
              var helperLayer = targetElement.querySelector('.introjs-helperLayer');
              if (helperLayer) {
                helperLayer.parentNode.removeChild(helperLayer);
              }

              //remove intro floating element
              var floatingElement = document.querySelector('.introjsFloatingElement');
              if (floatingElement) {
                floatingElement.parentNode.removeChild(floatingElement);
              }

              //remove `introjs-showElement` class from the element
              var showElement = document.querySelector('.introjs-showElement');
              if (showElement) {
                showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
              }

              //remove `introjs-fixParent` class from the elements
              var fixParents = document.querySelectorAll('.introjs-fixParent');
              if (fixParents && fixParents.length > 0) {
                for (var i = fixParents.length - 1; i >= 0; i--) {
                  fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
                };
              }
            }

          scope.api = {
            // refresh: freshData,
            initDraw: drawAll,
          }; 
          scope.$watch('seekData', function(data){
            if (data){
              scope.api.initDraw(data); 
              exitIntro(document)
              scope.callMe();

            }
          }, true);

          scope.$watch('seekDataPart', function(data){
            if (data) {
              scope.api.initDraw(data);
            } 
          }, true);
        }
      };
    }]);
})();

(function () {

  'use strict';

  visMOOCApp.directive('sentiment', ['pip', function (pip) {
      return {
        restrict: 'AE',
        scope: {
          sentimentData: '=',      //chart data, [required]
          option: '=',
          callMe:'=',
          showGoBack: '=',
        },
        link: function (scope, element, attr) {

          var svg,xScale,yScale,xAxis,yAxis,w,h,padding, xVar, mouseScale;
          
          var getData=function(){
            return scope.sentimentData;
          }

          var setBackground = function(){
            xVar='timestamp';

            w = 1200;
            h = 600;
            padding = 100;

            if(d3.select(element[0]).select('svg').length){
              d3.select(element[0]).select('svg').remove();
            }


            var formatTimeHour = d3.time.format("%H:%M");
            var formatTimeDay= d3.time.format("%B, %d");
            var formatMinutes = function(d) {
              if(scope.showGoBack){
                return formatTimeHour(new Date(d) ) 
              }
              return formatTimeDay(new Date(d) ) 
            };

            xScale = d3.scale.linear()
                    .domain(d3.extent(getData(), function(d){
                      return d[xVar];
                    }))
                    .range([padding,w-padding]);
            yScale = d3.scale.linear()
                    .domain([d3.max(getData(),function(d){
                      return d.positive;
                    })+0.1,d3.min(getData(),function(d){
                      return d.positive;
                    })-0.1])
                    .range([padding,h-padding]);

            mouseScale= d3.scale.linear()
                    .domain(d3.extent(getData(), function(d){
                      return d[xVar];
                    }))
                    .range([padding+30,w-padding-250]);

            svg = d3.select(element[0])
                  .append("svg")
                  .attr("width",w)
                  .attr("height",h);

            xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickFormat(formatMinutes);

            yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
          }

          var extendColorScale=function(positive, neutral){
            var tempScale=d3.scale.linear()

            if(neutral>=0.5){


                tempScale
                  .range(['#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a'])
                  .domain([-0.5, -0.25, 0, 0.25, 0.5]);
                return tempScale(positive);

            }else{
              if(positive>=0){

                  // tempScale
                  //     .range([padding, one_third])
                  //     .domain([padding,middle]);
                  return "rgba(102,189,99,"+(1-neutral)+")";;

              }else{

                  // tempScale
                  //     .range([two_thirds, h-padding])
                  //     .domain([middle,h-padding]);
                  // return tempScale(yValue);
                  return "rgba(244,109,67,"+(1-neutral)+")";;

              }
            }
          }


          var extendYScale=function(yValue, positive, neutral){
            var tempScale=d3.scale.linear()

            var middle=h/2, 
                one_third=padding+(h-2*padding)/3, 
                two_thirds=h-padding-(h-2*padding)/3;

            if(neutral>=0.5){

                // if(!scope.showGoBack){
                //   return yValue
                // }

                tempScale
                  .range([one_third, two_thirds])
                  .domain([padding,h-padding]);
                return tempScale(yValue);

            }else{
              if(positive>=0){

                  tempScale
                      .range([padding, one_third])
                      .domain([padding, middle]);
                  return tempScale(yValue);

              }else{

                  tempScale
                      .range([two_thirds, h-padding])
                      .domain([middle,h-padding]);
                  return tempScale(yValue);

              }
            }
          }

        var setPlotSummary=function(){

            var summaryColor=function(positive){
                var tempScale=d3.scale.linear()
                  .range(['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'])
                  .domain([-0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4]);
                  // .range([ '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a'])
                  // .domain([-0.5, -0.17, 0.17, 0.5]);
                return tempScale(positive);
            }

            svg.selectAll("circle")
                .data(getData())
                .enter()
                .append("circle")
                .attr('class', 'sentimentNode')
                .attr("cx",function(d){
                    return xScale(d[xVar]);
                })
                .attr("cy",function(d){
                    return yScale(d.positive);
                })
                .attr("r",function(d){
                    return Math.sqrt(30);
                })
                .attr("stroke",function(d){
                    return '#aaa'
                })
                .attr("stroke-width",function(d){
                    return '1px'
                })
                .attr("fill", function(d) {
                    return summaryColor(d.positive);
                })
                .on("mouseover", function(d) {
                    d3.select(this)
                      .attr("fill", "orange");

                    var mouse=d3.mouse(this);
                    var xPosition = mouseScale(d[xVar]);
                    var yPosition = mouse[1];
                      //Update the tooltip position and value
                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#username")
                      .style("font-weight",900)
                      .style("color","#CCC")
                      .text(d.username);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#value")
                      .style("font-weight",900)
                      .style("color","red")
                      .text("The date is "+d.date);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")
                      .select("#comment")
                      .text(d.text);
                      
                      //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(d) {
                     d3.select(this)
                      .attr("fill", function(d) {
                        return summaryColor(d.positive)
                      });
                    d3.select("#tooltip").classed("hidden", true);
                })
                .on('click', function(d){
                    pip.emitSentiment(d)
                })
            
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate("+ padding +", 0 )")
                .call(yAxis);
            

            var textG=svg.append("g")
                .attr("class", "axisText")

            textG.append("text")
                .attr("x", w/2-100)
                .attr("y", 50)
                .text("Sentiment trend")
                .attr("font-family", "sans-serif")
                .style("font-size", "30px")
                .attr("fill", "black");
            textG.append("text")
                .attr("x", w/2-120)
                .attr("y", h-50)
                .text("Date from the course started")
                .attr("font-family", "sans-serif")
                .style("font-size", "20px")
                .attr("fill", "black");

            var margin={
              left:900,
              top:80,
              right:30,
              buttom:20,
            }
            var legendWidth=200;
            var legendHeight=20;

            var idGradient="gradient_id_summary"
            var legendG=svg.append("g")
                .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

            legendG.append("defs")
                .append("linearGradient")
                .attr("id",idGradient)
                .attr("x1","0%")
                .attr("x2","100%")
                .attr("y1","0%")
                .attr("y2","0%"); 

            legendG.append("rect")
                .attr("fill","url('#" + idGradient + "')")
                .attr("x",0)
                .attr("y",0)
                .attr("width",legendWidth)
                .attr("height",legendHeight)
                .attr("rx",2)  //rounded corners, of course!
                .attr("ry",2);


                var theData = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'];

                //now the d3 magic (imo) ...
                var stops = d3.select('#' + idGradient).selectAll('stop')
                      .data(theData);
                stops.enter().append('stop');
                stops.attr('offset',function(d, i) {
                            return i*0.125;
                })
                .attr('stop-color',function(d) {
                            return d;
                })

            legendG.append("text")
                .attr("x", -30)
                .attr("y", legendHeight+20)
                .text("negative")
                .attr("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("fill", "black");
            legendG.append("text")
                .attr("x", legendWidth-20)
                .attr("y", legendHeight+20)
                .text("positive")
                .attr("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("fill", "black");

        }
        
        var setPlotDetail = function(){

            var middle=h/2, 
                one_third=(h-2*padding)/3, 
                two_thirds=h-padding-(h-2*padding)/3;


                svg.append('rect')
                  .attr('x', padding)
                  .attr('y', padding)
                  .attr('width', w-2*padding)
                  .attr('height', one_third)
                  .attr('fill', 'rgba(204,235,197, 0.5)')

                svg.append('rect')
                  .attr('x', padding)
                  .attr('y', one_third+padding)
                  .attr('width', w-2*padding)
                  .attr('height', one_third)
                  .attr('fill', 'rgba(255,255,204, 0.5)')

                svg.append('rect')
                  .attr('x', padding)
                  .attr('y', one_third+padding+one_third)
                  .attr('width', w-2*padding)
                  .attr('height', one_third)
                  .attr('fill', 'rgba(253,218,236, 0.5)')

            svg.selectAll("circle")
                .data(getData())
                .enter()
                .append("circle")
                .attr('class', 'sentimentNode')
                .attr("cx",function(d){
                    return xScale(d[xVar]);
                })
                .attr("cy",function(d){
                    return extendYScale(yScale(d.positive), d.positive, d.neutral);
                })
                .attr("r",function(d){
                    return Math.sqrt(30);
                })
                .attr("stroke",function(d){
                    return '#aaa'
                })
                .attr("stroke-width",function(d){
                    return '1px'
                })
                .attr("fill", function(d) {
                    if(d.grade){
                      if(d.grade==='#CCC')
                        return '#888';
                      return d.grade;
                    }
                    return extendColorScale(d.positive, d.neutral)
                    // if(d.positive >= 0)
                    //     return "rgba(0, 255, 0,"+d.neutral+")";
                    // else
                    //   return "rgba(255,0,0,"+d.neutral+")";
                })
                .on("mouseover", function(d) {
                    d3.select(this)
                      .attr("fill", "orange");

                    var mouse=d3.mouse(this);
                    console.log(mouse)

                    var xPosition = mouseScale(d[xVar]);
                    var yPosition = mouse[1];
                      //Update the tooltip position and value
                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#username")
                      .style("font-weight",900)
                      .style("color","#CCC")
                      .text(d.username);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#value")
                      .style("font-weight",900)
                      .style("color","red")
                      .text("The date is "+d.date);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")
                      .select("#comment")
                      .text(d.text);
                      
                      //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(d) {
                     d3.select(this)
                      .attr("fill", function(d) {
                        if(d.grade){
                          if(d.grade==='#CCC')
                            return '#888';
                          return d.grade;
                        }
                        return extendColorScale(d.positive, d.neutral)
                        // if(d.positive >= 0)
                        //     return "rgba(0, 255, 0,"+d.neutral+")";
                        // else
                        //   return "rgba(255,0,0,"+d.neutral+")";
                      });
                    d3.select("#tooltip").classed("hidden", true);
                })
                .on('click', function(d){
                      if(scope.showGoBack){
                      }else{
                        pip.emitSentiment(d)
                      }
                })
            
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);
            

            var textG=svg.append("g")
                .attr("class", "axisText")

            textG.append("text")
                .attr('class', 'goBackLink')
                .attr("x", 50)
                .attr("y", 50)
                .attr("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("fill", "black")
                .append('tspan')
                .attr('text-decoration','underline')
                .text('Go Back To Summary')
                .on('click', function(){
                    pip.emitSentiment('delete');
                })

            textG.append("text")
                .attr("x", w/2-70)
                .attr("y", h-50)
                .text("Time of a day")
                .attr("font-family", "sans-serif")
                .style("font-size", "20px")
                .attr("fill", "black");
          //y text
            textG.append("text")
                .attr("y", 70)
                .attr("x", -200)
                .attr("dy", ".31em")
                .attr("transform", "rotate(-90)")
                .text("Appreciation")
                .attr("font-family", "sans-serif")
                .style("font-size", "16px")
                .attr("fill", "black");

            textG.append("text")
                .attr("y", 70)
                .attr("x", -320)
                .attr("dy", ".31em")
                .attr("transform", "rotate(-90)")
                .text("Neutral")
                .attr("font-family", "sans-serif")
                .style("font-size", "16px")
                .attr("fill", "black");

            textG.append("text")
                .attr("y", 70)
                .attr("x", -460)
                .attr("dy", ".31em")
                .attr("transform", "rotate(-90)")
                .text("Questions")
                .attr("font-family", "sans-serif")
                .style("font-size", "16px")
                .attr("fill", "black");

                //add legend from here
                var margin={
                  left:800,
                  top:50,
                  right:30,
                  buttom:20,
                }
                var legendWidth=200;
                var legendHeight=20;


                var legendGText=svg.append("g")
                      .attr("transform", "translate(" + margin.left+ "," + (margin.top) + ")");

                legendGText.append("text")
                    .attr("x", 40)
                    .attr("y", -5)
                    .text("Student's grade")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");

                legendGText.append("text")
                    .attr("x", 0)
                    .attr("y", legendHeight+15)
                    .text("15")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");
                legendGText.append("text")
                    .attr("x", legendWidth-20)
                    .attr("y", legendHeight+15)
                    .text("100")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");
                legendGText.append("text")
                    .attr("x", legendWidth+10)
                    .attr("y", legendHeight+15)
                    .text("No grade")
                    .attr("font-family", "sans-serif")
                    .style("font-size", "15px")
                    .attr("fill", "black");


                var idGradient="gradient_id_grade"
                var legendG=svg.append("g")
                      .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

                legendG.append("rect")
                      .attr("fill","black")
                      .attr("opacity",0.4)
                      .attr("x",legendWidth+20)
                      .attr("y",0)
                      .attr("width",legendHeight)
                      .attr("height",legendHeight)

                legendG.append("defs")
                      .append("linearGradient")
                          .attr("id",idGradient)
                          .attr("x1","0%")
                          .attr("x2","100%")
                          .attr("y1","0%")
                          .attr("y2","0%"); 

                legendG.append("rect")
                      .attr("fill","url('#" + idGradient + "')")
                      .attr("x",0)
                      .attr("y",0)
                      .attr("width",legendWidth)
                      .attr("height",legendHeight)
                      .attr("rx",2)  //rounded corners, of course!
                      .attr("ry",2);

                // var hueStart = 160, hueEnd = 0;
                // var numberHues = 35;
                // var opacityStart = 1.0, opacityEnd = 1.0;
                // var theHue, rgbString, opacity,p;

                // var deltaPercent = 1/(numberHues-1);
                // var deltaHue = (hueEnd - hueStart)/(numberHues - 1);
                // var deltaOpacity = (opacityEnd - opacityStart)/(numberHues - 1);

                // //kind of out of order, but set up the data here 
                // var theData = [];
                // for (var i=0;i < numberHues;i++) {
                //     theHue = hueStart + deltaHue*i;
                //     //the second parameter, set to 1 here, is the saturation
                //     // the third parameter is "lightness"    
                //     rgbString = d3.hsl(theHue,1,0.6).toString();
                //     opacity = opacityStart + deltaOpacity*i;
                //     p = 0 + deltaPercent*i;
                //     //onsole.log("i, values: " + i + ", " + rgbString + ", " + opacity + ", " + p);
                //     theData.push({"rgb":rgbString, "opacity":opacity, "percent":p});       
                // }

                // //now the d3 magic (imo) ...
                // var stops = d3.select('#' + idGradient).selectAll('stop')
                //       .data(theData);
                // stops.enter().append('stop');
                // stops.attr('offset',function(d) {
                //             return d.percent;
                // })
                // .attr('stop-color',function(d) {
                //             return d.rgb;
                // })
                // .attr('stop-opacity',function(d) {
                //             return d.opacity;
                // });

                var theData = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'];

                //now the d3 magic (imo) ...
                var stops = d3.select('#' + idGradient).selectAll('stop')
                      .data(theData.reverse());
                stops.enter().append('stop');
                stops.attr('offset',function(d, i) {
                            return i*0.125;
                })
                .attr('stop-color',function(d) {
                            return d;
                })


        } 


          if(scope.sentimentData){
            $(".introjs-helperLayer").remove();
            $(".introjs-overlay").remove();
            scope.callMe();
          }


          scope.$watch('sentimentData', function(data){if (data)
              console.log('sentimentData changed')
              setBackground();
              if(scope.showGoBack){
                  setPlotDetail();
              }else{
                setPlotSummary();
              }
          }, true);
        }
      };
    }]);
})();
(function () {

  'use strict';

  visMOOCApp.directive('wordcloud', ['pip', function (pip) {

      return {
        restrict: 'AE',
        scope: {
          wordCloudData: '=',      //chart data, [required]
        },
        link: function (scope, element, attr) {

          var data, canvas, sizeScale;

          var drawWordcloud=function(){

            sizeScale= d3.scale.linear()
                .range([13, 80]);

            if(scope.wordCloudData){

              data=scope.wordCloudData;
              var min=d3.min(data,function(d){
                        return d[1];
                      })
              var max=d3.max(data,function(d){
                        return d[1];
                      })
              sizeScale
                .domain([min, max])


              for(var i=0;i<data.length;i++){
                var ele=data[i];
                ele[1]=sizeScale(ele[1])
              }
              // data=data.map(function(d){
              //   d[1]=sizeScale(d[1]);
              // })
            }

            var height = element[0].offsetHeight;
            var width = element[0].offsetWidth;
            if(d3.select(element[0]).select('canvas').length){
              d3.select(element[0]).select('canvas').remove();
            }
            canvas = d3.select(element[0])
                  .append("canvas")
                  .attr('id', 'wordcloudCanvas')
                  .attr("width",width)
                  .attr("height",height);

            WordCloud(document.getElementById('wordcloudCanvas'), { list: data} );

          }

          scope.$watch('wordCloudData', function(data){
            if (data){
              console.log('enter')
              drawWordcloud();
            } 
          }, true);
        }
      };
    }]);
})();
(function(){
    'use strict';
    var serviceID = 'communicationService';

    // var communicationService = angular.module(serviceID,[]);
    visMOOCApp.factory(serviceID,["$rootScope",pubsubService]);

    function pubsubService($rootScope) {
        var CHANGE_COURSE = "changeCourse"; //the events
        var CHANGE_VIDEO = "changeVideo";
        var FILTER_COUNTRY = "filterCountry";
        var FILTER_DATE = "filterDate";
        var FILTER_FREQ="filterFreq";

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

        //return the factory object!
        return {
            changeCourse: changeCourse,
            onChangeCourse: onChangeCourse,
            changeVideo: changeVideo,
            onChangeVideo: onChangeVideo,
            filterCountry: filterCountry,
            onFilterCountry: onFilterCountry,
            filterDate: filterDate,
            onFilterDate: onFilterDate
        };
    }

})();
(function(){
    'use strict';
    var serviceData = 'dataManagerService';

    // var dataManagerService = angular.module(serviceData,[]);
    visMOOCApp.factory(serviceData,["$http", dataManagerServiceFun]);

    function dataManagerServiceFun($http){
        
        var dataFactory= {};
        var mainPath = window.location.pathname;

        dataFactory.getSentiment = function(courseId, callback){
            var tmpURL = mainPath + 'getSentiment?courseId='+courseId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getWordCloudData= function(courseId, userId, callback){
            var tmpURL = mainPath + 'getWordCloudData?courseId='+courseId + '&userId=' + userId;
            console.log(userId)
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getWordCloudDataByGeo= function(courseId, code3, callback){
            var tmpURL = mainPath + 'getWordCloudDataByGeo?courseId='+courseId + '&countryCode=' + code3;
            console.log(code3)
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getSentimentDetails= function(courseId, days, callback){
            var tmpURL = mainPath + 'getSentimentDetails?courseId=' + courseId + '&days=' + days;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getForumSocialNetwork = function(courseId, filterLevel, callback){
            if(filterLevel===0 || filterLevel){
            }else{
                filterLevel=0;
            }
            var tmpURL = mainPath + 'modules/vismooc/data/graph/' + courseId + '-' + filterLevel + ".json";
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getActionCountInfo = function(courseId,videoId, callback){
            var tmpURL = mainPath + 'getContentBasedData?type=action&courseId='+courseId+'&videoId=' + videoId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getSeekInfo = function(courseId,videoId, callback){
            var tmpURL = mainPath + 'getContentBasedData?type=seek&courseId='+courseId+'&videoId=' + videoId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getActionCountInfoByCountry = function(courseId, videoId,country,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=action&courseId='+courseId+'&videoId=' + videoId+ "&country=" + country;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };


        dataFactory.getSeekInfoByCountry = function(courseId, videoId,country,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=seek&courseId='+courseId+'&videoId=' + videoId+ "&country=" + country;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getActionCountInfoByTime = function(courseId, videoId,start,end,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=action&courseId='+courseId+'&videoId=' + videoId+ "&startTime=" + start + "&endTime=" + end;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getSeekInfoByTime = function(courseId, videoId,start,end,callback){
            var tmpURL = mainPath + 'getContentBasedData?type=seek&courseId='+courseId+'&videoId=' + videoId+ "&startTime=" + start + "&endTime=" + end;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getDailyHotnessByVideo = function(courseId, videoId,callback){
            var tmpURL = mainPath + 'getVideoPop?courseId='+courseId+'&videoId=' + videoId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getDemographicData = function(courseId,callback){
            var tmpURL = mainPath + 'getDemographicData?courseId='+courseId;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getCourseInfo = function(courseId, callback){
            var tmpURL = mainPath + 'getCourseInfo?courseId=' + courseId ;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getCourseList = function(callback){
            var tmpURL = mainPath + 'getCourseList' ;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getHotness = function(courseId, callback){
            var tmpURL = mainPath + 'getHotness?courseId='+courseId ;
            $http.get(tmpURL).success( function(data){
                callback(data);
            });
        };

        dataFactory.getVideoList = function(courseId, callback){
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

        return dataFactory;
    }


})();