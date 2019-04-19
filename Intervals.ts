export default {
	intersect: function(a1: number, a2: number, b1: number, b2: number) {
		return a1 <= b2 && b1 <= a2;
	}
}