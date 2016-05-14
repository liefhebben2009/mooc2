var BezierUtils = (function BezierUtils() {
	var cache = {};
	function keyGen(p1, cp1, cp2, p2, t) {
		return p1.x + "," + p1.y + "-"
			+ cp1.x + "," + cp1.y + "-"
			+ cp2.x + "," + cp2.y + "-"
			+ p2.x + "," + p2.y + "-" + t;
	}
	function evaluate1D(p1, cp1, cp2, p2, t) {
		return (1 - t) * (1 - t) * (1 - t) * p1 + 3 * (1 - t) * (1 - t) * t * cp1 + 3 * (1 - t) * t * t * cp2 + t * t * t * p2;
	}
	function evaluate2D(p1, cp1, cp2, p2, t) {
		var key = keyGen(p1,cp1,cp2,p2,t);
		if(typeof cache[key] != 'undefined') {
			return cache[key];
		}
		var x = evaluate1D(p1.x, cp1.x, cp2.x, p2.x, t);
		var y = evaluate1D(p1.y, cp1.y, cp2.y, p2.y, t);
		var result = {x: x, y: y};
		cache[key] = result;
		return result;
	}
	return {evaluate2D:evaluate2D};
	
}());