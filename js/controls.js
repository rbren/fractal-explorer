
const maxX = 350, maxY = 350;
const canvas = $("#canvas")[0]
const canvasCtx = canvas.getContext('2d');
canvas.width = maxX;
canvas.height = maxY;
const idata = canvasCtx.createImageData(maxX, maxY);

window.drawPixels = function(pixels) {
  idata.data.set(pixels);
  canvasCtx.putImageData(idata, 0, 0);
}

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



