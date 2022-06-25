let windowSize = 3
let reCenter = 0;
let imCenter = 0;
let win = null;

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

const zoomToPoint = function(x, y) {
	reCenter = reValue(x, true);
	imCenter = imValue(y);
	windowSize /= 2;
	window.points = buildStartPoints();
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

const buildStartPoints = function() {
	computeWindow();
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

$("#canvas").click((evt) => {
  window.stepIdx = 0; // TODO: bad state tracking here.
  zoomToPoint(evt.offsetX, evt.offsetY);
});

window.startDrawLoop = function() {
  window.points = buildStartPoints()
  const pixels = new Uint8ClampedArray(maxX * maxY * 4);
  window.stepIdx = 0;

  function draw() {
    if (window.paused) {
      setTimeout(draw, 500);
      return;
    }
    $("#step").html(stepIdx);
    window.step(window.points, stepIdx);
    window.points.forEach((point, idx) => {
      const hsl = window.getHSLForPoint(point);
      const rgb = d3.rgb(hsl);
      pixels[idx * 4] = rgb.r;
      pixels[idx * 4 + 1] = rgb.g;
      pixels[idx * 4 + 2] = rgb.b;
      pixels[idx * 4 + 3] = 255;
    });
    window.drawPixels(pixels);
    window.stepIdx++;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
