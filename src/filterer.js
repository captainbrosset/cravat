Cravat.Filterer = function(ctx) {
  this._current = 'standard';
};

Cravat.Filterer.prototype.use = function(filter) {
  if (filter in this.filters) {
    this._current = filter;
  }
};

Cravat.Filterer.prototype.filter = function(imageData) {
  var len = imageData.data.length;
  for (var i = 0; i < len; i += 4) {
    rgba = this.filters[this._current](imageData.data[i], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3], i, len);
    imageData.data[i] = rgba[0];
    imageData.data[i + 1] = rgba[1];
    imageData.data[i + 2] = rgba[2];
    imageData.data[i + 3] = rgba[3];
  }
  return imageData;
};

Cravat.Filterer.prototype.filters = {
  standard: function(r, g, b, a, index, len) {
    return [r, g, b, a];
  },
  bw: function(r, g, b, a, index, len) {
    var luma = Math.floor(r * 0.3 + g * 0.59 + b * 0.11);
    r = g = b = luma;
    a = 255;
    return [r, g, b, a];
  },
  grey3: function(r, g, b, a, index, len) {
    var w = 100;
    var bl = 30;
    if (r > w && g > w && b > w) {
      return [200, 200, 200, 255];
    } else if (r <= w && r > bl && g <= w && g > bl && b <= w && b > bl) {
      return [150, 150, 150, 255];
    } else {
      return [100, 100, 100, 255];
    }
  },
  bi: function(r, g, b, a, index, len) {
    var w = 100;
    if (r > w && g > w && b > w) {
      return [255, 255, 255, 255];
    } else {
      return [255, 0, 0, 255];
    }
  },
  offset: function(r, g, b, a, index, len) {
    return [b, g, r, a];
  },
  invert: function(r, g, b, a, index, len) {
    return [255 - r, 255 - g, 255 - b, a];
  }
};