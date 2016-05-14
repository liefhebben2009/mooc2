'use strict';

angular.module('vistoolkit').directive('calenderView', function($window){
   return{
      restrict: 'AE',
      scope: {
        data: '=',      //chart data, [required]
        startDate: '=', //directive global api, [optional]
        endDate: '=',   //global events that directive would subscribe to, [optional]
        config: '=?',   //global directive configuration, [optional]
        filterCallback: '=',
      },
      link: function (scope, element, attr) {
          var parser = function(data) {
            var stats = {};
            for (var i = 0; i < data.length; i++) {
              stats[(data[i].date/1000)] = data[i].value;
            }
            return stats;
          };

          var startDateD = new Date(scope.startDate*1);
          var endDateD = new Date(scope.endDate*1);
          var range = endDateD.getMonth() - startDateD.getMonth() + 1;
          range = Math.max(range,5);
          var data = parser(scope.data);
          var cal = new CalHeatMap();
          cal.init({
            data: data,
            itemSelector: element[0],
            start: startDateD,
            domain : "month",
            subDomain : "day",
            range: range,
            cellSize: 20,
            onClick: function(date, count){
              scope.filterCallback(date);
            }
          });

        }
   };
});