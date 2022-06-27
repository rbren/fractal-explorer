const MAX_ABS = 2;
const MAX_COLOR_STEP = 100;

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

const JULIA_C = math.complex(-.4, .6);

window.step = function(points, stepNumber) {
  points.forEach(point => {
    if (point.stopStep) return;
    if (math.abs(point.z) > MAX_ABS) {
      point.stopStep = stepNumber;
    } else {
      zPolar = point.z.toPolar();
      zPolar.phi *= 2;
      zPolar.r *= zPolar.r;
      point.z = math.add(JULIA_C, math.complex(zPolar))
    }
    point.hsl = getHSLForPoint(point);
  });
  return points
}

