'use strict';

angular.module('vistoolkit').directive('geoinfo', function($window){
  return {
      restrict: 'AE',
      scope: {
        closeFunc: '=',
        data: '=',             //chart data, [required]
        api: '=?',             //directive global api, [optional]
        filterCallback: '=',   //global events that directive would subscribe to, [optional]
        config: '=?' ,         //global directive configuration, [optional]
      },
      link: function (scope, element, attr) {
        var datas = scope.data;
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
              return color(Math.log(datas[codeArray.indexOf(d.id)].count));
            }
          })
          .style('stroke', '#dddddd')
          .on('click', function (d) {
              console.log(d.id);
              scope.filterCallback(d.id);
          });
      }
   };
});