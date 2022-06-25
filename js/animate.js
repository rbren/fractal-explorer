const DEFAULT_CODE = `
var circles = [];
var count = 100,
    radius = 15,
    steps = 0;

for (i = 0; i < count; i++) {
    circle = {
        x: maxX * Math.random(),
        y: maxY * Math.random(),
        radius: radius,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
        vx: Math.random(),
        vy: Math.random()
    };
    circles.push(circle);
}

circlesSel = svg.selectAll("circle").data(circles);
circlesSel.enter().append("circle")
  .attr({
    "r": function (d) { return d.radius; },
    "cx": function (d) { return d.x; },
    "cy": function (d) { return d.y; }
  })
  .style({
    "fill": function (d) { return d.fill; },
    "stroke": function (d) { return d.stroke; },
    "stroke-width": function (d) { return d.strokeWidth; }
  });

startTime = new Date().getTime();
requestAnimationFrame(step);

function step() {
  var i, len, c, time;
  for (i = 0, len = count; i < len; i++) {
      c = circles[i];
      if (c.x >= maxX || c.x <= 0) c.vx *= -1;
      if (c.y >= maxY || c.y <= 0) c.vy *= -1;
      c.x += c.vx;
      c.y += c.vy;
  }
  circlesSel.attr({
      "cx": function (d) { return d.x; },
      "cy": function (d) { return d.y; }
  });
  steps++;
  requestAnimationFrame(step);
}
`

function updateResults(count, time, steps) {
  console.log(count, time, steps);
}

const maxX = 350, maxY = 350;
const canvas = $("#canvas")[0]
const canvasCtx = canvas.getContext('2d');
canvas.width = maxX;
canvas.height = maxY;
const idata = canvasCtx.createImageData(maxX, maxY);
$("#canvas").click((evt) => {
  console.log('click', evt);
  if (window.click) {
    window.click(evt.offsetX, evt.offsetY);
  }
});

function restart() {
  window.stopped = false;
  let code = window.editor.getValue();
  try {
    eval(code);
    $("#error").html("");
  } catch (e) {
    console.log(e);
    $("#error").html(`<pre>${e.toString() + e.stack}</pre>`);
    return;
  }
  const pixels = new Uint8ClampedArray(maxX * maxY * 4);
  if (window.step) {
    let stepIdx = 0;
    let stepCallback = function() {
      window.step(pixels, stepIdx);
      $("#step").html(stepIdx);
      stepIdx++;
      idata.data.set(pixels);
      canvasCtx.putImageData(idata, 0, 0);
      if (!window.stopped) {
        requestAnimationFrame(stepCallback);
      }
    }
    requestAnimationFrame(stepCallback);
  }
}

function stop() {
  window.stopped = true;
}

onEditorLoaded(function() {
  window.editor.setValue(window.localStorage.getItem('code') || DEFAULT_CODE);
});


