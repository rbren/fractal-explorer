const MAX_ABS = 2;
const MAX_COLOR_STEP = 10;

const getHSLForPoint = function(point) {
  if (point.stopStep) {
    const l = (point.stopStep % MAX_COLOR_STEP) / MAX_COLOR_STEP;
    return d3.hsl(240, 1.0, l);
  }
  const h = point.z.toPolar().phi * 360 /  (2 * Math.PI);
  const s = .5; //Math.min(1, math.abs(point.z) / 100);
  const l = Math.abs(point.z) > MAX_ABS ? 0.0 : 0.5;
  return d3.hsl(h, s, l);
}

const ROTATION_STEPS = 100;
const ITERATIONS = 20;

window.step = function(points, stepNumber) {
  points.forEach(point => {
    const phi = 2 * Math.PI * (stepNumber % ROTATION_STEPS) / ROTATION_STEPS;
    const c = math.complex({r: .7885, phi});
    point.z = point.c;
    delete point.stopStep;
    for (var i = 0; i < ITERATIONS; ++i) {
      point.z = math.add(c, math.multiply(point.z, point.z))
      if (math.abs(point.z) > MAX_ABS) {
        point.stopStep = i;
        break;
      }
    }
    point.hsl = getHSLForPoint(point);
  });
  return points
}

