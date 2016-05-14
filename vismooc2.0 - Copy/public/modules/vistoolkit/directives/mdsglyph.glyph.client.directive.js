'use strict';

angular.module('vistoolkit').directive('glyph', ['$window',
    function ($window) {
        return {
            restrict: 'EA',
            scope: true,
            link: function postLink(scope, element, attrs) {
                // Glyph directive logic
                var d3 = $window.d3;

                var peak = scope.peaks[attrs.peak];
                console.log(peak);

                var rbWidth = 20,
                    rbHeight = 20,
                    plotSize = 5,
                    barOffset = 5,
                    width = peak.actionWidth,
                    height = peak.actionHeight,
                    percentageLine1 = peak.line1Position,
                    percentageLine2 = peak.line2Position,
                    rightBarRectPosition = peak.videoWeekPosition,
                    bottomBarRectPosition = peak.actionPosition,
                    grade = peak.grade,
                    ave = peak.distrAve,
                    std = peak.distrStd,
                    anomaly = peak.anomaly;

                var color = d3.scale.linear().range(['#fff7fb', '#014636']);
                color.domain([0, 1]);

                var svg = d3.select(element[0])
                    .attr('width', width)
                    .attr('height', height);

                // drawRect
                var rectWidth = width - rbWidth,
                    rectHeight = height - rbHeight;

                var rect = svg.append('g')
                    .attr('transform', 'translate(1, 1)');

                rect
                    .append('rect')
                    .attr('width', rectWidth)
                    .attr('height', rectHeight)
                    .attr('x', -rectWidth / 2)
                    .attr('y', -rectHeight / 2)
                    .style('stroke', '#251818')
                    .style('stroke-width', 1)
                    .style('fill', 'none');

                //draw grade
                var h = 0;
                var gradeColor = ["#2DA464", "#9CCF70", "#DBE697", "#FAE195", "#F6986A", "#DB453D"];
                for (var i = 0; i < grade.length; i++) {
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

                //draw anomaly line
                rect
                    .append('line')
                    .attr('x1', 0 - rectWidth / 2)
                    .attr('y1', -anomaly * rectHeight + rectHeight / 2)
                    .attr('x2', rectWidth / 2)
                    .attr('y2', -anomaly * rectHeight + rectHeight / 2)
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
                    .attr('y', rightBarRectPosition * rectHeight - rectWidth / 2)
                    .attr('width', plotSize)
                    .attr('height', plotSize)
                    .style('fill', 'blue')
                    .style('stroke-width', 0)
                    .style('fill-opacity', 0.8);

                // drawtbottomBar
                var bottomBar = svg.append('g')
                    .attr('transform', 'translate(1,1)');

                bottomBar
                    .append('line')
                    .attr('x1', -rectWidth / 2)
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
            }
        };
    }
]);
