Cravat.Snapper = function(canvas, overlay, rootEl, onSnap) {
  this._countDownEl = rootEl.querySelector('div.count-down');
  this._canvas = canvas;
  this._overlay = overlay;
  this._onSnap = onSnap;
};

Cravat.Snapper.prototype._showStep = function(step) {
  this._countDownEl.className = '';
  this._countDownEl.innerHTML = '<span>' + step + '</span>';
  this._countDownEl.className = 'count-down fade';
};

Cravat.Snapper.prototype.snap = function() {
  this._showStep(3);
  var step = 2;
  this._snapInterval = setInterval(function() {
    if (step === 0) {
      clearInterval(this._snapInterval);
      this._doSnap();
      this._countDownEl.innerHTML = '';
    } else {
      this._showStep(step);
      step--;
    }
  }.bind(this), 1000);
};

Cravat.Snapper.prototype._doSnap = function() {
  var savedCanvas = document.createElement('canvas'),
    savedCtx = savedCanvas.getContext('2d');
  savedCanvas.width = this._canvas.width;
  savedCanvas.height = this._canvas.height;

  savedCtx.drawImage(this._canvas, 0, 0, this._canvas.width, this._canvas.height);
  savedCtx.drawImage(this._overlay, 0, 0, this._canvas.width, this._canvas.height);

  if (this._onSnap) {
    debugger;
    this._onSnap(savedCanvas.toDataURL('image/png'));
  } else {
    document.location.href = savedCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  }
};