'use strict';

angular.module('vistoolkit').controller('mdsGlyphController', ['$window', '$scope', '$http', 'communicator', 'dataManager',
	function($window ,$scope, $http, communicator, dataManager) {

    	$scope.courseId = -1;
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

		var w = d3.scale.linear().range([30, 60]);
		var h = d3.scale.linear().range([30, 45]);

		communicator.onChangeCourse($scope, function(courseId){
	      	$scope.courseId = courseId;

	      	// get videoList
	      	var videoList;
	      	var videoListHash = {};
	      	dataManager.getVideoList(courseId, function(data){
	        	videoList = data;
	        	angular.forEach(videoList, function(d){
	        		angular.forEach(d.videos, function(dd){
	        			videoListHash[dd.videoId] = dd;
	        		});
	        	});
	        	$scope.videoListHash = videoListHash;
	      	});

	      	var weekNum = (courseId == 4) ? 10 : 4;
	      	$http.get(mainPath + 'getGlyphInfo?courseId=' + courseId)
				.success(function(data, status, headers, config){

					var colors = [],
						usedcolors = 0;
					// get nodes
					var nodes = [];					
					data.forEach(function(d){
						var tmpNode = {};
	                    var tmpcolor = getMyColor(d.videoId, colors);

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
	                    simMatrix[i][i] = 1;
	                    for (var j = i + 1, obj2; obj2 = data[j]; j++) {
	                        var sim = getSimilarity(obj1.peopleInfo, obj2.peopleInfo);
	                        simMatrix[i][j] = simMatrix[j][i] = sim;
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
	                    var videoWeekPosition = d.week / ( weekNum + 1);
						var line1Position = 1 - d.peopleInfo.length / d.actionNum;

						var peopleInfo = d.peopleInfo.sort(function(a, b){ return b.Count - a.Count; });
						var nowCount = 0;
			            var upLimit = Math.floor(d.actionNum*0.9);
			            for (var i = 0, count; count = peopleInfo[i].Count; i++){
			                if (nowCount >= upLimit)
			                    break;
			                nowCount += count;
			            }

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
				    $scope.graphData = finalData;
				});
    	});
	}
]);
