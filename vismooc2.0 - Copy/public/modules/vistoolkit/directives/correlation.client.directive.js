'use strict';

angular.module('vistoolkit').directive('pcoords', function ($timeout) {
    return {
        restrict: 'EA',
        template: '',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            $timeout(function () {
                var width = $(element.parent()).width();
                var height = $(element.parent()).height();

                if (angular.isDefined(scope.data)) {
                    var data = scope.data;
                    var isDrawline = false;
                    var courseId = data[0];
                    var peakNum = data[1];
                    var dataTmp = data[2];
                    var dataSub = [];
                    var dataFiltered = [];
                    var fidelityUp = 20;
                    var fidelityLow = 0;
                    var displayNum = 20;

                    var countryNames = ["ARG", "AUS", "BRA", "CAN", "CHN", "COL", "FRA", "DEU", "GRC", "HKG", "IND", "ITA", "MEX", "NLD", "PHL", "POL", "ROU", "RUS", "SGP", "ESP", "UKR", "GBR", "USA"];

                    for (var i = 0; i < dataTmp.length; i++) {
                        var obj = {};
                        var seekCount = 0;
                        var peakCount = 0;
                        obj['country'] = dataTmp[i].country;
                        if (countryNames.indexOf(obj['country']) < 0)    continue;
                        obj['grade'] = dataTmp[i].grade;
                        obj['droptime'] = dataTmp[i].dropTime;
                        obj['posts'] = dataTmp[i].forumPosts;
                        if ([obj['posts']] > 100)    obj['posts'] = 100;
                        obj['loyalty'] = 0;
                        obj['review'] = dataTmp[i].review;
                        obj['delay'] = dataTmp[i].delay;
                        if (obj['delay'] < 0)    obj['delay'] = 0;
                        obj['activeness'] = dataTmp[i].activeness;
                        if (obj['activeness'] > 10) obj['activeness'] = 10;
                        for (var j = 0; j < peakNum; j++) {
                            peakCount++;
                            var axisKey = 'Peak' + j;
                            if (dataTmp[i][axisKey] > 0) {
                                seekCount++;
                            }
                            if (j > displayNum)  continue;
                            if (dataTmp[i][axisKey] < 20) {
                                obj[axisKey] = dataTmp[i][axisKey];
                            } else {
                                obj[axisKey] = 20;
                            }
                        }
                        obj['loyalty'] = seekCount;
                        dataSub.push(obj);
                    }
                    console.log(dataSub);

                    var pc = d3.parcoords()(element[0])
                        .data(dataSub)
                        .bundlingStrength(0)
                        .smoothness(0)
                        .color("#FE7E13")
                        .alpha(0.05)
                        .margin({top: 24, left: 20, bottom: 12, right: 0})
                        .mode("queue")
                        .isDrawline(isDrawline)
                        .render();

                    var axisKeys = Object.keys(pc.yscale);
                    var attrAxesNum = 8;
                    for (var i = attrAxesNum; i < axisKeys.length; i++) {
                        pc.yscale[axisKeys[i]] = d3.scale.linear()
                            .domain([20.5, 0.5])
                            .range([0, height - 35]);
                    }

                    pc.render()
                        .createAxes()
                        //.shadows()
                        .reorderable()
                        .brushMode("1D-axes");

                    d3.select("#filterLow").on("change", function () {
                        fidelityLow = this.value;
                        d3.select("#lowerBound").text(this.value);

                        dataFiltered = [];
                        var axisKeys = Object.keys(pc.yscale);
                        for (var i = 0; i < dataSub.length; i++) {
                            var obj = {};
                            for (var j = 0; j < 7 + fidelityLow; j++) {
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
                    d3.select("#filterUp").on("change", function () {
                        var opacity = this.value;
                        d3.select("#upperBound").text(this.value);

                        pc
                            .alpha(opacity)
                            .render();
                    });

                    //change drawing mode
                    d3.select("#changemodebutton").on("click", function () {
                        console.log(isDrawline);
                        isDrawline = !isDrawline;
                        pc
                            .isDrawline(isDrawline)
                            .render();
                    });

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
                }

            }, 500);
        }
    }
});
