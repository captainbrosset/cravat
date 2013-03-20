Cravat.Overlayer = function(ctx) {
  this._current = 'standard';
  this.ctx = ctx;
};

Cravat.Overlayer.prototype.use = function(overlay) {
  if (overlay in this.overlays) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.overlays[overlay](this.ctx);
  }
};

Cravat.Overlayer.prototype.overlays = {
  standard: function(ctx) {},
  stripes: function(ctx) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.translate(ctx.canvas.width, -ctx.canvas.height);
    ctx.rotate(Math.PI / 4);
    for (var i = 0; i < ctx.canvas.width * 2; i += 5) {
      ctx.fillRect(i, 0, 3, ctx.canvas.height * 3);
    }
    ctx.restore();
  },
  circle: function(ctx) {
    var w = ctx.canvas.width,
      h = ctx.canvas.height,
      r = (Math.min(w, h) / 2) - 15;

    var distanceFromSide = (w / 2) - r,
      distanceFromTop = (h / 2) - r;

    ctx.save();
    ctx.fillStyle = 'white';

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w / 2, 0);
    ctx.lineTo(w / 2, distanceFromTop);
    ctx.arcTo(distanceFromSide, distanceFromTop, distanceFromSide, h / 2, r);
    ctx.lineTo(0, h / 2);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(distanceFromSide + (2 * r), h / 2);
    ctx.arcTo(distanceFromSide + (2 * r), distanceFromTop, w / 2, distanceFromTop, r);
    ctx.lineTo(w / 2, 0);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(w, h / 2);
    ctx.lineTo(distanceFromSide + (2 * r), h / 2);
    ctx.arcTo(distanceFromSide + (2 * r), distanceFromTop + (2 * r), w / 2, distanceFromTop + (2 * r), r);
    ctx.lineTo(w / 2, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, h / 2);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(w / 2, h);
    ctx.lineTo(w / 2, distanceFromTop + (2 * r));
    ctx.arcTo(distanceFromSide, distanceFromTop + (2 * r), distanceFromSide, h / 2, r);
    ctx.lineTo(0, h / 2);
    ctx.lineTo(0, h);
    ctx.lineTo(w / 2, h);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }
};