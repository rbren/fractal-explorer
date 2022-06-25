let windowSize = 3
let reCenter = 0;
let imCenter = 0;
let win = null;
let points = null;

const MAX_ABS = 2;
const MAX_COLOR_STEP = 100;

function computeWindow() {
	return win = {
		im: {
			start: imCenter - windowSize / 2,
			end: imCenter + windowSize / 2,
			step: windowSize / maxY,
		},
		re: {
			start: reCenter - windowSize / 2,
			end: reCenter + windowSize / 2,
			step: windowSize / maxX,
		},
	};
}

const xPixel = function(re) {
	const size = win.re.end - win.re.start;
	const spot = re - win.re.start;
	const pct = spot / size;
	return pct * maxX;
}

const yPixel = function(im) {
	const size = win.im.end - win.im.start;
	const spot = im - win.im.start;
	const pct = spot / size;
	return (1 - pct) * maxY;
}

const reValue = function(x, log) {
	const size = win.re.end - win.re.start;
	const pct = x / maxX;
	return win.re.start + pct * size
}

const imValue = function(y) {
	const size = win.im.end - win.im.start;
	const pct = y / maxY;
	return win.im.start + (1 - pct) * size
}

const getHSLForPoint = function(point) {
	if (point.stopStep || point.stopStep === 0) {
		let h = 60;
		if (point.root === 0) h = 0;
		if (point.root === 1) h = 120;
		if (point.root === 2) h = 240;
		const l = Math.pow(point.stopStep / MAX_COLOR_STEP, .5);
		return d3.hsl(h, 1.0, l);
	}
	const h = point.z.toPolar().phi * 360 /  (2 * Math.PI);
	const s = .5; //Math.min(1, math.abs(point.z) / 100);
	const l = Math.abs(point.z) > MAX_ABS ? 0.0 : 0.5;
    return d3.hsl(h, s, l);
}

const buildStartPoints = function() {
	computeWindow();
	console.log('compute points');
	const points = [];
	for (let y = 0; y < maxY; y++) {
		let im = imValue(y);
		for (let x = 0; x < maxX; x++) {
			let re = reValue(x);
			let c = math.complex(re, im);
			let z = math.complex(re, im);
			points.push({c, z});
		}
	}
	return points;
}

points = buildStartPoints();

window.click = function(x, y) {
	console.log('click', x, y);
	reCenter = reValue(x, true);
	imCenter = imValue(y);
	windowSize /= 2;
	console.log('new center', reCenter, imCenter, windowSize);
	points = buildStartPoints();
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

window.step = function(pixels, stepNumber) {
	if (!points) points = buildStartPoints(pixels.length / 4);
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
	points.forEach((point, idx) => {
		const hsl = getHSLForPoint(point);
		const rgb = d3.rgb(hsl);
		pixels[idx * 4] = rgb.r;
		pixels[idx * 4 + 1] = rgb.g;
		pixels[idx * 4 + 2] = rgb.b;
		pixels[idx * 4 + 3] = 255;
	});
}

