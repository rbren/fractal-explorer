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

var svg = null;
const maxX = 500, maxY = 400;

function restart() {
  $("#container").empty();
  svg = d3.select("#container").append("svg")
    .attr("width", maxX)
    .attr("height", maxY);
  code = $("#code textarea").val();
  eval(code);
}

$(function () {
  $("#code textarea").val(DEFAULT_CODE);
  restart();
});


