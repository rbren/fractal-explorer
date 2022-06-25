const MAX_ABS = 2;
const MAX_COLOR_STEP = 1000;

window.getHSLForPoint = function(point) {
        if (point.stopStep) {
                const l = Math.pow(point.stopStep / MAX_COLOR_STEP, .5);
                return d3.hsl(0.0, 1.0, l);
        }
        const h = point.z.toPolar().phi * 360 /  (2 * Math.PI);
        const s = .5; //Math.min(1, math.abs(point.z) / 100);
        const l = Math.abs(point.z) > MAX_ABS ? 0.0 : 0.5;
    return d3.hsl(h, s, l);
}

window.step = function(points, stepNumber) {
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
	});
	return points
}

