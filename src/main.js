/**
 * @class Cravat
 * Instantiate a new cravat UI in a given DOM element
 * @param {Object} options Options for the new cravat. Below are the possible (all optional) options:
 * root (HTMLElement) Where to append the new cravat (optional, appended to body by default)
 * width (Number) The expected width of the video (optional, 420 by default)
 * height (Number) The expected height of the video (optional, 420 by default)
 * onSnap (Function) Function to be executed when a snapshot is taken, will be given the dataURL as argument (by default, the image will be downloaded to the browser)
 */

function Cravat(options) {
  this._rootEl = options.root || document.body;
  this._width = options.width || 420;
  this._height = options.height || 420;
  this._onSnap = options.onSnap;

  this._init();
};

/**
 * All strings shown in the UI of cravat. Override what you want here
 */
Cravat.i18n = {
  snap: 'snap',
  transforms: 'Transforms',
  transform_standard: 'none',
  transform_rotate4: 'rotate4',
  transform_split4: 'split4',
  transform_hFlip: 'hFlip',
  transform_flipAll: 'flipAll',
  filters: 'Filters',
  filter_standard: 'none',
  filter_bw: 'bw',
  filter_grey3: 'grey3',
  filter_bi: 'bi',
  filter_offset: 'offset',
  filter_invert: 'invert',
  overlays: 'Overlays',
  overlay_standard: 'none',
  overlay_stripes: 'stripes',
  overlay_circle: 'circle'
};

Cravat.prototype._animLoop = function(render, element) {
  var running, lastFrame = +new Date,
    raf = requestAnimationFrame || mozRequestAnimationFrame || webkitRequestAnimationFrame;

  function loop(now) {
    if (running !== false) {
      raf(loop, element);
      running = render(now - lastFrame);
      lastFrame = now;
    }
  }
  loop(lastFrame);
};

Cravat.prototype._createMarkup = function() {
  var html = '\
    <div class="cravat">\
      <div class="frame">\
        <canvas class="video"></canvas>\
        <canvas class="overlay"></canvas>\
        <video style="display:none" autoplay></video>\
        <div class="count-down"></div>\
      </div>\
      <div class="tools">\
        <button class="snap">' + Cravat.i18n.snap + '</button>\
        <div class="transforms">\
          <h2>' + Cravat.i18n.transforms + '</h2>';

  Object.keys(Cravat.Transformer.prototype.transforms).forEach(function(item) {
    html += '<button data-transform="' + item + '">' + Cravat.i18n['transform_' + item] + '</button>';
  });

  html += '\
        </div>\
        <div class="filters">\
          <h2>' + Cravat.i18n.filters + '</h2>';

  Object.keys(Cravat.Filterer.prototype.filters).forEach(function(item) {
    html += '<button data-filter="' + item + '">' + Cravat.i18n['filter_' + item] + '</button>';
  });

  html += '\
        </div>\
        <div class="overlays">\
          <h2>' + Cravat.i18n.overlays + '</h2>';

  Object.keys(Cravat.Overlayer.prototype.overlays).forEach(function(item) {
    html += '<button data-overlay="' + item + '">' + Cravat.i18n['overlay_' + item] + '</button>';
  });

  html += '\
        </div>\
      </div>\
    </div>';

  this._rootEl.innerHTML = html;
};

Cravat.prototype.destroy = function() {
  this._removeEvents();
  this._rootEl.innerHTML = '';
};

Cravat.prototype._init = function() {
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  // Ensure getUserMedia is here
  if (navigator.getUserMedia) {
    // Create the HTML
    this._createMarkup();

    // Get the necessary objects and set dimensions
    var frame = this._rootEl.querySelector('.frame');
    frame.style.position = 'relative';
    frame.style.width = this._width + 'px';
    frame.style.height = this._height + 'px';

    this._videoEl = this._rootEl.querySelector('video');

    this._videoCanvasEl = this._rootEl.querySelector('canvas.video');
    this._videoCtx = this._videoCanvasEl.getContext('2d');

    this._overlayCanvasEl = this._rootEl.querySelector('canvas.overlay');
    this._overlayCtx = this._overlayCanvasEl.getContext('2d');

    this._mediaStream = null;

    this._videoCanvasEl.style.position = 'absolute';
    this._overlayCanvasEl.style.position = 'absolute';
    this._videoCanvasEl.width = this._overlayCanvasEl.width = this._width;
    this._videoCanvasEl.height = this._overlayCanvasEl.height = this._height;

    // Create the transformer, snapper, overlayer, filterer
    this._transformer = new Cravat.Transformer(this._videoEl, this._videoCtx);
    this._snapper = new Cravat.Snapper(this._videoCanvasEl, this._overlayCanvasEl, this._rootEl, this._onSnap);
    this._overlayer = new Cravat.Overlayer(this._overlayCtx);
    this._filterer = new Cravat.Filterer(this._videoCtx);

    // Add event listeners
    this._addEvents();

    // Start the video feed and stream to canvas
    navigator.getUserMedia({
      video: true
    }, function(stream) {
      this._mediaStream = stream;
      this._videoEl.src = window.URL.createObjectURL(this._mediaStream);
    }.bind(this), function(err) {
      this._rootEl.innerHTML = 'Sorry getUserMedia failed with error: ' + err;
    });

    // Start the loop to draw the video to the canvas, going through the current transform and current filter
    this._animLoop(function() {
      this._transformer.transform();
      this._videoCtx.putImageData(this._filterer.filter(this._videoCtx.getImageData(0, 0, this._width, this._height)), 0, 0);
    }.bind(this));
  } else {
    this._rootEl.innerHTML = 'Sorry your browser does not support getUserMedia';
  }
};

Cravat.prototype._addEvents = function() {
  this._rootEl.querySelector('button.snap').addEventListener('click', function(e) {
    this._snapper.snap();
  }.bind(this));

  [].slice.call(this._rootEl.querySelectorAll('.transforms button')).forEach(function(button) {
    button.addEventListener('click', function(e) {
      this.setTransform(e.target.dataset.transform);
    }.bind(this));
  }.bind(this));

  [].slice.call(this._rootEl.querySelectorAll('.overlays button')).forEach(function(button) {
    button.addEventListener('click', function(e) {
      this.setOverlay(e.target.dataset.overlay);
    }.bind(this));
  }.bind(this));


  [].slice.call(this._rootEl.querySelectorAll('.filters button')).forEach(function(button) {
    button.addEventListener('click', function(e) {
      this.setFilter(e.target.dataset.filter);
    }.bind(this));
  }.bind(this));
};

Cravat.prototype._removeEvents = function() {
  this._rootEl.querySelector('button.snap').removeEventListener('click');

  [].slice.call(this._rootEl.querySelectorAll('.transforms button')).forEach(function(button) {
    button.removeEventListener('click');
  });

  [].slice.call(this._rootEl.querySelectorAll('.overlays button')).forEach(function(button) {
    button.removeEventListener('click');
  });

  [].slice.call(this._rootEl.querySelectorAll('.filters button')).forEach(function(button) {
    button.removeEventListener('click');
  });
};

/**
 * Trigger a new snapshot now
 */
Cravat.prototype.snap = function() {
  this._snapper.snap();
};

/**
 * Set a different transform
 * @param {String} transform
 */
Cravat.prototype.setTransform = function(transform) {
  this._transformer.use(transform);
};

/**
 * Set a different overlay
 * @param {String} overlay
 */
Cravat.prototype.setOverlay = function(overlay) {
  this._overlayer.use(overlay);
};

/**
 * Set a different filter
 * @param {String} filter
 */
Cravat.prototype.setFilter = function(filter) {
  this._filterer.use(filter);
};