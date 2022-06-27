window.drawPixels = function(pixels) {
  idata.data.set(pixels);
  canvasCtx.putImageData(idata, 0, 0);
}

window.redrawCanvas = function() {
  console.log('redraw');
  const size = $("#canvasSize").val();
  window.maxX = size;
  window.maxY = size;
  window.canvas = $("#canvas")[0]
  window.canvasCtx = canvas.getContext('2d');
  window.idata = canvasCtx.createImageData(maxX, maxY);
  canvas.width = maxX;
  canvas.height = maxY;
}

redrawCanvas();
$("#canvasSize").change(() => redrawCanvas());

function restart() {
  window.paused = false;
  let code = window.editor.getValue();
  try {
    eval(code);
    $("#error").html("");
  } catch (e) {
    console.log(e);
    $("#error").html(`<pre>${e.toString() + e.stack}</pre>`);
    return;
  }
  window.startDrawLoop();
}

function pause() {
  window.paused = true;
}

function unpause() {
  window.paused = false;
}



