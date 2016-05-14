'use strict';

angular.module('vistoolkit').directive('mdsGlyph', function($window, $compile, $modal, $timeout, dataManager, communicator){
   return{
      restrict:'EA',
      scope: true,
      template:"<svg></svg>",
      link: function(scope, element, attrs){

		        var d3 = $window.d3;
          	var rawSvg=element.find('svg');

            var outerWidth = $('#graphmds_container').width();
            var outerHeight = $('#graphmds_container').height();
            var margin = {top: 50, right: 50, bottom: 50, left: 50};  
            var width = outerWidth - margin.left - margin.right,
                height = outerHeight - margin.top - margin.bottom;

            var preventOverlap = function(coordinate, radius, times, rate){
               var t = times == undefined ? 3 : times;
               var r = rate == undefined ? 1 : rate;
               var overlaps = 0;
               var items = coordinate;
               var count = 0;
               while(count < t){
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

            if (angular.isDefined(scope.graphData)){
               $timeout(function(){
                  var outerWidth = $('#graphmds_container').width();
                  var outerHeight = $('#graphmds_container').height();
                  var margin = {top: 50, right: 50, bottom: 50, left: 50};  
                  var width = outerWidth - margin.left - margin.right,
                      height = outerHeight - margin.top - margin.bottom;

                  var svg = d3.select(rawSvg[0])
                              .attr('width', outerWidth)
                              .attr('height', outerHeight)
                             .append('g')
                              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                  var graph = scope.graphData;
                  var coordinate = graph.coordinate;
                  var nodes = graph.nodes;
                  var peakBasicInfo = graph.peakBasicInfo;
                  var videoListHash = scope.videoListHash;
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
                                videoListHash[peakBasicInfo[i].videoId].currentTime = peakBasicInfo[i].currentTime;
                                communicator.changeVideo(videoListHash[peakBasicInfo[i].videoId]);
                             })
                            .append("title")
                             .text(function(d, i) { return nodes[i].name; })
                            .call(function(){
                               $compile(this[0].parentNode)(scope);
                            });
                  };

                  svg.append('g')
                    .call(drawGlyph);

               }, 500);
            }
       }
   };
});
