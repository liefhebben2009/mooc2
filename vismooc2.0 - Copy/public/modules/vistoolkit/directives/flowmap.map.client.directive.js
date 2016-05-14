'use strict';

angular.module('vistoolkit').directive('map', function ($timeout) {
    return {
        restrict: 'EA',
        template: '',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {

            if (angular.isDefined(scope.data)){
                $timeout(function(){

                    var data = scope.data;
                    var map = new Datamap({
                        element: $('.peak_flowmap_map')[0],
                        height: $('.peak_flowmap_map').height(),
                        width: $('.peak_flowmap_map').height() / 0.35,
                        projection: 'equirectangular',
                        geographyConfig: {hideAntarctica: false},
                        fills: {
                            defaultFill: '#ffffe5'
                        }
                    });

                    var clickArray = data[6];
                    var countryCount = Array.apply(null, Array(23)).map(Number.prototype.valueOf,0);
                    var countryNames = ["ARG", "AUS", "BRA", "CAN", "CHN", "COL", "FRA", "DEU", "GRC", "HKG", "IND", "ITA", "MEX", "NLD", "PHL", "POL", "ROU", "RUS", "SGP", "ESP", "UKR", "GBR", "USA"];
                    for (var i = 0; i < clickArray.length; i++) {
                        for (var j = 0; j < countryNames.length; j++) {
                            if (countryNames[j] == clickArray[i].code3) {
                                countryCount[j] += clickArray[i].count;
                            }
                        }
                    }
                    //set the color range
                    var color = d3.scale.linear().range(['#ffffe5', '#41ab5d']);
                    var max = d3.max(countryCount);
                    color.domain([0, Math.log(max+1)]);

                    d3.select($('.peak_flowmap_map')[0]).selectAll('.datamaps-subunit')
                        .style('fill', function (d) {

                            if (countryNames.indexOf(d.id) < 0) {
                                return color(0);
                            } else {
                                return color(Math.log(countryCount[countryNames.indexOf(d.id)]+1));
                            }
                        })
                        .style('stroke', '#dddddd');
                }, 500);
            }
        }
    }
});
