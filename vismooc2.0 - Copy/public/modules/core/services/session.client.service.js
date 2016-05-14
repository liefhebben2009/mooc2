'use strict';

angular.module('core').factory('session', [ 
	function() {

		var data = {};

		var set = function(name, value){
			data[name] = value;
		};

		var get = function(name){
			if (angular.isDefined(data[name]))
				return data[name];
			else
				return undefined;
		};
		// Public API
		return {
			'set': set,
			'get': get
		};
	}
]);
