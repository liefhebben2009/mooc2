'use strict';

angular.module('vistoolkit').directive('staticmap', function ($timeout) {
	return {
		restrict: 'EA',
		template: '',
		scope: {
			data: '='
		},
		link: function (scope, element, attrs) {

            if (angular.isDefined(scope.data)) {
                $timeout(function () {
                    var width = $('.peak_flowmap_container').height() / 0.7,
                        height = $('.peak_flowmap_container').height(),
                        topheight = $('.peak_flowmap_map').height();

                    var svg = d3.select(element[0])
                        .append("svg")
                         .attr("width", width)
                         .attr("height", height)
                         .attr("opacity", 0.8)
                         .style("width", width)
                         .style("height", height);

                    $('.flowmapin').css('width', width);

                    scope.$watch('data', function () {
                        var data = scope.data;
                        d3.select("#flowmapInput").on("change", function () {
                            d3.select("#peakSelected").text(this.value);
                        });

                        //clear previous svg
                        svg.selectAll("path").remove();
                        svg.selectAll("circle").remove();
                        svg.selectAll("rect").remove();

                        var courseId = data[0],
                            videoLength = data[1],
                            brushStart = data[2],
                            isFinished = data[3],
                            startTime = data[4],
                            endTime = data[5],
                            flowData = data[6];

                        //plot brush
                        svg
                            .append("rect")
                            .attr('x', startTime / videoLength * width)
                            .attr('y', height - 30)
                            .attr('width', (endTime - startTime) / videoLength * width)
                            .attr('height', 20)
                            .style('fill', '#b4b4b4')
                            .style('stroke-width', 0);

                        if(isFinished){
                            var timelinePos = height * 0.7,
                                pathColor = "#FE7E13",
                                pathOpacity = 0.4,
                                pathWidth = 0.5,
                                circleRadius = 1000,
                                outerCircleOpacity = 0.4,
                                innerCircleOpacity = 1,
                                outerCircleColor = "#d73027",
                                innerCircleColor = "#FE7E13";

                            var temporalCount = [];
                            for (var i = 0; i < videoLength; i++) {
                                temporalCount.push({'click': 0, 'people': 0});
                            }

                            var geoCoorCalculate = function(longitude, latitude) {
                                var coor = {};
                                coor.x = longitude * width;
                                coor.y = latitude * topheight;
                                return coor;
                            }

                            var countryTop = ['USA', 'CHN', 'GBR', 'CAN', 'DEU', 'BRA', 'ESP', 'AUS', 'FRA', 'IND', 'RUS'];
                            var countryMax = {};
                            for (var j = 0; j < countryTop.length; j++) {
                                countryMax[countryTop[j]] = {
                                    clickNum: 0,
                                    userNum: 0,
                                    longitude: 0,
                                    latitude: 0
                                };
                            }

                            for (var i = 0; i < flowData.length; i++) {
                                if (countryTop.indexOf(flowData[i].code3) < 0)    continue;
                                var radius = Math.log(flowData[i].count * pathWidth);
                                countryMax[flowData[i].code3].clickNum += flowData[i].count;
                                countryMax[flowData[i].code3].userNum++;
                                countryMax[flowData[i].code3].longitude = flowData[i].longitude;
                                countryMax[flowData[i].code3].latitude = flowData[i].latitude;
                                temporalCount[flowData[i].startTime].people++;
                                temporalCount[flowData[i].startTime].click += flowData[i].count;
                                if (radius < 1) radius = 1;

                                var bCurveCo = 0.1;
                                var p1 = geoCoorCalculate(flowData[i].longitude, flowData[i].latitude);
                                var p2 = {x: (flowData[i].startTime) / videoLength * width, y: timelinePos - 4};
                                var p3 = {x: 0.5 * ( p1.x + p2.x), y: topheight + 0.1 * p1.x};
                                var cp1 = {x: p1.x, y: bCurveCo * p1.y + (1 - bCurveCo) * p3.y};
                                var cp2 = {x: (1 - bCurveCo) * p1.x + bCurveCo * p3.x, y: p3.y};
                                var cp3 = {x: bCurveCo * p3.x + (1 - bCurveCo) * p2.x, y: p3.y};
                                var cp4 = {x: p2.x, y: (1 - bCurveCo) * p3.y + bCurveCo * p2.y};

                                var pathStr = 'M' + p1.x + ',' + p1.y + ' C'
                                    + cp1.x + ',' + cp1.y + ' '
                                    + cp2.x + ',' + cp2.y + ' '
                                    + p3.x + ',' + p3.y;

                                var path = svg.append("path")
                                    .attr("id", "flowPath")
                                    .attr("d", pathStr)
                                    .attr("stroke", function () {
                                        return pathColor;
                                    })
                                    .attr("stroke-width", radius)
                                    .attr("fill", "none")
                                    .attr("opacity", pathOpacity);

                                pathStr = 'M' + p3.x + ',' + p3.y + ' C'
                                + cp3.x + ',' + cp3.y + ' '
                                + cp4.x + ',' + cp4.y + ' '
                                + p2.x + ',' + p2.y;

                                path = svg.append("path")
                                    .attr("id", "flowPath")
                                    .attr("d", pathStr)
                                    .attr("stroke", function () {
                                        return pathColor;
                                    })
                                    .attr("stroke-width", radius)
                                    .attr("fill", "none")
                                    .attr("opacity", pathOpacity);
                            }

                            for (var i = 0; i < countryTop.length; i++) {
                                var geoCoorTemp = {};
                                geoCoorTemp = geoCoorCalculate(countryMax[countryTop[i]].longitude, countryMax[countryTop[i]].latitude);
                                radius = Math.log(countryMax[countryTop[i]].clickNum * circleRadius);
                                if (radius < 0.1) radius = 0.1;
                                svg.append("circle")
                                    .attr("r", radius)
                                    .style("fill", outerCircleColor)
                                    .attr("cx", geoCoorTemp.x)
                                    .attr("cy", geoCoorTemp.y)
                                    .attr("opacity", outerCircleOpacity);

                                radius = Math.log(countryMax[countryTop[i]].userNum * circleRadius);
                                if (radius < 0.1) radius = 0.1;
                                svg.append("circle")
                                    .attr("r", radius)
                                    .style("fill", innerCircleColor)
                                    .attr("cx", geoCoorTemp.x)
                                    .attr("cy", geoCoorTemp.y)
                                    .attr("opacity", innerCircleOpacity);
                            }

                            var timeaxisScale = d3.time.scale()
                                .domain([0, videoLength])
                                .rangeRound([0, width]);

                            var formatMinutes = function (d) {
                                var hours = Math.floor(d / 3600),
                                    minutes = Math.floor((d - (hours * 3600)) / 60),
                                    seconds = d - (minutes * 60);
                                if (seconds == 0)    seconds = '00';
                                var output = seconds + '"';
                                output = minutes + "'" + output;
                                return output;
                            };

                            var xAxis = d3.svg.axis()
                                .scale(timeaxisScale)
                                .orient('top')
                                .tickFormat(formatMinutes)
                                .tickSize(0);

                            var axisSelector = svg.append('g')
                                .attr('class', 'axis')
                                .attr('transform', 'translate(0, ' + (timelinePos) + ')')
                                .call(xAxis);

                            axisSelector.select('path')
                                .attr('fill', 'none')
                                .attr('stroke', '#a9a9a9')
                                .attr('stroke-width', '2')
                                .style("stroke-dasharray", ("2, 4"))
                                .attr('shape-rendering', 'crispEdges')
                                .style('shape-rendering', 'crispEdges');
                        }
                    });
                }, 500);
            }
		}
	}
});
