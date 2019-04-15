module.exports = {
	intersect: function(a1, a2, b1, b2) {
		return a1 <= b2 && b1 <= a2;
	}
}