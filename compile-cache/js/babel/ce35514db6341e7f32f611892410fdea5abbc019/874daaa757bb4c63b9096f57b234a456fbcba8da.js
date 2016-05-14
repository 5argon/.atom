Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _decoratorsInclude = require('./decorators/include');

var _decoratorsInclude2 = _interopRequireDefault(_decoratorsInclude);

var _mixinsDecorationManagement = require('./mixins/decoration-management');

var _mixinsDecorationManagement2 = _interopRequireDefault(_mixinsDecorationManagement);

var _adaptersLegacyAdapter = require('./adapters/legacy-adapter');

var _adaptersLegacyAdapter2 = _interopRequireDefault(_adaptersLegacyAdapter);

var _adaptersStableAdapter = require('./adapters/stable-adapter');

var _adaptersStableAdapter2 = _interopRequireDefault(_adaptersStableAdapter);

'use babel';

var nextModelId = 1;

/**
 * The Minimap class is the underlying model of a <MinimapElement>.
 * Most manipulations of the minimap is done through the model.
 *
 * Any Minimap instance is tied to a `TextEditor`.
 * Their lifecycle follow the one of their target `TextEditor`, so they are
 * destroyed whenever their `TextEditor` is destroyed.
 */

var Minimap = (function () {
  /**
   * Creates a new Minimap instance for the given `TextEditor`.
   *
   * @param  {Object} options an object with the new Minimap properties
   * @param  {TextEditor} options.textEditor the target text editor for
   *                                         the minimap
   * @param  {boolean} [options.standAlone] whether this minimap is in
   *                                        stand-alone mode or not
   * @param  {number} [options.width] the minimap width in pixels
   * @param  {number} [options.height] the minimap height in pixels
   * @throws {Error} Cannot create a minimap without an editor
   */

  function Minimap() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _Minimap);

    if (!options.textEditor) {
      throw new Error('Cannot create a minimap without an editor');
    }

    /**
     * The Minimap's text editor.
     *
     * @type {TextEditor}
     * @access private
     */
    this.textEditor = options.textEditor;
    /**
     * The stand-alone state of the current Minimap.
     *
     * @type {boolean}
     * @access private
     */
    this.standAlone = options.standAlone;
    /**
     * The width of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.width = options.width;
    /**
     * The height of the current Minimap.
     *
     * @type {number}
     * @access private
     */
    this.height = options.height;
    /**
     * The id of the current Minimap.
     *
     * @type {Number}
     * @access private
     */
    this.id = nextModelId++;
    /**
     * The events emitter of the current Minimap.
     *
     * @type {Emitter}
     * @access private
     */
    this.emitter = new _atom.Emitter();
    /**
     * The Minimap's subscriptions.
     *
     * @type {CompositeDisposable}
     * @access private
     */
    this.subscriptions = new _atom.CompositeDisposable();
    /**
     * The adapter object leverage the access to several properties from
     * the `TextEditor`/`TextEditorElement` to support the different APIs
     * between different version of Atom.
     *
     * @type {Object}
     * @access private
     */
    this.adapter = null;
    /**
     * The char height of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charHeight = null;
    /**
     * The char height from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharHeight = null;
    /**
     * The char width of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.charWidth = null;
    /**
     * The char width from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configCharWidth = null;
    /**
     * The interline of the current Minimap, will be `undefined` unless
     * `setCharWidth` is called.
     *
     * @type {number}
     * @access private
     */
    this.interline = null;
    /**
     * The interline from the package's configuration. Will be overriden
     * by the instance value.
     *
     * @type {number}
     * @access private
     */
    this.configInterline = null;
    /**
     * The devicePixelRatioRounding of the current Minimap, will be
     * `undefined` unless `setDevicePixelRatioRounding` is called.
     *
     * @type {boolean}
     * @access private
     */
    this.devicePixelRatioRounding = null;
    /**
     * The devicePixelRatioRounding from the package's configuration.
     * Will be overriden by the instance value.
     *
     * @type {boolean}
     * @access private
     */
    this.configDevicePixelRatioRounding = null;
    /**
    /**
     * A boolean value to store whether this Minimap have been destroyed or not.
     *
     * @type {boolean}
     * @access private
     */
    this.destroyed = false;
    /**
     * A boolean value to store whether the `scrollPastEnd` setting is enabled
     * or not.
     *
     * @type {boolean}
     * @access private
     */
    this.scrollPastEnd = false;

    this.initializeDecorations();

    if (atom.views.getView(this.textEditor).getScrollTop != null) {
      this.adapter = new _adaptersStableAdapter2['default'](this.textEditor);
    } else {
      this.adapter = new _adaptersLegacyAdapter2['default'](this.textEditor);
    }

    /**
     * When in stand-alone or independent scrolling mode, this value can be used
     * instead of the computed scroll.
     *
     * @type {number}
     * @access private
     */
    this.scrollTop = 0;

    var subs = this.subscriptions;
    var configSubscription = this.subscribeToConfig();

    subs.add(configSubscription);

    subs.add(this.textEditor.onDidChangeGrammar(function () {
      subs.remove(configSubscription);
      configSubscription.dispose();

      configSubscription = _this.subscribeToConfig();
      subs.add(configSubscription);
    }));

    subs.add(this.adapter.onDidChangeScrollTop(function () {
      if (!_this.standAlone && !_this.ignoreTextEditorScroll) {
        _this.updateScrollTop();
        _this.emitter.emit('did-change-scroll-top', _this);
      }

      if (_this.ignoreTextEditorScroll) {
        _this.ignoreTextEditorScroll = false;
      }
    }));
    subs.add(this.adapter.onDidChangeScrollLeft(function () {
      if (!_this.standAlone) {
        _this.emitter.emit('did-change-scroll-left', _this);
      }
    }));

    subs.add(this.textEditor.onDidChange(function (changes) {
      _this.emitChanges(changes);
    }));
    subs.add(this.textEditor.onDidDestroy(function () {
      _this.destroy();
    }));

    /*
    FIXME Some changes occuring during the tokenization produces
    ranges that deceive the canvas rendering by making some
    lines at the end of the buffer intact while they are in fact not,
    resulting in extra lines appearing at the end of the minimap.
    Forcing a whole repaint to fix that bug is suboptimal but works.
    */
    var tokenizedBuffer = this.textEditor.tokenizedBuffer ? this.textEditor.tokenizedBuffer : this.textEditor.displayBuffer.tokenizedBuffer;

    subs.add(tokenizedBuffer.onDidTokenize(function () {
      _this.emitter.emit('did-change-config');
    }));
  }

  /**
   * Destroys the model.
   */

  _createClass(Minimap, [{
    key: 'destroy',
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.destroyed = true;
    }

    /**
     * Returns `true` when this `Minimap` has benn destroyed.
     *
     * @return {boolean} whether this Minimap has been destroyed or not
     */
  }, {
    key: 'isDestroyed',
    value: function isDestroyed() {
      return this.destroyed;
    }

    /**
     * Registers an event listener to the `did-change` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                                event is triggered.
     *                                                the callback will be called
     *                                                with an event object with
     *                                                the following properties:
     * - start: The change's start row number
     * - end: The change's end row number
     * - screenDelta: the delta in buffer rows between the versions before and
     *   after the change
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChange',
    value: function onDidChange(callback) {
      return this.emitter.on('did-change', callback);
    }

    /**
     * Registers an event listener to the `did-change-config` event.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeConfig',
    value: function onDidChangeConfig(callback) {
      return this.emitter.on('did-change-config', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-top` event.
     *
     * The event is dispatched when the text editor `scrollTop` value have been
     * changed or when the minimap scroll top have been changed in stand-alone
     * mode.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollTop',
    value: function onDidChangeScrollTop(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    }

    /**
     * Registers an event listener to the `did-change-scroll-left` event.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeScrollLeft',
    value: function onDidChangeScrollLeft(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    }

    /**
     * Registers an event listener to the `did-change-stand-alone` event.
     *
     * This event is dispatched when the stand-alone of the current Minimap
     * is either enabled or disabled.
     *
     * @param  {function(minimap:Minimap):void} callback a function to call when
     *                                                   the event is triggered.
     *                                                   The current Minimap is
     *                                                   passed as argument to
     *                                                   the callback.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeStandAlone',
    value: function onDidChangeStandAlone(callback) {
      return this.emitter.on('did-change-stand-alone', callback);
    }

    /**
     * Registers an event listener to the `did-destroy` event.
     *
     * This event is dispatched when this Minimap have been destroyed. It can
     * occurs either because the {@link destroy} method have been called on the
     * Minimap or because the target text editor have been destroyed.
     *
     * @param  {function():void} callback a function to call when the event
     *                                    is triggered.
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }

    /**
     * Registers to the config changes for the current editor scope.
     *
     * @return {Disposable} the disposable to dispose all the registered events
     * @access private
     */
  }, {
    key: 'subscribeToConfig',
    value: function subscribeToConfig() {
      var _this2 = this;

      var subs = new _atom.CompositeDisposable();
      var opts = { scope: this.textEditor.getRootScopeDescriptor() };

      subs.add(atom.config.observe('editor.scrollPastEnd', opts, function (scrollPastEnd) {
        _this2.scrollPastEnd = scrollPastEnd;
        _this2.adapter.scrollPastEnd = _this2.scrollPastEnd;
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charHeight', opts, function (configCharHeight) {
        _this2.configCharHeight = configCharHeight;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.charWidth', opts, function (configCharWidth) {
        _this2.configCharWidth = configCharWidth;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.interline', opts, function (configInterline) {
        _this2.configInterline = configInterline;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));
      subs.add(atom.config.observe('minimap.independentMinimapScroll', opts, function (independentMinimapScroll) {
        _this2.independentMinimapScroll = independentMinimapScroll;
        _this2.updateScrollTop();
      }));
      subs.add(atom.config.observe('minimap.scrollSensitivity', opts, function (scrollSensitivity) {
        _this2.scrollSensitivity = scrollSensitivity;
      }));
      // cdprr is shorthand for configDevicePixelRatioRounding
      subs.add(atom.config.observe('minimap.devicePixelRatioRounding', opts, function (cdprr) {
        _this2.configDevicePixelRatioRounding = cdprr;
        _this2.updateScrollTop();
        _this2.emitter.emit('did-change-config');
      }));

      return subs;
    }

    /**
     * Returns `true` when the current Minimap is a stand-alone minimap.
     *
     * @return {boolean} whether this Minimap is in stand-alone mode or not.
     */
  }, {
    key: 'isStandAlone',
    value: function isStandAlone() {
      return this.standAlone;
    }

    /**
     * Sets the stand-alone mode for this minimap.
     *
     * @param {boolean} standAlone the new state of the stand-alone mode for this
     *                             Minimap
     * @emits {did-change-stand-alone} if the stand-alone mode have been toggled
     *        on or off by the call
     */
  }, {
    key: 'setStandAlone',
    value: function setStandAlone(standAlone) {
      if (standAlone !== this.standAlone) {
        this.standAlone = standAlone;
        this.emitter.emit('did-change-stand-alone', this);
      }
    }

    /**
     * Returns the `TextEditor` that this minimap represents.
     *
     * @return {TextEditor} this Minimap's text editor
     */
  }, {
    key: 'getTextEditor',
    value: function getTextEditor() {
      return this.textEditor;
    }

    /**
     * Returns the height of the `TextEditor` at the Minimap scale.
     *
     * @return {number} the scaled height of the text editor
     */
  }, {
    key: 'getTextEditorScaledHeight',
    value: function getTextEditorScaledHeight() {
      return this.adapter.getHeight() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll top value at the Minimap scale.
     *
     * @return {number} the scaled scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollTop',
    value: function getTextEditorScaledScrollTop() {
      return this.adapter.getScrollTop() * this.getVerticalScaleFactor();
    }

    /**
     * Returns the `TextEditor` scroll left value at the Minimap scale.
     *
     * @return {number} the scaled scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScaledScrollLeft',
    value: function getTextEditorScaledScrollLeft() {
      return this.adapter.getScrollLeft() * this.getHorizontalScaleFactor();
    }

    /**
     * Returns the `TextEditor` maximum scroll top value.
     *
     * When the `scrollPastEnd` setting is enabled, the method compensate the
     * extra scroll by removing the same height as added by the editor from the
     * final value.
     *
     * @return {number} the maximum scroll top of the text editor
     */
  }, {
    key: 'getTextEditorMaxScrollTop',
    value: function getTextEditorMaxScrollTop() {
      return this.adapter.getMaxScrollTop();
    }

    /**
     * Returns the `TextEditor` scroll top value.
     *
     * @return {number} the scroll top of the text editor
     */
  }, {
    key: 'getTextEditorScrollTop',
    value: function getTextEditorScrollTop() {
      return this.adapter.getScrollTop();
    }

    /**
     * Sets the scroll top of the `TextEditor`.
     *
     * @param {number} scrollTop the new scroll top value
     */
  }, {
    key: 'setTextEditorScrollTop',
    value: function setTextEditorScrollTop(scrollTop) {
      var ignoreTextEditorScroll = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.ignoreTextEditorScroll = ignoreTextEditorScroll;
      this.adapter.setScrollTop(scrollTop);
    }

    /**
     * Returns the `TextEditor` scroll left value.
     *
     * @return {number} the scroll left of the text editor
     */
  }, {
    key: 'getTextEditorScrollLeft',
    value: function getTextEditorScrollLeft() {
      return this.adapter.getScrollLeft();
    }

    /**
     * Returns the height of the `TextEditor`.
     *
     * @return {number} the height of the text editor
     */
  }, {
    key: 'getTextEditorHeight',
    value: function getTextEditorHeight() {
      return this.adapter.getHeight();
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * When the `scrollPastEnd` setting is enabled the value may exceed `1` as the
     * maximum scroll value used to compute this ratio compensate for the extra
     * height in the editor. **Use {@link getCapedTextEditorScrollRatio} when
     * you need a value that is strictly between `0` and `1`.**
     *
     * @return {number} the scroll ratio of the text editor
     */
  }, {
    key: 'getTextEditorScrollRatio',
    value: function getTextEditorScrollRatio() {
      return this.adapter.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    }

    /**
     * Returns the `TextEditor` scroll as a value normalized between `0` and `1`.
     *
     * The returned value will always be strictly between `0` and `1`.
     *
     * @return {number} the scroll ratio of the text editor strictly between
     *                  0 and 1
     */
  }, {
    key: 'getCapedTextEditorScrollRatio',
    value: function getCapedTextEditorScrollRatio() {
      return Math.min(1, this.getTextEditorScrollRatio());
    }

    /**
     * Returns the height of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the height of the minimap
     */
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    }

    /**
     * Returns the width of the whole minimap in pixels based on the `minimap`
     * settings.
     *
     * @return {number} the width of the minimap
     */
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.textEditor.getMaxScreenLineLength() * this.getCharWidth();
    }

    /**
     * Returns the height the Minimap content will take on screen.
     *
     * When the Minimap height is greater than the `TextEditor` height, the
     * `TextEditor` height is returned instead.
     *
     * @return {number} the visible height of the Minimap
     */
  }, {
    key: 'getVisibleHeight',
    value: function getVisibleHeight() {
      return Math.min(this.getScreenHeight(), this.getHeight());
    }

    /**
     * Returns the height the minimap should take once displayed, it's either
     * the height of the `TextEditor` or the provided `height` when in stand-alone
     * mode.
     *
     * @return {number} the total height of the Minimap
     */
  }, {
    key: 'getScreenHeight',
    value: function getScreenHeight() {
      if (this.isStandAlone()) {
        if (this.height != null) {
          return this.height;
        } else {
          return this.getHeight();
        }
      } else {
        return this.adapter.getHeight();
      }
    }

    /**
     * Returns the width the whole Minimap will take on screen.
     *
     * @return {number} the width of the Minimap when displayed
     */
  }, {
    key: 'getVisibleWidth',
    value: function getVisibleWidth() {
      return Math.min(this.getScreenWidth(), this.getWidth());
    }

    /**
     * Returns the width the Minimap should take once displayed, it's either the
     * width of the Minimap content or the provided `width` when in standAlone
     * mode.
     *
     * @return {number} the Minimap screen width
     */
  }, {
    key: 'getScreenWidth',
    value: function getScreenWidth() {
      if (this.isStandAlone() && this.width != null) {
        return this.width;
      } else {
        return this.getWidth();
      }
    }

    /**
     * Sets the preferred height and width when in stand-alone mode.
     *
     * This method is called by the <MinimapElement> for this Minimap so that
     * the model is kept in sync with the view.
     *
     * @param {number} height the new height of the Minimap
     * @param {number} width the new width of the Minimap
     */
  }, {
    key: 'setScreenHeightAndWidth',
    value: function setScreenHeightAndWidth(height, width) {
      this.height = height;
      this.width = width;
      this.updateScrollTop();
    }

    /**
     * Returns the vertical scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap vertical scaling factor
     */
  }, {
    key: 'getVerticalScaleFactor',
    value: function getVerticalScaleFactor() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    }

    /**
     * Returns the horizontal scaling factor when converting coordinates from the
     * `TextEditor` to the Minimap.
     *
     * @return {number} the Minimap horizontal scaling factor
     */
  }, {
    key: 'getHorizontalScaleFactor',
    value: function getHorizontalScaleFactor() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    }

    /**
     * Returns the height of a line in the Minimap in pixels.
     *
     * @return {number} a line's height in the Minimap
     */
  }, {
    key: 'getLineHeight',
    value: function getLineHeight() {
      return this.getCharHeight() + this.getInterline();
    }

    /**
     * Returns the width of a character in the Minimap in pixels.
     *
     * @return {number} a character's width in the Minimap
     */
  }, {
    key: 'getCharWidth',
    value: function getCharWidth() {
      if (this.charWidth != null) {
        return this.charWidth;
      } else {
        return this.configCharWidth;
      }
    }

    /**
     * Sets the char width for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charWidth the new width of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharWidth',
    value: function setCharWidth(charWidth) {
      this.charWidth = Math.floor(charWidth);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of a character in the Minimap in pixels.
     *
     * @return {number} a character's height in the Minimap
     */
  }, {
    key: 'getCharHeight',
    value: function getCharHeight() {
      if (this.charHeight != null) {
        return this.charHeight;
      } else {
        return this.configCharHeight;
      }
    }

    /**
     * Sets the char height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} charHeight the new height of a char in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setCharHeight',
    value: function setCharHeight(charHeight) {
      this.charHeight = Math.floor(charHeight);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the height of an interline in the Minimap in pixels.
     *
     * @return {number} the interline's height in the Minimap
     */
  }, {
    key: 'getInterline',
    value: function getInterline() {
      if (this.interline != null) {
        return this.interline;
      } else {
        return this.configInterline;
      }
    }

    /**
     * Sets the interline height for this Minimap. This value will override the
     * value from the config for this instance only. A `did-change-config`
     * event is dispatched.
     *
     * @param {number} interline the new height of an interline in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setInterline',
    value: function setInterline(interline) {
      this.interline = Math.floor(interline);
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the status of devicePixelRatioRounding in the Minimap.
     *
     * @return {boolean} the devicePixelRatioRounding status in the Minimap
     */
  }, {
    key: 'getDevicePixelRatioRounding',
    value: function getDevicePixelRatioRounding() {
      if (this.devicePixelRatioRounding != null) {
        return this.devicePixelRatioRounding;
      } else {
        return this.configDevicePixelRatioRounding;
      }
    }

    /**
     * Sets the devicePixelRatioRounding status for this Minimap.
     * This value will override the value from the config for this instance only.
     * A `did-change-config` event is dispatched.
     *
     * @param {boolean} devicePixelRatioRounding the new status of
     *                                           devicePixelRatioRounding
     *                                           in the Minimap
     * @emits {did-change-config} when the value is changed
     */
  }, {
    key: 'setDevicePixelRatioRounding',
    value: function setDevicePixelRatioRounding(devicePixelRatioRounding) {
      this.devicePixelRatioRounding = devicePixelRatioRounding;
      this.emitter.emit('did-change-config');
    }

    /**
     * Returns the devicePixelRatio in the Minimap in pixels.
     *
     * @return {number} the devicePixelRatio in the Minimap
     */
  }, {
    key: 'getDevicePixelRatio',
    value: function getDevicePixelRatio() {
      return this.getDevicePixelRatioRounding() ? Math.floor(devicePixelRatio) : devicePixelRatio;
    }

    /**
     * Returns the index of the first visible row in the Minimap.
     *
     * @return {number} the index of the first visible row
     */
  }, {
    key: 'getFirstVisibleScreenRow',
    value: function getFirstVisibleScreenRow() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    }

    /**
     * Returns the index of the last visible row in the Minimap.
     *
     * @return {number} the index of the last visible row
     */
  }, {
    key: 'getLastVisibleScreenRow',
    value: function getLastVisibleScreenRow() {
      return Math.ceil((this.getScrollTop() + this.getScreenHeight()) / this.getLineHeight());
    }

    /**
     * Returns true when the `independentMinimapScroll` setting have been enabled.
     *
     * @return {boolean} whether the minimap can scroll independently
     */
  }, {
    key: 'scrollIndependentlyOnMouseWheel',
    value: function scrollIndependentlyOnMouseWheel() {
      return this.independentMinimapScroll;
    }

    /**
     * Returns the current scroll of the Minimap.
     *
     * The Minimap can scroll only when its height is greater that the height
     * of its `TextEditor`.
     *
     * @return {number} the scroll top of the Minimap
     */
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      return this.standAlone || this.independentMinimapScroll ? this.scrollTop : this.getScrollTopFromEditor();
    }

    /**
     * Sets the minimap scroll top value when in stand-alone mode.
     *
     * @param {number} scrollTop the new scroll top for the Minimap
     * @emits {did-change-scroll-top} if the Minimap's stand-alone mode is enabled
     */
  }, {
    key: 'setScrollTop',
    value: function setScrollTop(scrollTop) {
      this.scrollTop = Math.max(0, Math.min(this.getMaxScrollTop(), scrollTop));

      if (this.standAlone || this.independentMinimapScroll) {
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the minimap scroll as a ration between 0 and 1.
     *
     * @return {number} the minimap scroll ratio
     */
  }, {
    key: 'getScrollRatio',
    value: function getScrollRatio() {
      return this.getScrollTop() / this.getMaxScrollTop();
    }

    /**
     * Updates the scroll top value with the one computed from the text editor
     * when the minimap is in the independent scrolling mode.
     *
     * @access private
     */
  }, {
    key: 'updateScrollTop',
    value: function updateScrollTop() {
      if (this.independentMinimapScroll) {
        this.setScrollTop(this.getScrollTopFromEditor());
        this.emitter.emit('did-change-scroll-top', this);
      }
    }

    /**
     * Returns the scroll top as computed from the text editor scroll top.
     *
     * @return {number} the computed scroll top value
     */
  }, {
    key: 'getScrollTopFromEditor',
    value: function getScrollTopFromEditor() {
      return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
    }

    /**
     * Returns the maximum scroll value of the Minimap.
     *
     * @return {number} the maximum scroll top for the Minimap
     */
  }, {
    key: 'getMaxScrollTop',
    value: function getMaxScrollTop() {
      return Math.max(0, this.getHeight() - this.getScreenHeight());
    }

    /**
     * Returns `true` when the Minimap can scroll.
     *
     * @return {boolean} whether this Minimap can scroll or not
     */
  }, {
    key: 'canScroll',
    value: function canScroll() {
      return this.getMaxScrollTop() > 0;
    }

    /**
     * Updates the minimap scroll top value using a mouse event when the
     * independent scrolling mode is enabled
     *
     * @param  {MouseEvent} event the mouse wheel event
     * @access private
     */
  }, {
    key: 'onMouseWheel',
    value: function onMouseWheel(event) {
      if (!this.canScroll()) {
        return;
      }

      var wheelDeltaY = event.wheelDeltaY;

      var previousScrollTop = this.getScrollTop();
      var updatedScrollTop = previousScrollTop - Math.round(wheelDeltaY * this.scrollSensitivity);

      event.preventDefault();
      this.setScrollTop(updatedScrollTop);
    }

    /**
     * Delegates to `TextEditor#getMarker`.
     *
     * @access private
     */
  }, {
    key: 'getMarker',
    value: function getMarker(id) {
      return this.textEditor.getMarker(id);
    }

    /**
     * Delegates to `TextEditor#findMarkers`.
     *
     * @access private
     */
  }, {
    key: 'findMarkers',
    value: function findMarkers(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (error) {
        return [];
      }
    }

    /**
     * Delegates to `TextEditor#markBufferRange`.
     *
     * @access private
     */
  }, {
    key: 'markBufferRange',
    value: function markBufferRange(range) {
      return this.textEditor.markBufferRange(range);
    }

    /**
     * Emits a change events with the passed-in changes as data.
     *
     * @param  {Object} changes a change to dispatch
     * @access private
     */
  }, {
    key: 'emitChanges',
    value: function emitChanges(changes) {
      this.emitter.emit('did-change', changes);
    }

    /**
     * Enables the cache at the adapter level to avoid consecutive access to the
     * text editor API during a render phase.
     *
     * @access private
     */
  }, {
    key: 'enableCache',
    value: function enableCache() {
      this.adapter.enableCache();
    }

    /**
     * Disable the adapter cache.
     *
     * @access private
     */
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.adapter.clearCache();
    }
  }]);

  var _Minimap = Minimap;
  Minimap = (0, _decoratorsInclude2['default'])(_mixinsDecorationManagement2['default'])(Minimap) || Minimap;
  return Minimap;
})();

exports['default'] = Minimap;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9TYXJnb24vLmF0b20vcGFja2FnZXMvbWluaW1hcC9saWIvbWluaW1hcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUUyQyxNQUFNOztpQ0FDN0Isc0JBQXNCOzs7OzBDQUNULGdDQUFnQzs7OztxQ0FDeEMsMkJBQTJCOzs7O3FDQUMxQiwyQkFBMkI7Ozs7QUFOckQsV0FBVyxDQUFBOztBQVFYLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQTs7Ozs7Ozs7Ozs7SUFXRSxPQUFPOzs7Ozs7Ozs7Ozs7OztBQWFkLFdBYk8sT0FBTyxHQWFDOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7Ozs7QUFDdkIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDdkIsWUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO0tBQzdEOzs7Ozs7OztBQVFELFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQTs7Ozs7OztBQU9wQyxRQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUE7Ozs7Ozs7QUFPcEMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFBOzs7Ozs7O0FBTzFCLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTs7Ozs7OztBQU81QixRQUFJLENBQUMsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFBOzs7Ozs7O0FBT3ZCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7Ozs7OztBQU81QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOzs7Ozs7Ozs7QUFTOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7Ozs7Ozs7O0FBUW5CLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBOzs7Ozs7OztBQVF0QixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFBOzs7Ozs7OztBQVE1QixRQUFJLENBQUMs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LEVBQUUsQ0FBQTtBQUM3QyxVQUFNLGdCQUFnQixHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBOztBQUU3RixXQUFLLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0tBQ3BDOzs7Ozs7Ozs7V0FPUyxtQkFBQyxFQUFFLEVBQUU7QUFBRSxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQUU7Ozs7Ozs7OztXQU8zQyxxQkFBQyxDQUFDLEVBQUU7QUFDZCxVQUFJO0FBQ0YsZUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUN0QyxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsZUFBTyxFQUFFLENBQUE7T0FDVjtLQUNGOzs7Ozs7Ozs7V0FPZSx5QkFBQyxLQUFLLEVBQUU7QUFBRSxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQUU7Ozs7Ozs7Ozs7V0FRN0QscUJBQUMsT0FBTyxFQUFFO0FBQUUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0tBQUU7Ozs7Ozs7Ozs7V0FRdEQsdUJBQUc7QUFBRSxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFBO0tBQUU7Ozs7Ozs7OztXQU9sQyxzQkFBRztBQUFFLFVBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUE7S0FBRTs7O2lCQXQ1QnhCLE9BQU87QUFBUCxTQUFPLEdBRDNCLDRFQUE2QixDQUNULE9BQU8sS0FBUCxPQUFPO1NBQVAsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taW5pbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGluY2x1ZGUgZnJvbSAnLi9kZWNvcmF0b3JzL2luY2x1ZGUnXG5pbXBvcnQgRGVjb3JhdGlvbk1hbmFnZW1lbnQgZnJvbSAnLi9taXhpbnMvZGVjb3JhdGlvbi1tYW5hZ2VtZW50J1xuaW1wb3J0IExlZ2FjeUFkYXRlciBmcm9tICcuL2FkYXB0ZXJzL2xlZ2FjeS1hZGFwdGVyJ1xuaW1wb3J0IFN0YWJsZUFkYXB0ZXIgZnJvbSAnLi9hZGFwdGVycy9zdGFibGUtYWRhcHRlcidcblxubGV0IG5leHRNb2RlbElkID0gMVxuXG4vKipcbiAqIFRoZSBNaW5pbWFwIGNsYXNzIGlzIHRoZSB1bmRlcmx5aW5nIG1vZGVsIG9mIGEgPE1pbmltYXBFbGVtZW50Pi5cbiAqIE1vc3QgbWFuaXB1bGF0aW9ucyBvZiB0aGUgbWluaW1hcCBpcyBkb25lIHRocm91Z2ggdGhlIG1vZGVsLlxuICpcbiAqIEFueSBNaW5pbWFwIGluc3RhbmNlIGlzIHRpZWQgdG8gYSBgVGV4dEVkaXRvcmAuXG4gKiBUaGVpciBsaWZlY3ljbGUgZm9sbG93IHRoZSBvbmUgb2YgdGhlaXIgdGFyZ2V0IGBUZXh0RWRpdG9yYCwgc28gdGhleSBhcmVcbiAqIGRlc3Ryb3llZCB3aGVuZXZlciB0aGVpciBgVGV4dEVkaXRvcmAgaXMgZGVzdHJveWVkLlxuICovXG5AaW5jbHVkZShEZWNvcmF0aW9uTWFuYWdlbWVudClcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pbmltYXAge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBNaW5pbWFwIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYFRleHRFZGl0b3JgLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgYW4gb2JqZWN0IHdpdGggdGhlIG5ldyBNaW5pbWFwIHByb3BlcnRpZXNcbiAgICogQHBhcmFtICB7VGV4dEVkaXRvcn0gb3B0aW9ucy50ZXh0RWRpdG9yIHRoZSB0YXJnZXQgdGV4dCBlZGl0b3IgZm9yXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgbWluaW1hcFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBbb3B0aW9ucy5zdGFuZEFsb25lXSB3aGV0aGVyIHRoaXMgbWluaW1hcCBpcyBpblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFuZC1hbG9uZSBtb2RlIG9yIG5vdFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtvcHRpb25zLndpZHRoXSB0aGUgbWluaW1hcCB3aWR0aCBpbiBwaXhlbHNcbiAgICogQHBhcmFtICB7bnVtYmVyfSBbb3B0aW9ucy5oZWlnaHRdIHRoZSBtaW5pbWFwIGhlaWdodCBpbiBwaXhlbHNcbiAgICogQHRocm93cyB7RXJyb3J9IENhbm5vdCBjcmVhdGUgYSBtaW5pbWFwIHdpdGhvdXQgYW4gZWRpdG9yXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFvcHRpb25zLnRleHRFZGl0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG1pbmltYXAgd2l0aG91dCBhbiBlZGl0b3InKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBNaW5pbWFwJ3MgdGV4dCBlZGl0b3IuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7VGV4dEVkaXRvcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnRleHRFZGl0b3IgPSBvcHRpb25zLnRleHRFZGl0b3JcbiAgICAvKipcbiAgICAgKiBUaGUgc3RhbmQtYWxvbmUgc3RhdGUgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc3RhbmRBbG9uZSA9IG9wdGlvbnMuc3RhbmRBbG9uZVxuICAgIC8qKlxuICAgICAqIFRoZSB3aWR0aCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aFxuICAgIC8qKlxuICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIGN1cnJlbnQgTWluaW1hcC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmlkID0gbmV4dE1vZGVsSWQrK1xuICAgIC8qKlxuICAgICAqIFRoZSBldmVudHMgZW1pdHRlciBvZiB0aGUgY3VycmVudCBNaW5pbWFwLlxuICAgICAqXG4gICAgICogQHR5cGUge0VtaXR0ZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIC8qKlxuICAgICAqIFRoZSBNaW5pbWFwJ3Mgc3Vic2NyaXB0aW9ucy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtDb21wb3NpdGVEaXNwb3NhYmxlfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAvKipcbiAgICAgKiBUaGUgYWRhcHRlciBvYmplY3QgbGV2ZXJhZ2UgdGhlIGFjY2VzcyB0byBzZXZlcmFsIHByb3BlcnRpZXMgZnJvbVxuICAgICAqIHRoZSBgVGV4dEVkaXRvcmAvYFRleHRFZGl0b3JFbGVtZW50YCB0byBzdXBwb3J0IHRoZSBkaWZmZXJlbnQgQVBJc1xuICAgICAqIGJldHdlZW4gZGlmZmVyZW50IHZlcnNpb24gb2YgQXRvbS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5hZGFwdGVyID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIGhlaWdodCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlIGB1bmRlZmluZWRgIHVubGVzc1xuICAgICAqIGBzZXRDaGFyV2lkdGhgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jaGFySGVpZ2h0ID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFyIGhlaWdodCBmcm9tIHRoZSBwYWNrYWdlJ3MgY29uZmlndXJhdGlvbi4gV2lsbCBiZSBvdmVycmlkZW5cbiAgICAgKiBieSB0aGUgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuY29uZmlnQ2hhckhlaWdodCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgY2hhciB3aWR0aCBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlIGB1bmRlZmluZWRgIHVubGVzc1xuICAgICAqIGBzZXRDaGFyV2lkdGhgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jaGFyV2lkdGggPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGNoYXIgd2lkdGggZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uIFdpbGwgYmUgb3ZlcnJpZGVuXG4gICAgICogYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZ0NoYXJXaWR0aCA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJsaW5lIG9mIHRoZSBjdXJyZW50IE1pbmltYXAsIHdpbGwgYmUgYHVuZGVmaW5lZGAgdW5sZXNzXG4gICAgICogYHNldENoYXJXaWR0aGAgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmludGVybGluZSA9IG51bGxcbiAgICAvKipcbiAgICAgKiBUaGUgaW50ZXJsaW5lIGZyb20gdGhlIHBhY2thZ2UncyBjb25maWd1cmF0aW9uLiBXaWxsIGJlIG92ZXJyaWRlblxuICAgICAqIGJ5IHRoZSBpbnN0YW5jZSB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdJbnRlcmxpbmUgPSBudWxsXG4gICAgLyoqXG4gICAgICogVGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBvZiB0aGUgY3VycmVudCBNaW5pbWFwLCB3aWxsIGJlXG4gICAgICogYHVuZGVmaW5lZGAgdW5sZXNzIGBzZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdgIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gbnVsbFxuICAgIC8qKlxuICAgICAqIFRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgZnJvbSB0aGUgcGFja2FnZSdzIGNvbmZpZ3VyYXRpb24uXG4gICAgICogV2lsbCBiZSBvdmVycmlkZW4gYnkgdGhlIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5jb25maWdEZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgPSBudWxsXG4gICAgLyoqXG4gICAgLyoqXG4gICAgICogQSBib29sZWFuIHZhbHVlIHRvIHN0b3JlIHdoZXRoZXIgdGhpcyBNaW5pbWFwIGhhdmUgYmVlbiBkZXN0cm95ZWQgb3Igbm90LlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZVxuICAgIC8qKlxuICAgICAqIEEgYm9vbGVhbiB2YWx1ZSB0byBzdG9yZSB3aGV0aGVyIHRoZSBgc2Nyb2xsUGFzdEVuZGAgc2V0dGluZyBpcyBlbmFibGVkXG4gICAgICogb3Igbm90LlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zY3JvbGxQYXN0RW5kID0gZmFsc2VcblxuICAgIHRoaXMuaW5pdGlhbGl6ZURlY29yYXRpb25zKClcblxuICAgIGlmIChhdG9tLnZpZXdzLmdldFZpZXcodGhpcy50ZXh0RWRpdG9yKS5nZXRTY3JvbGxUb3AgIT0gbnVsbCkge1xuICAgICAgdGhpcy5hZGFwdGVyID0gbmV3IFN0YWJsZUFkYXB0ZXIodGhpcy50ZXh0RWRpdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgTGVnYWN5QWRhdGVyKHRoaXMudGV4dEVkaXRvcilcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGluIHN0YW5kLWFsb25lIG9yIGluZGVwZW5kZW50IHNjcm9sbGluZyBtb2RlLCB0aGlzIHZhbHVlIGNhbiBiZSB1c2VkXG4gICAgICogaW5zdGVhZCBvZiB0aGUgY29tcHV0ZWQgc2Nyb2xsLlxuICAgICAqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnNjcm9sbFRvcCA9IDBcblxuICAgIGNvbnN0IHN1YnMgPSB0aGlzLnN1YnNjcmlwdGlvbnNcbiAgICBsZXQgY29uZmlnU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUb0NvbmZpZygpXG5cbiAgICBzdWJzLmFkZChjb25maWdTdWJzY3JpcHRpb24pXG5cbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyKCgpID0+IHtcbiAgICAgIHN1YnMucmVtb3ZlKGNvbmZpZ1N1YnNjcmlwdGlvbilcbiAgICAgIGNvbmZpZ1N1YnNjcmlwdGlvbi5kaXNwb3NlKClcblxuICAgICAgY29uZmlnU3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmVUb0NvbmZpZygpXG4gICAgICBzdWJzLmFkZChjb25maWdTdWJzY3JpcHRpb24pXG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZCh0aGlzLmFkYXB0ZXIub25EaWRDaGFuZ2VTY3JvbGxUb3AoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnN0YW5kQWxvbmUgJiYgIXRoaXMuaWdub3JlVGV4dEVkaXRvclNjcm9sbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCB0aGlzKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pZ25vcmVUZXh0RWRpdG9yU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuaWdub3JlVGV4dEVkaXRvclNjcm9sbCA9IGZhbHNlXG4gICAgICB9XG4gICAgfSkpXG4gICAgc3Vicy5hZGQodGhpcy5hZGFwdGVyLm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhbmRBbG9uZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtbGVmdCcsIHRoaXMpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2UoKGNoYW5nZXMpID0+IHtcbiAgICAgIHRoaXMuZW1pdENoYW5nZXMoY2hhbmdlcylcbiAgICB9KSlcbiAgICBzdWJzLmFkZCh0aGlzLnRleHRFZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHsgdGhpcy5kZXN0cm95KCkgfSkpXG5cbiAgICAvKlxuICAgIEZJWE1FIFNvbWUgY2hhbmdlcyBvY2N1cmluZyBkdXJpbmcgdGhlIHRva2VuaXphdGlvbiBwcm9kdWNlc1xuICAgIHJhbmdlcyB0aGF0IGRlY2VpdmUgdGhlIGNhbnZhcyByZW5kZXJpbmcgYnkgbWFraW5nIHNvbWVcbiAgICBsaW5lcyBhdCB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaW50YWN0IHdoaWxlIHRoZXkgYXJlIGluIGZhY3Qgbm90LFxuICAgIHJlc3VsdGluZyBpbiBleHRyYSBsaW5lcyBhcHBlYXJpbmcgYXQgdGhlIGVuZCBvZiB0aGUgbWluaW1hcC5cbiAgICBGb3JjaW5nIGEgd2hvbGUgcmVwYWludCB0byBmaXggdGhhdCBidWcgaXMgc3Vib3B0aW1hbCBidXQgd29ya3MuXG4gICAgKi9cbiAgICBjb25zdCB0b2tlbml6ZWRCdWZmZXIgPSB0aGlzLnRleHRFZGl0b3IudG9rZW5pemVkQnVmZmVyXG4gICAgICA/IHRoaXMudGV4dEVkaXRvci50b2tlbml6ZWRCdWZmZXJcbiAgICAgIDogdGhpcy50ZXh0RWRpdG9yLmRpc3BsYXlCdWZmZXIudG9rZW5pemVkQnVmZmVyXG5cbiAgICBzdWJzLmFkZCh0b2tlbml6ZWRCdWZmZXIub25EaWRUb2tlbml6ZSgoKSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBtb2RlbC5cbiAgICovXG4gIGRlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5yZW1vdmVBbGxEZWNvcmF0aW9ucygpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGxcbiAgICB0aGlzLnRleHRFZGl0b3IgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aGlzIGBNaW5pbWFwYCBoYXMgYmVubiBkZXN0cm95ZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhpcyBNaW5pbWFwIGhhcyBiZWVuIGRlc3Ryb3llZCBvciBub3RcbiAgICovXG4gIGlzRGVzdHJveWVkICgpIHsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWNoYW5nZWAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggYW4gZXZlbnQgb2JqZWN0IHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqIC0gc3RhcnQ6IFRoZSBjaGFuZ2UncyBzdGFydCByb3cgbnVtYmVyXG4gICAqIC0gZW5kOiBUaGUgY2hhbmdlJ3MgZW5kIHJvdyBudW1iZXJcbiAgICogLSBzY3JlZW5EZWx0YTogdGhlIGRlbHRhIGluIGJ1ZmZlciByb3dzIGJldHdlZW4gdGhlIHZlcnNpb25zIGJlZm9yZSBhbmRcbiAgICogICBhZnRlciB0aGUgY2hhbmdlXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLWNvbmZpZ2AgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50XG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgdHJpZ2dlcmVkLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZUNvbmZpZyAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWNvbmZpZycsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1jaGFuZ2Utc2Nyb2xsLXRvcGAgZXZlbnQuXG4gICAqXG4gICAqIFRoZSBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhlIHRleHQgZWRpdG9yIGBzY3JvbGxUb3BgIHZhbHVlIGhhdmUgYmVlblxuICAgKiBjaGFuZ2VkIG9yIHdoZW4gdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCBoYXZlIGJlZW4gY2hhbmdlZCBpbiBzdGFuZC1hbG9uZVxuICAgKiBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbihtaW5pbWFwOk1pbmltYXApOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBNaW5pbWFwIGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGFyZ3VtZW50IHRvXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZENoYW5nZVNjcm9sbFRvcCAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXNjcm9sbC1sZWZ0YCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24obWluaW1hcDpNaW5pbWFwKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGN1cnJlbnQgTWluaW1hcCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhcmd1bWVudCB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjay5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRDaGFuZ2VTY3JvbGxMZWZ0IChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc2Nyb2xsLWxlZnQnLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLXN0YW5kLWFsb25lYCBldmVudC5cbiAgICpcbiAgICogVGhpcyBldmVudCBpcyBkaXNwYXRjaGVkIHdoZW4gdGhlIHN0YW5kLWFsb25lIG9mIHRoZSBjdXJyZW50IE1pbmltYXBcbiAgICogaXMgZWl0aGVyIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKG1pbmltYXA6TWluaW1hcCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IE1pbmltYXAgaXNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZWQgYXMgYXJndW1lbnQgdG9cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlU3RhbmRBbG9uZSAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXN0YW5kLWFsb25lJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWRlc3Ryb3lgIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIGRpc3BhdGNoZWQgd2hlbiB0aGlzIE1pbmltYXAgaGF2ZSBiZWVuIGRlc3Ryb3llZC4gSXQgY2FuXG4gICAqIG9jY3VycyBlaXRoZXIgYmVjYXVzZSB0aGUge0BsaW5rIGRlc3Ryb3l9IG1ldGhvZCBoYXZlIGJlZW4gY2FsbGVkIG9uIHRoZVxuICAgKiBNaW5pbWFwIG9yIGJlY2F1c2UgdGhlIHRhcmdldCB0ZXh0IGVkaXRvciBoYXZlIGJlZW4gZGVzdHJveWVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbigpOnZvaWR9IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBldmVudFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIHRyaWdnZXJlZC5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWREZXN0cm95IChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIHRvIHRoZSBjb25maWcgY2hhbmdlcyBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yIHNjb3BlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSB0aGUgZGlzcG9zYWJsZSB0byBkaXNwb3NlIGFsbCB0aGUgcmVnaXN0ZXJlZCBldmVudHNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBzdWJzY3JpYmVUb0NvbmZpZyAoKSB7XG4gICAgY29uc3Qgc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBjb25zdCBvcHRzID0ge3Njb3BlOiB0aGlzLnRleHRFZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpfVxuXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnZWRpdG9yLnNjcm9sbFBhc3RFbmQnLCBvcHRzLCAoc2Nyb2xsUGFzdEVuZCkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxQYXN0RW5kID0gc2Nyb2xsUGFzdEVuZFxuICAgICAgdGhpcy5hZGFwdGVyLnNjcm9sbFBhc3RFbmQgPSB0aGlzLnNjcm9sbFBhc3RFbmRcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5jaGFySGVpZ2h0Jywgb3B0cywgKGNvbmZpZ0NoYXJIZWlnaHQpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnQ2hhckhlaWdodCA9IGNvbmZpZ0NoYXJIZWlnaHRcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbmZpZycpXG4gICAgfSkpXG4gICAgc3Vicy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbWluaW1hcC5jaGFyV2lkdGgnLCBvcHRzLCAoY29uZmlnQ2hhcldpZHRoKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ0NoYXJXaWR0aCA9IGNvbmZpZ0NoYXJXaWR0aFxuICAgICAgdGhpcy51cGRhdGVTY3JvbGxUb3AoKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLmludGVybGluZScsIG9wdHMsIChjb25maWdJbnRlcmxpbmUpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnSW50ZXJsaW5lID0gY29uZmlnSW50ZXJsaW5lXG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbFRvcCgpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICAgIH0pKVxuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ21pbmltYXAuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsJywgb3B0cywgKGluZGVwZW5kZW50TWluaW1hcFNjcm9sbCkgPT4ge1xuICAgICAgdGhpcy5pbmRlcGVuZGVudE1pbmltYXBTY3JvbGwgPSBpbmRlcGVuZGVudE1pbmltYXBTY3JvbGxcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICB9KSlcbiAgICBzdWJzLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdtaW5pbWFwLnNjcm9sbFNlbnNpdGl2aXR5Jywgb3B0cywgKHNjcm9sbFNlbnNpdGl2aXR5KSA9PiB7XG4gICAgICB0aGlzLnNjcm9sbFNlbnNpdGl2aXR5ID0gc2Nyb2xsU2Vuc2l0aXZpdHlcbiAgICB9KSlcbiAgICAvLyBjZHByciBpcyBzaG9ydGhhbmQgZm9yIGNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgIHN1YnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbWluaW1hcC5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcnLFxuICAgICAgb3B0cyxcbiAgICAgIChjZHBycikgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpZ0RldmljZVBpeGVsUmF0aW9Sb3VuZGluZyA9IGNkcHJyXG4gICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgICAgIH1cbiAgICApKVxuXG4gICAgcmV0dXJuIHN1YnNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCB3aGVuIHRoZSBjdXJyZW50IE1pbmltYXAgaXMgYSBzdGFuZC1hbG9uZSBtaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB3aGV0aGVyIHRoaXMgTWluaW1hcCBpcyBpbiBzdGFuZC1hbG9uZSBtb2RlIG9yIG5vdC5cbiAgICovXG4gIGlzU3RhbmRBbG9uZSAoKSB7IHJldHVybiB0aGlzLnN0YW5kQWxvbmUgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGZvciB0aGlzIG1pbmltYXAuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3RhbmRBbG9uZSB0aGUgbmV3IHN0YXRlIG9mIHRoZSBzdGFuZC1hbG9uZSBtb2RlIGZvciB0aGlzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1zdGFuZC1hbG9uZX0gaWYgdGhlIHN0YW5kLWFsb25lIG1vZGUgaGF2ZSBiZWVuIHRvZ2dsZWRcbiAgICogICAgICAgIG9uIG9yIG9mZiBieSB0aGUgY2FsbFxuICAgKi9cbiAgc2V0U3RhbmRBbG9uZSAoc3RhbmRBbG9uZSkge1xuICAgIGlmIChzdGFuZEFsb25lICE9PSB0aGlzLnN0YW5kQWxvbmUpIHtcbiAgICAgIHRoaXMuc3RhbmRBbG9uZSA9IHN0YW5kQWxvbmVcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXN0YW5kLWFsb25lJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHRoYXQgdGhpcyBtaW5pbWFwIHJlcHJlc2VudHMuXG4gICAqXG4gICAqIEByZXR1cm4ge1RleHRFZGl0b3J9IHRoaXMgTWluaW1hcCdzIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yICgpIHsgcmV0dXJuIHRoaXMudGV4dEVkaXRvciB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGhlaWdodCBvZiB0aGUgYFRleHRFZGl0b3JgIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgaGVpZ2h0IG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZEhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRIZWlnaHQoKSAqIHRoaXMuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCB0b3AgdmFsdWUgYXQgdGhlIE1pbmltYXAgc2NhbGUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjYWxlZCBzY3JvbGwgdG9wIG9mIHRoZSB0ZXh0IGVkaXRvclxuICAgKi9cbiAgZ2V0VGV4dEVkaXRvclNjYWxlZFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxUb3AoKSAqIHRoaXMuZ2V0VmVydGljYWxTY2FsZUZhY3RvcigpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBsZWZ0IHZhbHVlIGF0IHRoZSBNaW5pbWFwIHNjYWxlLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY2FsZWQgc2Nyb2xsIGxlZnQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2NhbGVkU2Nyb2xsTGVmdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxMZWZ0KCkgKiB0aGlzLmdldEhvcml6b250YWxTY2FsZUZhY3RvcigpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIG1heGltdW0gc2Nyb2xsIHRvcCB2YWx1ZS5cbiAgICpcbiAgICogV2hlbiB0aGUgYHNjcm9sbFBhc3RFbmRgIHNldHRpbmcgaXMgZW5hYmxlZCwgdGhlIG1ldGhvZCBjb21wZW5zYXRlIHRoZVxuICAgKiBleHRyYSBzY3JvbGwgYnkgcmVtb3ZpbmcgdGhlIHNhbWUgaGVpZ2h0IGFzIGFkZGVkIGJ5IHRoZSBlZGl0b3IgZnJvbSB0aGVcbiAgICogZmluYWwgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG1heGltdW0gc2Nyb2xsIHRvcCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldE1heFNjcm9sbFRvcCgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCB0b3AgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCB0b3Agb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsVG9wICgpIHsgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxUb3AoKSB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNjcm9sbCB0b3Agb2YgdGhlIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNjcm9sbFRvcCB0aGUgbmV3IHNjcm9sbCB0b3AgdmFsdWVcbiAgICovXG4gIHNldFRleHRFZGl0b3JTY3JvbGxUb3AgKHNjcm9sbFRvcCwgaWdub3JlVGV4dEVkaXRvclNjcm9sbCA9IGZhbHNlKSB7XG4gICAgdGhpcy5pZ25vcmVUZXh0RWRpdG9yU2Nyb2xsID0gaWdub3JlVGV4dEVkaXRvclNjcm9sbFxuICAgIHRoaXMuYWRhcHRlci5zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgbGVmdCB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIGxlZnQgb2YgdGhlIHRleHQgZWRpdG9yXG4gICAqL1xuICBnZXRUZXh0RWRpdG9yU2Nyb2xsTGVmdCAoKSB7IHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0U2Nyb2xsTGVmdCgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSBgVGV4dEVkaXRvcmAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGhlaWdodCBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JIZWlnaHQgKCkgeyByZXR1cm4gdGhpcy5hZGFwdGVyLmdldEhlaWdodCgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYFRleHRFZGl0b3JgIHNjcm9sbCBhcyBhIHZhbHVlIG5vcm1hbGl6ZWQgYmV0d2VlbiBgMGAgYW5kIGAxYC5cbiAgICpcbiAgICogV2hlbiB0aGUgYHNjcm9sbFBhc3RFbmRgIHNldHRpbmcgaXMgZW5hYmxlZCB0aGUgdmFsdWUgbWF5IGV4Y2VlZCBgMWAgYXMgdGhlXG4gICAqIG1heGltdW0gc2Nyb2xsIHZhbHVlIHVzZWQgdG8gY29tcHV0ZSB0aGlzIHJhdGlvIGNvbXBlbnNhdGUgZm9yIHRoZSBleHRyYVxuICAgKiBoZWlnaHQgaW4gdGhlIGVkaXRvci4gKipVc2Uge0BsaW5rIGdldENhcGVkVGV4dEVkaXRvclNjcm9sbFJhdGlvfSB3aGVuXG4gICAqIHlvdSBuZWVkIGEgdmFsdWUgdGhhdCBpcyBzdHJpY3RseSBiZXR3ZWVuIGAwYCBhbmQgYDFgLioqXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHNjcm9sbCByYXRpbyBvZiB0aGUgdGV4dCBlZGl0b3JcbiAgICovXG4gIGdldFRleHRFZGl0b3JTY3JvbGxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5nZXRTY3JvbGxUb3AoKSAvICh0aGlzLmdldFRleHRFZGl0b3JNYXhTY3JvbGxUb3AoKSB8fCAxKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGBUZXh0RWRpdG9yYCBzY3JvbGwgYXMgYSB2YWx1ZSBub3JtYWxpemVkIGJldHdlZW4gYDBgIGFuZCBgMWAuXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBzdHJpY3RseSBiZXR3ZWVuIGAwYCBhbmQgYDFgLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBzY3JvbGwgcmF0aW8gb2YgdGhlIHRleHQgZWRpdG9yIHN0cmljdGx5IGJldHdlZW5cbiAgICogICAgICAgICAgICAgICAgICAwIGFuZCAxXG4gICAqL1xuICBnZXRDYXBlZFRleHRFZGl0b3JTY3JvbGxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKDEsIHRoaXMuZ2V0VGV4dEVkaXRvclNjcm9sbFJhdGlvKCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IG9mIHRoZSB3aG9sZSBtaW5pbWFwIGluIHBpeGVscyBiYXNlZCBvbiB0aGUgYG1pbmltYXBgXG4gICAqIHNldHRpbmdzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBoZWlnaHQgb2YgdGhlIG1pbmltYXBcbiAgICovXG4gIGdldEhlaWdodCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRTY3JlZW5MaW5lQ291bnQoKSAqIHRoaXMuZ2V0TGluZUhlaWdodCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIHdob2xlIG1pbmltYXAgaW4gcGl4ZWxzIGJhc2VkIG9uIHRoZSBgbWluaW1hcGBcbiAgICogc2V0dGluZ3MuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHdpZHRoIG9mIHRoZSBtaW5pbWFwXG4gICAqL1xuICBnZXRXaWR0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5nZXRNYXhTY3JlZW5MaW5lTGVuZ3RoKCkgKiB0aGlzLmdldENoYXJXaWR0aCgpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IHRoZSBNaW5pbWFwIGNvbnRlbnQgd2lsbCB0YWtlIG9uIHNjcmVlbi5cbiAgICpcbiAgICogV2hlbiB0aGUgTWluaW1hcCBoZWlnaHQgaXMgZ3JlYXRlciB0aGFuIHRoZSBgVGV4dEVkaXRvcmAgaGVpZ2h0LCB0aGVcbiAgICogYFRleHRFZGl0b3JgIGhlaWdodCBpcyByZXR1cm5lZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSB2aXNpYmxlIGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0VmlzaWJsZUhlaWdodCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuZ2V0U2NyZWVuSGVpZ2h0KCksIHRoaXMuZ2V0SGVpZ2h0KCkpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaGVpZ2h0IHRoZSBtaW5pbWFwIHNob3VsZCB0YWtlIG9uY2UgZGlzcGxheWVkLCBpdCdzIGVpdGhlclxuICAgKiB0aGUgaGVpZ2h0IG9mIHRoZSBgVGV4dEVkaXRvcmAgb3IgdGhlIHByb3ZpZGVkIGBoZWlnaHRgIHdoZW4gaW4gc3RhbmQtYWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRTY3JlZW5IZWlnaHQgKCkge1xuICAgIGlmICh0aGlzLmlzU3RhbmRBbG9uZSgpKSB7XG4gICAgICBpZiAodGhpcy5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEhlaWdodCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmFkYXB0ZXIuZ2V0SGVpZ2h0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggdGhlIHdob2xlIE1pbmltYXAgd2lsbCB0YWtlIG9uIHNjcmVlbi5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgd2lkdGggb2YgdGhlIE1pbmltYXAgd2hlbiBkaXNwbGF5ZWRcbiAgICovXG4gIGdldFZpc2libGVXaWR0aCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWluKHRoaXMuZ2V0U2NyZWVuV2lkdGgoKSwgdGhpcy5nZXRXaWR0aCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdpZHRoIHRoZSBNaW5pbWFwIHNob3VsZCB0YWtlIG9uY2UgZGlzcGxheWVkLCBpdCdzIGVpdGhlciB0aGVcbiAgICogd2lkdGggb2YgdGhlIE1pbmltYXAgY29udGVudCBvciB0aGUgcHJvdmlkZWQgYHdpZHRoYCB3aGVuIGluIHN0YW5kQWxvbmVcbiAgICogbW9kZS5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgTWluaW1hcCBzY3JlZW4gd2lkdGhcbiAgICovXG4gIGdldFNjcmVlbldpZHRoICgpIHtcbiAgICBpZiAodGhpcy5pc1N0YW5kQWxvbmUoKSAmJiB0aGlzLndpZHRoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLndpZHRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFdpZHRoKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcHJlZmVycmVkIGhlaWdodCBhbmQgd2lkdGggd2hlbiBpbiBzdGFuZC1hbG9uZSBtb2RlLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIDxNaW5pbWFwRWxlbWVudD4gZm9yIHRoaXMgTWluaW1hcCBzbyB0aGF0XG4gICAqIHRoZSBtb2RlbCBpcyBrZXB0IGluIHN5bmMgd2l0aCB0aGUgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCB0aGUgbmV3IGhlaWdodCBvZiB0aGUgTWluaW1hcFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggdGhlIG5ldyB3aWR0aCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgc2V0U2NyZWVuSGVpZ2h0QW5kV2lkdGggKGhlaWdodCwgd2lkdGgpIHtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgIHRoaXMudXBkYXRlU2Nyb2xsVG9wKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2ZXJ0aWNhbCBzY2FsaW5nIGZhY3RvciB3aGVuIGNvbnZlcnRpbmcgY29vcmRpbmF0ZXMgZnJvbSB0aGVcbiAgICogYFRleHRFZGl0b3JgIHRvIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBNaW5pbWFwIHZlcnRpY2FsIHNjYWxpbmcgZmFjdG9yXG4gICAqL1xuICBnZXRWZXJ0aWNhbFNjYWxlRmFjdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMaW5lSGVpZ2h0KCkgLyB0aGlzLnRleHRFZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBob3Jpem9udGFsIHNjYWxpbmcgZmFjdG9yIHdoZW4gY29udmVydGluZyBjb29yZGluYXRlcyBmcm9tIHRoZVxuICAgKiBgVGV4dEVkaXRvcmAgdG8gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIE1pbmltYXAgaG9yaXpvbnRhbCBzY2FsaW5nIGZhY3RvclxuICAgKi9cbiAgZ2V0SG9yaXpvbnRhbFNjYWxlRmFjdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDaGFyV2lkdGgoKSAvIHRoaXMudGV4dEVkaXRvci5nZXREZWZhdWx0Q2hhcldpZHRoKClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgYSBsaW5lIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSBhIGxpbmUncyBoZWlnaHQgaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldExpbmVIZWlnaHQgKCkgeyByZXR1cm4gdGhpcy5nZXRDaGFySGVpZ2h0KCkgKyB0aGlzLmdldEludGVybGluZSgpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgd2lkdGggb2YgYSBjaGFyYWN0ZXIgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGEgY2hhcmFjdGVyJ3Mgd2lkdGggaW4gdGhlIE1pbmltYXBcbiAgICovXG4gIGdldENoYXJXaWR0aCAoKSB7XG4gICAgaWYgKHRoaXMuY2hhcldpZHRoICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJXaWR0aFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25maWdDaGFyV2lkdGhcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2hhciB3aWR0aCBmb3IgdGhpcyBNaW5pbWFwLiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlXG4gICAqIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2BcbiAgICogZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNoYXJXaWR0aCB0aGUgbmV3IHdpZHRoIG9mIGEgY2hhciBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXRDaGFyV2lkdGggKGNoYXJXaWR0aCkge1xuICAgIHRoaXMuY2hhcldpZHRoID0gTWF0aC5mbG9vcihjaGFyV2lkdGgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgYSBjaGFyYWN0ZXIgaW4gdGhlIE1pbmltYXAgaW4gcGl4ZWxzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IGEgY2hhcmFjdGVyJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRDaGFySGVpZ2h0ICgpIHtcbiAgICBpZiAodGhpcy5jaGFySGVpZ2h0ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJIZWlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnQ2hhckhlaWdodFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjaGFyIGhlaWdodCBmb3IgdGhpcyBNaW5pbWFwLiBUaGlzIHZhbHVlIHdpbGwgb3ZlcnJpZGUgdGhlXG4gICAqIHZhbHVlIGZyb20gdGhlIGNvbmZpZyBmb3IgdGhpcyBpbnN0YW5jZSBvbmx5LiBBIGBkaWQtY2hhbmdlLWNvbmZpZ2BcbiAgICogZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNoYXJIZWlnaHQgdGhlIG5ldyBoZWlnaHQgb2YgYSBjaGFyIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldENoYXJIZWlnaHQgKGNoYXJIZWlnaHQpIHtcbiAgICB0aGlzLmNoYXJIZWlnaHQgPSBNYXRoLmZsb29yKGNoYXJIZWlnaHQpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgYW4gaW50ZXJsaW5lIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgaW50ZXJsaW5lJ3MgaGVpZ2h0IGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXRJbnRlcmxpbmUgKCkge1xuICAgIGlmICh0aGlzLmludGVybGluZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcmxpbmVcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnSW50ZXJsaW5lXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGludGVybGluZSBoZWlnaHQgZm9yIHRoaXMgTWluaW1hcC4gVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZVxuICAgKiB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS4gQSBgZGlkLWNoYW5nZS1jb25maWdgXG4gICAqIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcmxpbmUgdGhlIG5ldyBoZWlnaHQgb2YgYW4gaW50ZXJsaW5lIGluIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1jb25maWd9IHdoZW4gdGhlIHZhbHVlIGlzIGNoYW5nZWRcbiAgICovXG4gIHNldEludGVybGluZSAoaW50ZXJsaW5lKSB7XG4gICAgdGhpcy5pbnRlcmxpbmUgPSBNYXRoLmZsb29yKGludGVybGluZSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb25maWcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHN0YXR1cyBvZiBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgaW4gdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSBkZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgc3RhdHVzIGluIHRoZSBNaW5pbWFwXG4gICAqL1xuICBnZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgKCkge1xuICAgIGlmICh0aGlzLmRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXZpY2VQaXhlbFJhdGlvUm91bmRpbmdcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnRGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZyBzdGF0dXMgZm9yIHRoaXMgTWluaW1hcC5cbiAgICogVGhpcyB2YWx1ZSB3aWxsIG92ZXJyaWRlIHRoZSB2YWx1ZSBmcm9tIHRoZSBjb25maWcgZm9yIHRoaXMgaW5zdGFuY2Ugb25seS5cbiAgICogQSBgZGlkLWNoYW5nZS1jb25maWdgIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nIHRoZSBuZXcgc3RhdHVzIG9mXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZ1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgTWluaW1hcFxuICAgKiBAZW1pdHMge2RpZC1jaGFuZ2UtY29uZmlnfSB3aGVuIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBzZXREZXZpY2VQaXhlbFJhdGlvUm91bmRpbmcgKGRldmljZVBpeGVsUmF0aW9Sb3VuZGluZykge1xuICAgIHRoaXMuZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nID0gZGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtY29uZmlnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZXZpY2VQaXhlbFJhdGlvIGluIHRoZSBNaW5pbWFwIGluIHBpeGVscy5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgZGV2aWNlUGl4ZWxSYXRpbyBpbiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpbyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGV2aWNlUGl4ZWxSYXRpb1JvdW5kaW5nKClcbiAgICAgID8gTWF0aC5mbG9vcihkZXZpY2VQaXhlbFJhdGlvKVxuICAgICAgOiBkZXZpY2VQaXhlbFJhdGlvXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZpc2libGUgcm93IGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgdmlzaWJsZSByb3dcbiAgICovXG4gIGdldEZpcnN0VmlzaWJsZVNjcmVlblJvdyAoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5nZXRTY3JvbGxUb3AoKSAvIHRoaXMuZ2V0TGluZUhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IHZpc2libGUgcm93IGluIHRoZSBNaW5pbWFwLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIHJvd1xuICAgKi9cbiAgZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3cgKCkge1xuICAgIHJldHVybiBNYXRoLmNlaWwoXG4gICAgICAodGhpcy5nZXRTY3JvbGxUb3AoKSArIHRoaXMuZ2V0U2NyZWVuSGVpZ2h0KCkpIC8gdGhpcy5nZXRMaW5lSGVpZ2h0KClcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIHdoZW4gdGhlIGBpbmRlcGVuZGVudE1pbmltYXBTY3JvbGxgIHNldHRpbmcgaGF2ZSBiZWVuIGVuYWJsZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhlIG1pbmltYXAgY2FuIHNjcm9sbCBpbmRlcGVuZGVudGx5XG4gICAqL1xuICBzY3JvbGxJbmRlcGVuZGVudGx5T25Nb3VzZVdoZWVsICgpIHsgcmV0dXJuIHRoaXMuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzY3JvbGwgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIFRoZSBNaW5pbWFwIGNhbiBzY3JvbGwgb25seSB3aGVuIGl0cyBoZWlnaHQgaXMgZ3JlYXRlciB0aGF0IHRoZSBoZWlnaHRcbiAgICogb2YgaXRzIGBUZXh0RWRpdG9yYC5cbiAgICpcbiAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgc2Nyb2xsIHRvcCBvZiB0aGUgTWluaW1hcFxuICAgKi9cbiAgZ2V0U2Nyb2xsVG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFuZEFsb25lIHx8IHRoaXMuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsXG4gICAgICA/IHRoaXMuc2Nyb2xsVG9wXG4gICAgICA6IHRoaXMuZ2V0U2Nyb2xsVG9wRnJvbUVkaXRvcigpXG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbWluaW1hcCBzY3JvbGwgdG9wIHZhbHVlIHdoZW4gaW4gc3RhbmQtYWxvbmUgbW9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHNjcm9sbFRvcCB0aGUgbmV3IHNjcm9sbCB0b3AgZm9yIHRoZSBNaW5pbWFwXG4gICAqIEBlbWl0cyB7ZGlkLWNoYW5nZS1zY3JvbGwtdG9wfSBpZiB0aGUgTWluaW1hcCdzIHN0YW5kLWFsb25lIG1vZGUgaXMgZW5hYmxlZFxuICAgKi9cbiAgc2V0U2Nyb2xsVG9wIChzY3JvbGxUb3ApIHtcbiAgICB0aGlzLnNjcm9sbFRvcCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHRoaXMuZ2V0TWF4U2Nyb2xsVG9wKCksIHNjcm9sbFRvcCkpXG5cbiAgICBpZiAodGhpcy5zdGFuZEFsb25lIHx8IHRoaXMuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zY3JvbGwtdG9wJywgdGhpcylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWluaW1hcCBzY3JvbGwgYXMgYSByYXRpb24gYmV0d2VlbiAwIGFuZCAxLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSBtaW5pbWFwIHNjcm9sbCByYXRpb1xuICAgKi9cbiAgZ2V0U2Nyb2xsUmF0aW8gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFNjcm9sbFRvcCgpIC8gdGhpcy5nZXRNYXhTY3JvbGxUb3AoKVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHNjcm9sbCB0b3AgdmFsdWUgd2l0aCB0aGUgb25lIGNvbXB1dGVkIGZyb20gdGhlIHRleHQgZWRpdG9yXG4gICAqIHdoZW4gdGhlIG1pbmltYXAgaXMgaW4gdGhlIGluZGVwZW5kZW50IHNjcm9sbGluZyBtb2RlLlxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIHVwZGF0ZVNjcm9sbFRvcCAoKSB7XG4gICAgaWYgKHRoaXMuaW5kZXBlbmRlbnRNaW5pbWFwU2Nyb2xsKSB7XG4gICAgICB0aGlzLnNldFNjcm9sbFRvcCh0aGlzLmdldFNjcm9sbFRvcEZyb21FZGl0b3IoKSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNjcm9sbC10b3AnLCB0aGlzKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzY3JvbGwgdG9wIGFzIGNvbXB1dGVkIGZyb20gdGhlIHRleHQgZWRpdG9yIHNjcm9sbCB0b3AuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIGNvbXB1dGVkIHNjcm9sbCB0b3AgdmFsdWVcbiAgICovXG4gIGdldFNjcm9sbFRvcEZyb21FZGl0b3IgKCkge1xuICAgIHJldHVybiBNYXRoLmFicyhcbiAgICAgIHRoaXMuZ2V0Q2FwZWRUZXh0RWRpdG9yU2Nyb2xsUmF0aW8oKSAqIHRoaXMuZ2V0TWF4U2Nyb2xsVG9wKClcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWUgb2YgdGhlIE1pbmltYXAuXG4gICAqXG4gICAqIEByZXR1cm4ge251bWJlcn0gdGhlIG1heGltdW0gc2Nyb2xsIHRvcCBmb3IgdGhlIE1pbmltYXBcbiAgICovXG4gIGdldE1heFNjcm9sbFRvcCAoKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KDAsIHRoaXMuZ2V0SGVpZ2h0KCkgLSB0aGlzLmdldFNjcmVlbkhlaWdodCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIHdoZW4gdGhlIE1pbmltYXAgY2FuIHNjcm9sbC5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciB0aGlzIE1pbmltYXAgY2FuIHNjcm9sbCBvciBub3RcbiAgICovXG4gIGNhblNjcm9sbCAoKSB7IHJldHVybiB0aGlzLmdldE1heFNjcm9sbFRvcCgpID4gMCB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIG1pbmltYXAgc2Nyb2xsIHRvcCB2YWx1ZSB1c2luZyBhIG1vdXNlIGV2ZW50IHdoZW4gdGhlXG4gICAqIGluZGVwZW5kZW50IHNjcm9sbGluZyBtb2RlIGlzIGVuYWJsZWRcbiAgICpcbiAgICogQHBhcmFtICB7TW91c2VFdmVudH0gZXZlbnQgdGhlIG1vdXNlIHdoZWVsIGV2ZW50XG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgb25Nb3VzZVdoZWVsIChldmVudCkge1xuICAgIGlmICghdGhpcy5jYW5TY3JvbGwoKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3Qge3doZWVsRGVsdGFZfSA9IGV2ZW50XG4gICAgY29uc3QgcHJldmlvdXNTY3JvbGxUb3AgPSB0aGlzLmdldFNjcm9sbFRvcCgpXG4gICAgY29uc3QgdXBkYXRlZFNjcm9sbFRvcCA9IHByZXZpb3VzU2Nyb2xsVG9wIC0gTWF0aC5yb3VuZCh3aGVlbERlbHRhWSAqIHRoaXMuc2Nyb2xsU2Vuc2l0aXZpdHkpXG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5zZXRTY3JvbGxUb3AodXBkYXRlZFNjcm9sbFRvcClcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZXMgdG8gYFRleHRFZGl0b3IjZ2V0TWFya2VyYC5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBnZXRNYXJrZXIgKGlkKSB7IHJldHVybiB0aGlzLnRleHRFZGl0b3IuZ2V0TWFya2VyKGlkKSB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyB0byBgVGV4dEVkaXRvciNmaW5kTWFya2Vyc2AuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZmluZE1hcmtlcnMgKG8pIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dEVkaXRvci5maW5kTWFya2VycyhvKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVsZWdhdGVzIHRvIGBUZXh0RWRpdG9yI21hcmtCdWZmZXJSYW5nZWAuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgbWFya0J1ZmZlclJhbmdlIChyYW5nZSkgeyByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSkgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBhIGNoYW5nZSBldmVudHMgd2l0aCB0aGUgcGFzc2VkLWluIGNoYW5nZXMgYXMgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSBjaGFuZ2VzIGEgY2hhbmdlIHRvIGRpc3BhdGNoXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKi9cbiAgZW1pdENoYW5nZXMgKGNoYW5nZXMpIHsgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UnLCBjaGFuZ2VzKSB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGNhY2hlIGF0IHRoZSBhZGFwdGVyIGxldmVsIHRvIGF2b2lkIGNvbnNlY3V0aXZlIGFjY2VzcyB0byB0aGVcbiAgICogdGV4dCBlZGl0b3IgQVBJIGR1cmluZyBhIHJlbmRlciBwaGFzZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBlbmFibGVDYWNoZSAoKSB7IHRoaXMuYWRhcHRlci5lbmFibGVDYWNoZSgpIH1cblxuICAvKipcbiAgICogRGlzYWJsZSB0aGUgYWRhcHRlciBjYWNoZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjbGVhckNhY2hlICgpIHsgdGhpcy5hZGFwdGVyLmNsZWFyQ2FjaGUoKSB9XG5cbn1cbiJdfQ==
//# sourceURL=/Users/Sargon/.atom/packages/minimap/lib/minimap.js
