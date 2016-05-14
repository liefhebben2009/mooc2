'use strict';

angular.module('vistoolkit').directive('graphgeo', function($window, communicator){
  return {
            restrict: 'AE',
            scope: {
              geodata: '=',      //chart data, [required]
              selectedCountry: '=',
            },
            link: function (scope, element, attr) {
                var drawWorldMap=function(){
                    var datas = scope.geodata;
                    var height, width;
                    height = element[0].offsetHeight;
                    width = element[0].offsetWidth;
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
                          communicator.emitCode3(d.id);
                      });

                }
                scope.$watch('geodata', function(data){
                    if (data){
                      drawWorldMap();
                    } 
                }, true);
            }
          };
});

