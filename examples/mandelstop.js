let windowSize = 3
let reCenter = 0;
let imCenter = 0;
let win = null;
let points = null;

const MAX_ABS = 2;
const MAX_COLOR_STEP = 1000;

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
	if (log) console.log('re', size, pct);
	return win.re.start + pct * size
}

const imValue = function(y) {
	const size = win.im.end - win.im.start;
	const pct = y / maxY;
	return win.im.start + (1 - pct) * size
}

const getHSLForPoint = function(point) {
	if (point.stopStep) {
		const l = Math.pow(point.stopStep / MAX_COLOR_STEP, .5);
		return d3.hsl(0.0, 1.0, l);
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
			let z = math.complex(0, 0)
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

window.step = function(pixels, stepNumber) {
	if (!points) points = buildStartPoints(pixels.length / 4);
	points.forEach(point => {
		if (point.stopStep) return;
		if (math.abs(point.z) > MAX_ABS) {
			point.stopStep = stepNumber;
			return;
		};
		zPolar = point.z.toPolar();
		zPolar.phi *= 2;
		zPolar.r *= zPolar.r;
		point.z = math.add(point.c, math.complex(zPolar))
		//point.z = math.add(math.multiply(point.z, point.z), point.c);
		//console.log('abs', math.abs(z));
	});
	console.log('points', points.length);
	points.forEach((point, idx) => {
		//if (Math.random() < .001) console.log('point', point);

		const hsl = getHSLForPoint(point);
		const rgb = d3.rgb(hsl);
		pixels[idx * 4] = rgb.r;
		pixels[idx * 4 + 1] = rgb.g;
		pixels[idx * 4 + 2] = rgb.b;
		pixels[idx * 4 + 3] = 255;
	});
}

