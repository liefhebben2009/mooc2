'use strict';

angular.module('vistoolkit').directive('wordcloud', function($window, communicator){
  return {
        restrict: 'AE',
        scope: {
          wordCloudData: '=',      //chart data, [required]
        },
        link: function (scope, element, attr) {

          var data, canvas, sizeScale;

          var drawWordcloud=function(){

            sizeScale= d3.scale.linear().range([13, 80]);

            if(scope.wordCloudData){
              data=scope.wordCloudData;
              var min = d3.min(data,function(d){ return d[1]; });
              var max = d3.max(data,function(d){ return d[1]; });
              sizeScale.domain([min, max])
              for(var i=0;i<data.length;i++){
                var ele=data[i];
                ele[1]=sizeScale(ele[1])
              }
            }

            var height = element[0].offsetHeight;
            var width = element[0].offsetWidth;
            if(d3.select(element[0]).select('canvas').length) {
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
              drawWordcloud();
            } 
          }, true);
        }
      };
});
