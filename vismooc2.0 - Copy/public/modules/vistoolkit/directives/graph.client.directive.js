'use strict';

angular.module('vistoolkit').directive('graph', function($window, communicator){
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
                  communicator.emitGraphUsername([d.id, d.username]);
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
});