'use strict';

angular.module('vistoolkit').directive('sentiment', function($window, communicator){
  return {
        restrict: 'AE',
        scope: {
          sentimentData: '=',      //chart data, [required]
          option: '=',
          callMe:'=',
          showGoBack: '=',
        },
        link: function (scope, element, attr) {

          var svg,xScale,yScale,xAxis,yAxis,w,h,padding, xVar, mouseScale;
          
          var getData=function(){
            return scope.sentimentData;
          }

          var setBackground = function(){
            xVar='timestamp';

            w = 1200;
            h = 600;
            padding = 100;

            if(d3.select(element[0]).select('svg').length){
              d3.select(element[0]).select('svg').remove();
            }


            var formatTimeHour = d3.time.format("%H:%M");
            var formatTimeDay= d3.time.format("%B, %d");
            var formatMinutes = function(d) {
              if(scope.showGoBack){
                return formatTimeHour(new Date(d) ) 
              }
              return formatTimeDay(new Date(d) ) 
            };

            xScale = d3.scale.linear()
                    .domain(d3.extent(getData(), function(d){
                      return d[xVar];
                    }))
                    .range([padding,w-padding]);
            yScale = d3.scale.linear()
                    .domain([d3.max(getData(),function(d){
                      return d.positive;
                    })+0.1,d3.min(getData(),function(d){
                      return d.positive;
                    })-0.1])
                    .range([padding,h-padding]);

            mouseScale= d3.scale.linear()
                    .domain(d3.extent(getData(), function(d){
                      return d[xVar];
                    }))
                    .range([padding+30,w-padding-250]);

            svg = d3.select(element[0])
                  .append("svg")
                  .attr("width",w)
                  .attr("height",h);

            xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .tickFormat(formatMinutes);

            yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
          }

          var extendColorScale=function(positive, neutral){
            var tempScale=d3.scale.linear()

            if(neutral>=0.5){


                tempScale
                  .range(['#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a'])
                  .domain([-0.5, -0.25, 0, 0.25, 0.5]);
                return tempScale(positive);

            }else{
              if(positive>=0){

                  // tempScale
                  //     .range([padding, one_third])
                  //     .domain([padding,middle]);
                  return "rgba(102,189,99,"+(1-neutral)+")";;

              }else{

                  // tempScale
                  //     .range([two_thirds, h-padding])
                  //     .domain([middle,h-padding]);
                  // return tempScale(yValue);
                  return "rgba(244,109,67,"+(1-neutral)+")";;

              }
            }
          }


          var extendYScale=function(yValue, positive, neutral){
            var tempScale=d3.scale.linear()

            var middle=h/2, 
                one_third=padding+(h-2*padding)/3, 
                two_thirds=h-padding-(h-2*padding)/3;

            if(neutral>=0.5){

                // if(!scope.showGoBack){
                //   return yValue
                // }

                tempScale
                  .range([one_third, two_thirds])
                  .domain([padding,h-padding]);
                return tempScale(yValue);

            }else{
              if(positive>=0){

                  tempScale
                      .range([padding, one_third])
                      .domain([padding, middle]);
                  return tempScale(yValue);

              }else{

                  tempScale
                      .range([two_thirds, h-padding])
                      .domain([middle,h-padding]);
                  return tempScale(yValue);

              }
            }
          }

        var setPlotSummary=function(){

            var summaryColor=function(positive){
                var tempScale=d3.scale.linear()
                  .range(['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'])
                  .domain([-0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4]);
                  // .range([ '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a'])
                  // .domain([-0.5, -0.17, 0.17, 0.5]);
                return tempScale(positive);
            }

            svg.selectAll("circle")
                .data(getData())
                .enter()
                .append("circle")
                .attr('class', 'sentimentNode')
                .attr("cx",function(d){
                    return xScale(d[xVar]);
                })
                .attr("cy",function(d){
                    return yScale(d.positive);
                })
                .attr("r",function(d){
                    return Math.sqrt(30);
                })
                .attr("stroke",function(d){
                    return '#aaa'
                })
                .attr("stroke-width",function(d){
                    return '1px'
                })
                .attr("fill", function(d) {
                    return summaryColor(d.positive);
                })
                .on("mouseover", function(d) {
                    d3.select(this)
                      .attr("fill", "orange");

                    var mouse=d3.mouse(this);
                    var xPosition = mouseScale(d[xVar]);
                    var yPosition = mouse[1];
                      //Update the tooltip position and value
                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#username")
                      .style("font-weight",900)
                      .style("color","#CCC")
                      .text(d.username);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#value")
                      .style("font-weight",900)
                      .style("color","red")
                      .text("The date is "+d.date);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")
                      .select("#comment")
                      .text(d.text);
                      
                      //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(d) {
                     d3.select(this)
                      .attr("fill", function(d) {
                        return summaryColor(d.positive)
                      });
                    d3.select("#tooltip").classed("hidden", true);
                })
                .on('click', function(d){
                    communicator.emitSentiment(d)
                })
            
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate("+ padding +", 0 )")
                .call(yAxis);
            

            var textG=svg.append("g")
                .attr("class", "axisText")

            textG.append("text")
                .attr("x", w/2-100)
                .attr("y", 50)
                .text("Sentiment trend")
                .attr("font-family", "sans-serif")
                .style("font-size", "30px")
                .attr("fill", "black");
            textG.append("text")
                .attr("x", w/2-120)
                .attr("y", h-50)
                .text("Date from the course started")
                .attr("font-family", "sans-serif")
                .style("font-size", "20px")
                .attr("fill", "black");

            var margin={
              left:900,
              top:80,
              right:30,
              buttom:20,
            }
            var legendWidth=200;
            var legendHeight=20;

            var idGradient="gradient_id_summary"
            var legendG=svg.append("g")
                .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

            legendG.append("defs")
                .append("linearGradient")
                .attr("id",idGradient)
                .attr("x1","0%")
                .attr("x2","100%")
                .attr("y1","0%")
                .attr("y2","0%"); 

            legendG.append("rect")
                .attr("fill","url('#" + idGradient + "')")
                .attr("x",0)
                .attr("y",0)
                .attr("width",legendWidth)
                .attr("height",legendHeight)
                .attr("rx",2)  //rounded corners, of course!
                .attr("ry",2);


                var theData = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'];

                //now the d3 magic (imo) ...
                var stops = d3.select('#' + idGradient).selectAll('stop')
                      .data(theData);
                stops.enter().append('stop');
                stops.attr('offset',function(d, i) {
                            return i*0.125;
                })
                .attr('stop-color',function(d) {
                            return d;
                })

            legendG.append("text")
                .attr("x", -30)
                .attr("y", legendHeight+20)
                .text("negative")
                .attr("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("fill", "black");
            legendG.append("text")
                .attr("x", legendWidth-20)
                .attr("y", legendHeight+20)
                .text("positive")
                .attr("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("fill", "black");

        }
        
        var setPlotDetail = function(){

            var middle=h/2, 
                one_third=(h-2*padding)/3, 
                two_thirds=h-padding-(h-2*padding)/3;


                svg.append('rect')
                  .attr('x', padding)
                  .attr('y', padding)
                  .attr('width', w-2*padding)
                  .attr('height', one_third)
                  .attr('fill', 'rgba(204,235,197, 0.5)')

                svg.append('rect')
                  .attr('x', padding)
                  .attr('y', one_third+padding)
                  .attr('width', w-2*padding)
                  .attr('height', one_third)
                  .attr('fill', 'rgba(255,255,204, 0.5)')

                svg.append('rect')
                  .attr('x', padding)
                  .attr('y', one_third+padding+one_third)
                  .attr('width', w-2*padding)
                  .attr('height', one_third)
                  .attr('fill', 'rgba(253,218,236, 0.5)')

            svg.selectAll("circle")
                .data(getData())
                .enter()
                .append("circle")
                .attr('class', 'sentimentNode')
                .attr("cx",function(d){
                    return xScale(d[xVar]);
                })
                .attr("cy",function(d){
                    return extendYScale(yScale(d.positive), d.positive, d.neutral);
                })
                .attr("r",function(d){
                    return Math.sqrt(30);
                })
                .attr("stroke",function(d){
                    return '#aaa'
                })
                .attr("stroke-width",function(d){
                    return '1px'
                })
                .attr("fill", function(d) {
                    if(d.grade){
                      if(d.grade==='#CCC')
                        return '#888';
                      return d.grade;
                    }
                    return extendColorScale(d.positive, d.neutral)
                    // if(d.positive >= 0)
                    //     return "rgba(0, 255, 0,"+d.neutral+")";
                    // else
                    //   return "rgba(255,0,0,"+d.neutral+")";
                })
                .on("mouseover", function(d) {
                    d3.select(this)
                      .attr("fill", "orange");

                    var mouse=d3.mouse(this);
                    console.log(mouse)

                    var xPosition = mouseScale(d[xVar]);
                    var yPosition = mouse[1];
                      //Update the tooltip position and value
                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#username")
                      .style("font-weight",900)
                      .style("color","#CCC")
                      .text(d.username);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")           
                      .select("#value")
                      .style("font-weight",900)
                      .style("color","red")
                      .text("The date is "+d.date);

                    d3.select("#tooltip")
                      .style("left", xPosition + "px")
                      .style("top", yPosition + "px")
                      .select("#comment")
                      .text(d.text);
                      
                      //Show the tooltip
                    d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(d) {
                     d3.select(this)
                      .attr("fill", function(d) {
                        if(d.grade){
                          if(d.grade==='#CCC')
                            return '#888';
                          return d.grade;
                        }
                        return extendColorScale(d.positive, d.neutral)
                        // if(d.positive >= 0)
                        //     return "rgba(0, 255, 0,"+d.neutral+")";
                        // else
                        //   return "rgba(255,0,0,"+d.neutral+")";
                      });
                    d3.select("#tooltip").classed("hidden", true);
                })
                .on('click', function(d){
                      if(scope.showGoBack){
                      }else{
                        communicator.emitSentiment(d)
                      }
                })
            
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);
            

            var textG=svg.append("g")
                .attr("class", "axisText")

            textG.append("text")
                .attr('class', 'goBackLink')
                .attr("x", 50)
                .attr("y", 50)
                .attr("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("fill", "black")
                .append('tspan')
                .attr('text-decoration','underline')
                .text('Go Back To Summary')
                .on('click', function(){
                    communicator.emitSentiment('delete');
                })

            textG.append("text")
                .attr("x", w/2-70)
                .attr("y", h-50)
                .text("Time of a day")
                .attr("font-family", "sans-serif")
                .style("font-size", "20px")
                .attr("fill", "black");
          //y text
            textG.append("text")
                .attr("y", 70)
                .attr("x", -200)
                .attr("dy", ".31em")
                .attr("transform", "rotate(-90)")
                .text("Appreciation")
                .attr("font-family", "sans-serif")
                .style("font-size", "16px")
                .attr("fill", "black");

            textG.append("text")
                .attr("y", 70)
                .attr("x", -320)
                .attr("dy", ".31em")
                .attr("transform", "rotate(-90)")
                .text("Neutral")
                .attr("font-family", "sans-serif")
                .style("font-size", "16px")
                .attr("fill", "black");

            textG.append("text")
                .attr("y", 70)
                .attr("x", -460)
                .attr("dy", ".31em")
                .attr("transform", "rotate(-90)")
                .text("Questions")
                .attr("font-family", "sans-serif")
                .style("font-size", "16px")
                .attr("fill", "black");

                //add legend from here
                var margin={
                  left:800,
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


                var idGradient="gradient_id_grade"
                var legendG=svg.append("g")
                      .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");

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
                      .attr("fill","url('#" + idGradient + "')")
                      .attr("x",0)
                      .attr("y",0)
                      .attr("width",legendWidth)
                      .attr("height",legendHeight)
                      .attr("rx",2)  //rounded corners, of course!
                      .attr("ry",2);

                var theData = ['rgb(215,48,39)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(217,239,139)','rgb(166,217,106)','rgb(102,189,99)','rgb(26,152,80)'];

                //now the d3 magic (imo) ...
                var stops = d3.select('#' + idGradient).selectAll('stop')
                      .data(theData.reverse());
                stops.enter().append('stop');
                stops.attr('offset',function(d, i) {
                            return i*0.125;
                })
                .attr('stop-color',function(d) {
                            return d;
                })
        } 

          scope.$watch('sentimentData', function(data){if (data)
              console.log('sentimentData changed')
              setBackground();
              if(scope.showGoBack){
                  setPlotDetail();
              }else{
                setPlotSummary();
              }
          }, true);
        }
      };
});