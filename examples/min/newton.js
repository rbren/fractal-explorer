const MAX_COLOR_STEP = 100;

window.getHSLForPoint = function(point) {
	if (point.stopStep || point.stopStep === 0) {
		let h = 60;
		if (point.root === 0) h = 0;
		if (point.root === 1) h = 120;
		if (point.root === 2) h = 240;
		const l = Math.pow(point.stopStep / MAX_COLOR_STEP, .5);
		return d3.hsl(h, 1.0, l);
	}
	const h = point.z.toPolar().phi * 360 /  (2 * Math.PI);
	const s = .5;
	const l = .5;
    return d3.hsl(h, s, l);
}

window.step = function(points, stepNumber) {
	points.forEach(point => {
		if (point.stopStep) return;
		let root = isCloseToRoot(point.z);
		if (root != -1) {
			point.stopStep = stepNumber;
			point.root = root;
			return
		}
		point.z = newtonNext(point.z);
	});
	return points;
}

let newtonF = function(x) {
	return math.subtract(math.pow(x, 3), 1);
}

let newtonFPrime = function(x) {
	return math.multiply(3, math.pow(x, 2));
}

let newtonNext = function(x) {
	const f = newtonF(x);
	const p = newtonFPrime(x);
	const ratio = math.divide(f, p);
	return math.subtract(x, ratio);
}

let roots = [
	math.complex(1, 0),
	math.complex(-.5, Math.sqrt(3) / 2),
	math.complex(-.5, -Math.sqrt(3) / 2),
];

let isCloseToRoot = function(x) {
	for (let idx = 0; idx < roots.length; ++idx) {
		const diff = math.subtract(x, roots[idx]);
		if (math.abs(diff) < 1e-6) return idx;
	}
	return -1;
}

