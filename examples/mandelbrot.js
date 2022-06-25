const windowSize = 3
const maxIterations = 100;
const startRe = -2;
const endRe = startRe + windowSize;
const startIm = -1.5;
const endIm = startIm + windowSize;
const steps = 500;
const stepRe = (endRe - startRe) / steps;
const stepIm = (endIm - startIm) / steps;

const maxValue = 10;

const xPixel = function(re) {
	const size = endRe - startRe;
	const spot = re - startRe;
	const pct = spot / size;
	return pct * maxX;
}

const yPixel = function(im) {
	const size = endIm - startIm;
	const spot = im - startIm;
	const pct = spot / size;
	return pct * maxY;
}

const points = [];
for (let re = startRe; re < endRe; re += stepRe) {
	for (let im = startIm; im < endIm; im += stepIm) {
		let c = math.complex(re, im);
		let z = math.complex(0, 0);
		console.log(z.toPolar().phi);
		points.push({c, z});
	}
}

circlesSel = svg.selectAll("circle").data(points);
circlesSel.enter().append("circle")
  .attr({
    "r": function (d) { return .5; },
    "cx": function (d) { return xPixel(d.c.re) },
    "cy": function (d) { return yPixel(d.c.im) },
  })
  .style({
    "fill": function (d) { return d3.hsl(d.z.toPolar().phi * 360 /  (2 * Math.PI), .5, .5); },
	"stroke": function (d) { return d3.hsl(d.z.toPolar().phi * 360 /  (2 * Math.PI), .5, .5); },
    "stroke-width": function (d) { return d.strokeWidth; }
  });


requestAnimationFrame(step);
let stepNumber = 0;

function step() {
	console.log('step', stepNumber);
	points.forEach(point => {
		point.z = math.add(math.multiply(point.z, point.z), point.c);
	})
    circlesSel.style({
 	    "fill": function (d) { return d3.hsl(d.z.toPolar().phi * 360 /  (2 * Math.PI), .5, .5); },
	    "stroke": function (d) { return d3.hsl(d.z.toPolar().phi * 360 /  (2 * Math.PI), .5, .5); },
 	    "stroke-width": function (d) { return d.strokeWidth; }
 	});
    stepNumber++;
    requestAnimationFrame(step);
}


