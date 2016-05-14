(function() {
  var CCP, CompositeDisposable, Config, Draggabilly, FloatingPanel, InnerPanel, Input, Palette, Slider, Swatch, TinyColor;

  Config = require('./config');

  FloatingPanel = require('./modules/ui/FloatingPanel');

  InnerPanel = require('./modules/ui/InnerPanel');

  Swatch = require('./modules/core/Swatch');

  Slider = require('./modules/core/Slider');

  Input = require('./modules/core/Input');

  Palette = require('./modules/core/Palette');

  TinyColor = require('./modules/helper/TinyColor');

  Draggabilly = require('./modules/helper/Draggabilly');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = CCP = {
    open: false,
    selection: null,
    config: Config,
    CCPContainer: null,
    CCPCanvas: null,
    CCPCanvasOverlay: null,
    CCPHandle: null,
    CCPDraggie: null,
    CCPDragger: null,
    CCPControls: null,
    CCPDisplay: null,
    CCPContainerPalette: null,
    CCPOldColor: null,
    CCPNewColor: null,
    CCPContainerSlider: null,
    CCPSliderHue: null,
    CCPSliderAlpha: null,
    CCPContainerInput: null,
    CCPPalette: null,
    CCPActiveSwatch: null,
    CCPSwatchPopup: null,
    CCPOverlay: null,
    ColorRange: null,
    ColorMatcher: null,
    OldColor: null,
    NewColor: null,
    Editor: null,
    EditorView: null,
    tempListeners: {},
    subscriptions: null,
    popUpSubscriptions: null,
    keyboardSubscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.CCPContainer = new FloatingPanel('ccp-container', document.querySelector('atom-workspace-axis.vertical'));
      this.CCPCanvas = new InnerPanel('ccp-canvas');
      this.CCPCanvasOverlay = new InnerPanel('ccp-canvas-overlay');
      this.CCPHandle = new InnerPanel('ccp-handle');
      this.CCPDragger = new InnerPanel('ccp-dragger');
      this.CCPControls = new InnerPanel('ccp-panel');
      this.CCPDisplay = new InnerPanel('ccp-panel', 'notop');
      this.CCPContainerPalette = new InnerPanel('ccp-panel');
      this.CCPOldColor = new Swatch('circle');
      this.CCPNewColor = new Swatch('circle');
      this.CCPContainerSlider = new InnerPanel('ccp-container-slider');
      this.CCPSliderHue = new Slider('hue');
      this.CCPSliderAlpha = new Slider('alpha');
      this.CCPContainerInput = new Input(this.CCPDisplay.component);
      this.CCPPalette = new Palette;
      this.CCPSliderHue.setMax(360);
      this.CCPSliderHue.setValue(0);
      this.CCPSliderAlpha.setValue(100);
      this.CCPContainerPalette.addClass('palette');
      this.addTooltips();
      this.CCPDragger.add(this.CCPHandle);
      this.CCPCanvasOverlay.add(this.CCPDragger);
      this.CCPCanvas.add(this.CCPCanvasOverlay);
      this.CCPControls.add(this.CCPOldColor);
      this.CCPControls.add(this.CCPNewColor);
      this.CCPControls.add(this.CCPContainerSlider);
      this.CCPContainerSlider.add(this.CCPSliderHue);
      this.CCPContainerSlider.add(this.CCPSliderAlpha);
      this.CCPContainerPalette.add(this.CCPPalette);
      this.CCPContainerPalette.component.appendChild(this.CCPPalette.button);
      this.CCPContainer.add(this.CCPCanvas);
      this.CCPContainer.add(this.CCPControls);
      this.CCPContainer.add(this.CCPDisplay);
      this.CCPContainer.add(this.CCPContainerPalette);
      this.CCPContainer.component.appendChild(this.CCPPalette.popUpPalette);
      this.CCPDraggie = new Draggabilly(this.CCPDragger.component, {
        containment: true,
        handle: 'ccp-handle'
      });
      this.attachEventListeners();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'chrome-color-picker:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'chrome-color-picker:close': (function(_this) {
          return function() {
            return _this.close();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'chrome-color-picker:save': (function(_this) {
          return function() {
            return _this.save();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.CCPContainer.destroy();
      return this.subscriptions.dispose();
    },
    serialize: function() {},
    close: function() {
      if (this.open) {
        return this.toggle();
      }
    },
    save: function(close) {
      if (this.open) {
        this.ColorRange = this.Editor.insertText(this.CCPContainerInput.getColor().toString());
      }
      if (close) {
        return this.close();
      }
    },
    toggle: function() {
      var BufferLine, Cursor, cursorBufferRow, cursorColumn, cursorPosition, cursorScreenRow, match, matches, preferredFormat, selection, visibleRowRange;
      if (this.open) {
        this.CCPContainer.toggle();
        this.keyboardSubscriptions.dispose();
        this.removeTempEvents();
        this.EditorView.focus();
        return this.open = false;
      } else {
        this.Editor = atom.workspace.getActiveTextEditor();
        if (!this.Editor) {
          return;
        }
        this.EditorView = atom.views.getView(this.Editor);
        this.EditorRoot = this.EditorView.shadowRoot;
        Cursor = this.Editor.getLastCursor();
        if (!Cursor) {
          return;
        }
        visibleRowRange = this.EditorView.getVisibleRowRange();
        cursorScreenRow = Cursor.getScreenRow();
        cursorBufferRow = Cursor.getBufferRow();
        if ((cursorScreenRow < visibleRowRange[0]) || (cursorScreenRow > visibleRowRange[1])) {
          return;
        }
        BufferLine = Cursor.getCurrentBufferLine();
        matches = TinyColor().getMatch(BufferLine);
        cursorColumn = Cursor.getBufferColumn();
        match = (function() {
          var _i, _len, _match;
          for (_i = 0, _len = matches.length; _i < _len; _i++) {
            _match = matches[_i];
            if (_match.start <= cursorColumn && _match.end >= cursorColumn) {
              return _match;
            }
          }
        })();
        if (match) {
          this.Editor.clearSelections();
          selection = this.Editor.addSelectionForBufferRange([[cursorBufferRow, match.start], [cursorBufferRow, match.end]]);
          this.selection = {
            color: match,
            row: cursorBufferRow
          };
        } else {
          this.selection = {
            column: Cursor.getBufferColumn(),
            row: cursorBufferRow
          };
        }
        cursorPosition = this.EditorView.pixelRectForScreenRange(this.Editor.getSelectedScreenRange());
        this.OldColor = match ? TinyColor(match.color) : TinyColor().random();
        this.NewColor = this.OldColor;
        preferredFormat = atom.config.get('chrome-color-picker.General.preferredFormat');
        preferredFormat = preferredFormat === 'As authored' && !!match ? match.format : 'hex';
        this.CCPContainerInput.toggle.classList.remove('icon-fold', 'icon-unfold');
        if (atom.config.get('chrome-color-picker.General.paletteOpen')) {
          this.CCPContainerPalette.component.classList.remove('invisible');
          this.CCPContainerInput.toggle.classList.add('icon-fold');
        } else {
          this.CCPContainerPalette.component.classList.add('invisible');
          this.CCPContainerInput.toggle.classList.add('icon-unfold');
        }
        this.CCPContainer.setPlace(cursorPosition, this.EditorRoot, this.EditorView, match);
        this.CCPContainerInput.changeFormat(preferredFormat);
        this.CCPContainer.toggle();
        this.UpdateUI({
          color: this.OldColor,
          old: true
        });
        if ((this.CCPSwatchPopup != null) || (this.CCPOverlay != null)) {
          this.HidePopUpOverlay();
        }
        if (!this.CCPPalette.popUpPalette.classList.contains('invisible')) {
          this.CCPPalette.popUpPalette.classList.add('invisible');
        }
        this.addKeyBoardAndTempEvents();
        return this.open = true;
      }
    },
    addTooltips: function() {
      var i, palette, palettes, _i, _len, _results;
      this.subscriptions.add(atom.tooltips.add(this.CCPOldColor.component, {
        title: 'Previously set color'
      }));
      this.subscriptions.add(atom.tooltips.add(this.CCPNewColor.component, {
        title: 'Currently set color'
      }));
      this.subscriptions.add(atom.tooltips.add(this.CCPContainerInput.button, {
        title: 'Cycle between possible color modes'
      }));
      this.subscriptions.add(atom.tooltips.add(this.CCPContainerInput.toggle, {
        title: 'Toggle open / close the palette'
      }));
      this.subscriptions.add(atom.tooltips.add(this.CCPPalette.customButton, {
        title: 'Add currently set color to palette'
      }));
      palettes = this.CCPPalette.swatches.materialPalette;
      _results = [];
      for (i = _i = 0, _len = palettes.length; _i < _len; i = ++_i) {
        palette = palettes[i];
        _results.push(this.subscriptions.add(atom.tooltips.add(this.CCPPalette.swatches.material[i], {
          title: "" + palette.color + " " + palette.hex + " Click to select, Double Click to expand"
        })));
      }
      return _results;
    },
    attachEventListeners: function() {
      var hexEditor, hslEditor, rgbEditor, type, workspace, _editor, _results;
      workspace = atom.workspace;
      this.subscriptions.add(workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.close();
        };
      })(this)));
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var editorView;
          editorView = atom.views.getView(editor);
          _this.subscriptions.add(editorView.onDidChangeScrollTop(function() {
            return _this.close();
          }));
          return _this.subscriptions.add(editorView.onDidChangeScrollLeft(function() {
            return _this.close();
          }));
        };
      })(this));
      this.CCPCanvasOverlay.component.addEventListener('click', (function(_this) {
        return function(e) {
          var x, y;
          if (!(e.target.nodeName === 'CCP-DRAGGER' || e.target.nodeName === 'CCP-HANDLE')) {
            x = e.offsetX / 239;
            y = (124 - e.offsetY) / 124;
            _this.UpdateSlider(x, y);
          }
          return e.stopPropagation();
        };
      })(this));
      this.CCPDraggie.on('dragMove', (function(_this) {
        return function(e, p, m) {
          var x, y;
          x = _this.CCPDraggie.position.x / 239;
          y = (124 - _this.CCPDraggie.position.y) / 124;
          return _this.UpdateSlider(x, y, false);
        };
      })(this));
      this.CCPCanvasOverlay.component.addEventListener('wheel', (function(_this) {
        return function(e) {
          var delta, x, y;
          delta = 5 * Math.sign(e.wheelDelta);
          x = parseInt(_this.CCPDragger.component.offsetLeft);
          y = 124 - parseInt(_this.CCPDragger.component.offsetTop);
          if (e.ctrlKey) {
            delta *= 2;
          }
          if (e.shiftKey) {
            x += delta;
          } else {
            y += delta;
          }
          if (x < 0) {
            x = 0;
          }
          if (y < 0) {
            y = 0;
          }
          if (y > 124) {
            y = 124;
          }
          if (x > 239) {
            x = 239;
          }
          x /= 239;
          y /= 124;
          return _this.UpdateSlider(x, y);
        };
      })(this));
      this.CCPOldColor.component.addEventListener('click', (function(_this) {
        return function() {
          return _this.UpdateUI({
            color: _this.OldColor
          });
        };
      })(this));
      this.CCPSliderHue.slider.addEventListener('input', (function(_this) {
        return function(e) {
          return _this.UpdateHue(e.target.value);
        };
      })(this));
      this.CCPSliderAlpha.slider.addEventListener('input', (function(_this) {
        return function(e) {
          return _this.UpdateAlpha(e.target.value);
        };
      })(this));
      this.CCPSliderHue.slider.addEventListener('wheel', (function(_this) {
        return function(e) {
          var delta, newValue;
          delta = Math.sign(e.wheelDelta);
          if (e.ctrlKey) {
            delta *= 10;
          }
          newValue = parseInt(e.target.value);
          newValue += delta;
          if (newValue < 0) {
            newValue = 0;
          }
          if (newValue > 360) {
            newValue = 360;
          }
          e.target.value = newValue;
          return _this.UpdateHue(newValue);
        };
      })(this));
      this.CCPSliderAlpha.slider.addEventListener('wheel', (function(_this) {
        return function(e) {
          var delta, newValue;
          delta = Math.sign(e.wheelDelta);
          if (e.ctrlKey) {
            delta *= 10;
          }
          newValue = parseInt(e.target.value);
          newValue += delta;
          if (newValue < 0) {
            newValue = 0;
          }
          if (newValue > 100) {
            newValue = 100;
          }
          e.target.value = newValue;
          return _this.UpdateAlpha(newValue);
        };
      })(this));
      this.CCPContainerInput.toggle.addEventListener('click', (function(_this) {
        return function() {
          _this.CCPContainerPalette.component.classList.toggle('invisible');
          if (_this.CCPContainerInput.toggle.classList.contains('icon-fold')) {
            _this.CCPContainerInput.toggle.classList.remove('icon-fold');
            _this.CCPContainerInput.toggle.classList.add('icon-unfold');
            return atom.config.set('chrome-color-picker.General.paletteOpen', false);
          } else {
            _this.CCPContainerInput.toggle.classList.remove('icon-unfold');
            _this.CCPContainerInput.toggle.classList.add('icon-fold');
            return atom.config.set('chrome-color-picker.General.paletteOpen', true);
          }
        };
      })(this));
      this.CCPPalette.button.addEventListener('click', (function(_this) {
        return function() {
          return _this.togglePopUp();
        };
      })(this));
      this.CCPPalette.popUpPaletteButton.addEventListener('click', (function(_this) {
        return function() {
          return _this.togglePopUp();
        };
      })(this));
      this.CCPContainerPalette.component.addEventListener('click', (function(_this) {
        return function(e) {
          var newColor;
          if (e.target && e.target.nodeName === 'CCP-SWATCH') {
            newColor = new TinyColor(e.target.getAttribute('data-color'));
            return _this.UpdateUI({
              color: newColor,
              forced: false
            });
          }
        };
      })(this));
      this.CCPContainerPalette.component.addEventListener('dblclick', (function(_this) {
        return function(e) {
          var bottom, colorName, docfrag, i, left, palette, swatch, weights;
          if (e.target && e.target.nodeName === 'CCP-SWATCH' && e.target.parentNode.classList.contains('material') && e.target.getAttribute('data-name') !== 'black' && e.target.getAttribute('data-name') !== 'white') {
            if (_this.popUpSubscriptions != null) {
              _this.popUpSubscriptions.dispose();
            }
            _this.popUpSubscriptions = new CompositeDisposable;
            _this.CCPActiveSwatch = e.target;
            weights = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
            _this.CCPSwatchPopup = new InnerPanel('ccp-swatch-popup');
            _this.CCPOverlay = new InnerPanel('ccp-overlay');
            _this.CCPOverlay.component.addEventListener('click', function() {
              return _this.HidePopUpOverlay();
            });
            colorName = e.target.getAttribute('data-name'.toLowerCase());
            if (colorName.indexOf('-' > -1)) {
              colorName = colorName.replace('-', '');
            }
            palette = _this.CCPPalette.materialColors[colorName];
            docfrag = document.createDocumentFragment();
            i = palette.length;
            while (i--) {
              swatch = new Swatch('square');
              swatch.component.setAttribute('data-color', palette[i]);
              swatch.component.setAttribute('data-name', weights[i]);
              swatch.component.setAttribute('style', 'background: ' + palette[i]);
              _this.popUpSubscriptions.add(atom.tooltips.add(swatch.component, {
                title: "" + (e.target.getAttribute('data-name')) + "(" + weights[i] + "): " + palette[i]
              }));
              docfrag.appendChild(swatch.component);
            }
            _this.CCPSwatchPopup.component.appendChild(docfrag);
            left = e.target.offsetLeft - 5;
            bottom = _this.CCPContainer.component.offsetHeight - e.target.offsetHeight - e.target.offsetTop - 5;
            _this.CCPSwatchPopup.component.setAttribute('style', "left: " + left + "px; bottom: " + bottom + "px");
            _this.CCPSwatchPopup.component.addEventListener('click', function(e) {
              var newColor;
              if (e.target && e.target.nodeName === 'CCP-SWATCH') {
                newColor = new TinyColor(e.target.getAttribute('data-color'));
                _this.UpdateUI({
                  color: newColor,
                  forced: false
                });
                return _this.HidePopUpOverlay();
              }
            });
            _this.CCPContainer.add(_this.CCPOverlay);
            return _this.CCPContainer.add(_this.CCPSwatchPopup);
          }
        };
      })(this));
      this.CCPPalette.customButton.addEventListener('click', (function(_this) {
        return function(e) {
          var swatch;
          swatch = new Swatch('square');
          swatch.component.setAttribute('style', 'background: ' + _this.NewColor.toRgbString());
          swatch.component.setAttribute('data-color', _this.NewColor.toRgbString());
          return e.target.parentNode.appendChild(swatch.component);
        };
      })(this));
      hexEditor = this.CCPContainerInput.hex.querySelector('atom-text-editor.hex').getModel();
      rgbEditor = {
        'r': this.CCPContainerInput.rgb.querySelector('atom-text-editor.r').getModel(),
        'g': this.CCPContainerInput.rgb.querySelector('atom-text-editor.g').getModel(),
        'b': this.CCPContainerInput.rgb.querySelector('atom-text-editor.b').getModel(),
        'a': this.CCPContainerInput.rgb.querySelector('atom-text-editor.a').getModel()
      };
      hslEditor = {
        'h': this.CCPContainerInput.hsl.querySelector('atom-text-editor.h').getModel(),
        's': this.CCPContainerInput.hsl.querySelector('atom-text-editor.s').getModel(),
        'l': this.CCPContainerInput.hsl.querySelector('atom-text-editor.l').getModel(),
        'a': this.CCPContainerInput.hsl.querySelector('atom-text-editor.a').getModel()
      };
      this.subscriptions.add(hexEditor.onDidInsertText((function(_this) {
        return function() {
          var color;
          color = TinyColor(hexEditor.getText());
          if (color.isValid()) {
            _this.NewColor = color;
            return _this.UpdateUI({
              color: _this.NewColor,
              text: false,
              forced: false
            });
          }
        };
      })(this)));
      for (type in rgbEditor) {
        _editor = rgbEditor[type];
        this.subscriptions.add(_editor.onDidInsertText((function(_this) {
          return function() {
            var color;
            color = TinyColor({
              r: rgbEditor.r.getText(),
              g: rgbEditor.g.getText(),
              b: rgbEditor.b.getText()
            });
            if (_this.CCPContainerInput.alpha) {
              color.setAlpha(rgbEditor.a.getText());
            }
            if (color.isValid()) {
              _this.NewColor = color;
              return _this.UpdateUI({
                color: _this.NewColor,
                text: false,
                forced: false
              });
            }
          };
        })(this)));
      }
      _results = [];
      for (type in hslEditor) {
        _editor = hslEditor[type];
        _results.push(this.subscriptions.add(_editor.onDidInsertText((function(_this) {
          return function() {
            var color;
            color = TinyColor({
              h: hslEditor.h.getText(),
              s: hslEditor.s.getText(),
              l: hslEditor.l.getText()
            });
            if (_this.CCPContainerInput.alpha) {
              color.setAlpha(hslEditor.a.getText());
            }
            if (color.isValid()) {
              _this.NewColor = color;
              return _this.UpdateUI({
                color: _this.NewColor,
                text: false,
                forced: false
              });
            }
          };
        })(this))));
      }
      return _results;
    },
    addKeyBoardAndTempEvents: function() {
      this.keyboardSubscriptions = new CompositeDisposable;
      this.keyboardSubscriptions.add(atom.keymaps.onDidMatchBinding((function(_this) {
        return function(e) {
          if (e.keystrokes === 'escape') {
            _this.close();
          }
          if (e.keystrokes === 'enter' && _this.inside(e.keyboardEventTarget)) {
            return _this.save(true);
          }
        };
      })(this)));
      this.tempListeners.onClick = (function(_this) {
        return function(e) {
          if (!_this.inside(e.target)) {
            return _this.close();
          }
        };
      })(this);
      this.tempListeners.onResize = (function(_this) {
        return function() {
          return _this.close();
        };
      })(this);
      window.addEventListener('click', this.tempListeners.onClick, true);
      return window.addEventListener('resize', this.tempListeners.onResize, true);
    },
    removeTempEvents: function() {
      window.removeEventListener('click', this.tempListeners.onClick, true);
      return window.removeEventListener('resize', this.tempListeners.onResize, true);
    },
    togglePopUp: function() {
      return this.CCPPalette.popUpPalette.classList.toggle('invisible');
    },

    /**
     * [UpdateUI update the ui controls of the dialog]
     * @param {[type]} color  [the color to be updated with]
     * @param {[type]} old    [update the old color swatch as well]
     * @param {[type]} slider [update the main slider]
     * @param {[type]} hue    [update the hue slider]
     * @param {[type]} alpha  [update the alpha slider]
     * @param {[type]} text   [update the inner editors]
     * @param {[type]} forced  [if the updated was forced or not]
     */
    UpdateUI: function(_arg) {
      var alpha, color, forced, hsvColor, hue, old, selection, slider, text, _ref;
      _ref = _arg != null ? _arg : {}, color = _ref.color, old = _ref.old, slider = _ref.slider, hue = _ref.hue, alpha = _ref.alpha, text = _ref.text, forced = _ref.forced;
      old = old != null ? old : false;
      slider = slider != null ? slider : true;
      hue = hue != null ? hue : true;
      alpha = alpha != null ? alpha : true;
      text = text != null ? text : true;
      forced = forced != null ? forced : true;
      this.NewColor = color;
      if (old) {
        this.CCPOldColor.setColor(this.OldColor.toRgbString());
      }
      this.CCPNewColor.setColor(this.NewColor.toRgbString());
      hsvColor = this.NewColor.toHsv();
      if (slider) {
        this.CCPDraggie.disable();
        this.CCPDragger.setPosition(Math.round(hsvColor.s * 239), 124 - Math.round(hsvColor.v * 124));
        this.CCPDraggie.enable();
      }
      this.CCPCanvas.setColor(TinyColor({
        h: hsvColor.h,
        s: 1,
        v: 1
      }).toRgbString());
      if (hue) {
        this.CCPSliderHue.setValue(360 - hsvColor.h);
      }
      if (alpha) {
        this.CCPSliderAlpha.setColor(TinyColor({
          h: hsvColor.h,
          s: 1,
          v: 1
        }).toRgbString());
        this.CCPSliderAlpha.setValue(Math.round(hsvColor.a * 100));
      }
      this.CCPContainerInput.color = this.NewColor;
      if (text) {
        this.CCPContainerInput.UpdateUI();
      }
      if (atom.config.get('chrome-color-picker.General.autoSetColor') && !forced) {
        this.save();
        return selection = this.Editor.addSelectionForBufferRange([[this.ColorRange[0].start.row, this.ColorRange[0].start.column], [this.ColorRange[0].end.row, this.ColorRange[0].end.column]]);
      }
    },
    UpdateSlider: function(x, y, s) {
      var newColor, oldColor;
      if (s == null) {
        s = true;
      }
      oldColor = this.NewColor.toHsv();
      newColor = new TinyColor({
        h: oldColor.h,
        s: x,
        v: y,
        a: oldColor.a
      });
      return this.UpdateUI({
        color: newColor,
        slider: s,
        forced: false
      });
    },
    UpdateHue: function(value) {
      var newColor, oldColor;
      oldColor = this.NewColor.toHsv();
      newColor = new TinyColor({
        h: 360 - value,
        s: oldColor.s,
        v: oldColor.v,
        a: oldColor.a
      });
      return this.UpdateUI({
        color: newColor,
        hue: false,
        forced: false
      });
    },
    UpdateAlpha: function(value) {
      var newColor, oldColor;
      oldColor = this.NewColor.toHsv();
      newColor = new TinyColor({
        h: oldColor.h,
        s: oldColor.s,
        v: oldColor.v,
        a: value / 100
      });
      return this.UpdateUI({
        color: newColor,
        alpha: false,
        forced: false
      });
    },
    HidePopUpOverlay: function() {
      this.CCPOverlay["delete"]();
      this.CCPSwatchPopup["delete"]();
      this.CCPSwatchPopup = null;
      this.CCPOverlay = null;
      return this.popUpSubscriptions.dispose();
    },
    inside: function(child) {
      return this.CCPContainer.component.contains(child);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9jaHJvbWUtY29sb3ItcGlja2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtSEFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSw0QkFBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSx5QkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsT0FBQSxDQUFRLHVCQUFSLENBTFQsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsdUJBQVIsQ0FOVCxDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxzQkFBUixDQVBSLENBQUE7O0FBQUEsRUFRQSxPQUFBLEdBQVUsT0FBQSxDQUFRLHdCQUFSLENBUlYsQ0FBQTs7QUFBQSxFQVVBLFNBQUEsR0FBWSxPQUFBLENBQVEsNEJBQVIsQ0FWWixDQUFBOztBQUFBLEVBV0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSw4QkFBUixDQVhkLENBQUE7O0FBQUEsRUFhQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBYkQsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBQUEsR0FFZjtBQUFBLElBQUEsSUFBQSxFQUFNLEtBQU47QUFBQSxJQUNBLFNBQUEsRUFBVyxJQURYO0FBQUEsSUFJQSxNQUFBLEVBQVEsTUFKUjtBQUFBLElBT0EsWUFBQSxFQUFjLElBUGQ7QUFBQSxJQVFBLFNBQUEsRUFBVyxJQVJYO0FBQUEsSUFTQSxnQkFBQSxFQUFrQixJQVRsQjtBQUFBLElBVUEsU0FBQSxFQUFXLElBVlg7QUFBQSxJQVdBLFVBQUEsRUFBWSxJQVhaO0FBQUEsSUFZQSxVQUFBLEVBQVksSUFaWjtBQUFBLElBYUEsV0FBQSxFQUFhLElBYmI7QUFBQSxJQWNBLFVBQUEsRUFBWSxJQWRaO0FBQUEsSUFlQSxtQkFBQSxFQUFxQixJQWZyQjtBQUFBLElBZ0JBLFdBQUEsRUFBYSxJQWhCYjtBQUFBLElBaUJBLFdBQUEsRUFBYSxJQWpCYjtBQUFBLElBa0JBLGtCQUFBLEVBQW9CLElBbEJwQjtBQUFBLElBbUJBLFlBQUEsRUFBYyxJQW5CZDtBQUFBLElBb0JBLGNBQUEsRUFBZ0IsSUFwQmhCO0FBQUEsSUFxQkEsaUJBQUEsRUFBbUIsSUFyQm5CO0FBQUEsSUFzQkEsVUFBQSxFQUFZLElBdEJaO0FBQUEsSUF1QkEsZUFBQSxFQUFpQixJQXZCakI7QUFBQSxJQXdCQSxjQUFBLEVBQWdCLElBeEJoQjtBQUFBLElBeUJBLFVBQUEsRUFBWSxJQXpCWjtBQUFBLElBMkJBLFVBQUEsRUFBWSxJQTNCWjtBQUFBLElBNEJBLFlBQUEsRUFBYyxJQTVCZDtBQUFBLElBNkJBLFFBQUEsRUFBVSxJQTdCVjtBQUFBLElBOEJBLFFBQUEsRUFBVSxJQTlCVjtBQUFBLElBK0JBLE1BQUEsRUFBUSxJQS9CUjtBQUFBLElBZ0NBLFVBQUEsRUFBWSxJQWhDWjtBQUFBLElBbUNBLGFBQUEsRUFBZSxFQW5DZjtBQUFBLElBb0NBLGFBQUEsRUFBZSxJQXBDZjtBQUFBLElBcUNBLGtCQUFBLEVBQW9CLElBckNwQjtBQUFBLElBc0NBLHFCQUFBLEVBQXVCLElBdEN2QjtBQUFBLElBd0NBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUVSLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLGFBQUEsQ0FBYyxlQUFkLEVBQStCLFFBQVEsQ0FBQyxhQUFULENBQXVCLDhCQUF2QixDQUEvQixDQUhwQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFVBQUEsQ0FBVyxZQUFYLENBSmpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxnQkFBRCxHQUF3QixJQUFBLFVBQUEsQ0FBVyxvQkFBWCxDQUx4QixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFVBQUEsQ0FBVyxZQUFYLENBTmpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLGFBQVgsQ0FQbEIsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxVQUFBLENBQVcsV0FBWCxDQVJuQixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBVyxXQUFYLEVBQXdCLE9BQXhCLENBVGxCLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxtQkFBRCxHQUEyQixJQUFBLFVBQUEsQ0FBVyxXQUFYLENBVjNCLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsTUFBQSxDQUFPLFFBQVAsQ0FYbkIsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxNQUFBLENBQU8sUUFBUCxDQVpuQixDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsa0JBQUQsR0FBMEIsSUFBQSxVQUFBLENBQVcsc0JBQVgsQ0FiMUIsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxNQUFBLENBQU8sS0FBUCxDQWRwQixDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLE1BQUEsQ0FBTyxPQUFQLENBZnRCLENBQUE7QUFBQSxNQWdCQSxJQUFDLENBQUEsaUJBQUQsR0FBeUIsSUFBQSxLQUFBLENBQU0sSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFsQixDQWhCekIsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLE9BakJkLENBQUE7QUFBQSxNQW9CQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsR0FBckIsQ0FwQkEsQ0FBQTtBQUFBLE1BcUJBLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUF1QixDQUF2QixDQXJCQSxDQUFBO0FBQUEsTUFzQkEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxRQUFoQixDQUF5QixHQUF6QixDQXRCQSxDQUFBO0FBQUEsTUF3QkEsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFFBQXJCLENBQThCLFNBQTlCLENBeEJBLENBQUE7QUFBQSxNQTJCQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBM0JBLENBQUE7QUFBQSxNQThCQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBQyxDQUFBLFNBQWpCLENBOUJBLENBQUE7QUFBQSxNQWdDQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsR0FBbEIsQ0FBc0IsSUFBQyxDQUFBLFVBQXZCLENBaENBLENBQUE7QUFBQSxNQWtDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxJQUFDLENBQUEsZ0JBQWhCLENBbENBLENBQUE7QUFBQSxNQW9DQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFdBQWxCLENBcENBLENBQUE7QUFBQSxNQXFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFdBQWxCLENBckNBLENBQUE7QUFBQSxNQXNDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLGtCQUFsQixDQXRDQSxDQUFBO0FBQUEsTUF3Q0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEdBQXBCLENBQXdCLElBQUMsQ0FBQSxZQUF6QixDQXhDQSxDQUFBO0FBQUEsTUF5Q0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEdBQXBCLENBQXdCLElBQUMsQ0FBQSxjQUF6QixDQXpDQSxDQUFBO0FBQUEsTUEyQ0EsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEdBQXJCLENBQXlCLElBQUMsQ0FBQSxVQUExQixDQTNDQSxDQUFBO0FBQUEsTUE0Q0EsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxXQUEvQixDQUEyQyxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQXZELENBNUNBLENBQUE7QUFBQSxNQStDQSxJQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFNBQW5CLENBL0NBLENBQUE7QUFBQSxNQWdEQSxJQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLENBaERBLENBQUE7QUFBQSxNQWlEQSxJQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFVBQW5CLENBakRBLENBQUE7QUFBQSxNQWtEQSxJQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLG1CQUFuQixDQWxEQSxDQUFBO0FBQUEsTUFtREEsSUFBQyxDQUFBLFlBQVksQ0FBQyxTQUFTLENBQUMsV0FBeEIsQ0FBb0MsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFoRCxDQW5EQSxDQUFBO0FBQUEsTUFzREEsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUF4QixFQUNsQjtBQUFBLFFBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxRQUNBLE1BQUEsRUFBUSxZQURSO09BRGtCLENBdERsQixDQUFBO0FBQUEsTUEyREEsSUFBQyxDQUFBLG9CQUFELENBQUEsQ0EzREEsQ0FBQTtBQUFBLE1BOERBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSw0QkFBQSxFQUE4QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtPQUFwQyxDQUFuQixDQTlEQSxDQUFBO0FBQUEsTUErREEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO09BQXBDLENBQW5CLENBL0RBLENBQUE7YUFnRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLDBCQUFBLEVBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO09BQXBDLENBQW5CLEVBbEVRO0lBQUEsQ0F4Q1Y7QUFBQSxJQTRHQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQUZVO0lBQUEsQ0E1R1o7QUFBQSxJQWdIQSxTQUFBLEVBQVcsU0FBQSxHQUFBLENBaEhYO0FBQUEsSUFxSEEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBSjtlQUNFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFERjtPQURLO0lBQUEsQ0FySFA7QUFBQSxJQTBIQSxJQUFBLEVBQU0sU0FBQyxLQUFELEdBQUE7QUFDSixNQUFBLElBQUcsSUFBQyxDQUFBLElBQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxRQUFuQixDQUFBLENBQTZCLENBQUMsUUFBOUIsQ0FBQSxDQUFuQixDQUFkLENBREY7T0FBQTtBQUVBLE1BQUEsSUFBRyxLQUFIO2VBQ0UsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQURGO09BSEk7SUFBQSxDQTFITjtBQUFBLElBZ0lBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFFTixVQUFBLCtJQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFKO0FBQ0UsUUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxxQkFBcUIsQ0FBQyxPQUF2QixDQUFBLENBRkEsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FKQSxDQUFBO0FBQUEsUUFNQSxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosQ0FBQSxDQU5BLENBQUE7ZUFRQSxJQUFDLENBQUEsSUFBRCxHQUFRLE1BVFY7T0FBQSxNQUFBO0FBWUUsUUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFWLENBQUE7QUFHQSxRQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsTUFBZjtBQUFBLGdCQUFBLENBQUE7U0FIQTtBQUFBLFFBTUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLE1BQXBCLENBTmQsQ0FBQTtBQUFBLFFBU0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsVUFBVSxDQUFDLFVBVDFCLENBQUE7QUFBQSxRQVlBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQVpULENBQUE7QUFlQSxRQUFBLElBQUEsQ0FBQSxNQUFBO0FBQUEsZ0JBQUEsQ0FBQTtTQWZBO0FBQUEsUUFrQkEsZUFBQSxHQUFrQixJQUFDLENBQUEsVUFBVSxDQUFDLGtCQUFaLENBQUEsQ0FsQmxCLENBQUE7QUFBQSxRQW1CQSxlQUFBLEdBQWtCLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FuQmxCLENBQUE7QUFBQSxRQW9CQSxlQUFBLEdBQWtCLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FwQmxCLENBQUE7QUF1QkEsUUFBQSxJQUFVLENBQUMsZUFBQSxHQUFrQixlQUFnQixDQUFBLENBQUEsQ0FBbkMsQ0FBQSxJQUEwQyxDQUFDLGVBQUEsR0FBa0IsZUFBZ0IsQ0FBQSxDQUFBLENBQW5DLENBQXBEO0FBQUEsZ0JBQUEsQ0FBQTtTQXZCQTtBQUFBLFFBMEJBLFVBQUEsR0FBYSxNQUFNLENBQUMsb0JBQVAsQ0FBQSxDQTFCYixDQUFBO0FBQUEsUUE2QkEsT0FBQSxHQUFVLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFxQixVQUFyQixDQTdCVixDQUFBO0FBQUEsUUFnQ0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FoQ2YsQ0FBQTtBQUFBLFFBbUNBLEtBQUEsR0FBVyxDQUFBLFNBQUEsR0FBQTtBQUFHLGNBQUEsZ0JBQUE7QUFBQSxlQUFBLDhDQUFBO2lDQUFBO0FBRVosWUFBQSxJQUFpQixNQUFNLENBQUMsS0FBUCxJQUFnQixZQUFoQixJQUFpQyxNQUFNLENBQUMsR0FBUCxJQUFjLFlBQWhFO0FBQUEscUJBQU8sTUFBUCxDQUFBO2FBRlk7QUFBQSxXQUFIO1FBQUEsQ0FBQSxDQUFILENBQUEsQ0FuQ1IsQ0FBQTtBQXdDQSxRQUFBLElBQUcsS0FBSDtBQUVFLFVBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFHQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFtQyxDQUM3QyxDQUFDLGVBQUQsRUFBa0IsS0FBSyxDQUFDLEtBQXhCLENBRDZDLEVBRTdDLENBQUMsZUFBRCxFQUFrQixLQUFLLENBQUMsR0FBeEIsQ0FGNkMsQ0FBbkMsQ0FIWixDQUFBO0FBQUEsVUFRQSxJQUFDLENBQUEsU0FBRCxHQUFhO0FBQUEsWUFBQSxLQUFBLEVBQU8sS0FBUDtBQUFBLFlBQWMsR0FBQSxFQUFLLGVBQW5CO1dBUmIsQ0FGRjtTQUFBLE1BQUE7QUFjRSxVQUFBLElBQUMsQ0FBQSxTQUFELEdBQWE7QUFBQSxZQUFBLE1BQUEsRUFBUSxNQUFNLENBQUMsZUFBUCxDQUFBLENBQVI7QUFBQSxZQUFrQyxHQUFBLEVBQUssZUFBdkM7V0FBYixDQWRGO1NBeENBO0FBQUEsUUF5REEsY0FBQSxHQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLHVCQUFaLENBQW9DLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxDQUFwQyxDQXpEakIsQ0FBQTtBQUFBLFFBMERBLElBQUMsQ0FBQSxRQUFELEdBQWUsS0FBSCxHQUFjLFNBQUEsQ0FBVSxLQUFLLENBQUMsS0FBaEIsQ0FBZCxHQUEwQyxTQUFBLENBQUEsQ0FBVyxDQUFDLE1BQVosQ0FBQSxDQTFEdEQsQ0FBQTtBQUFBLFFBMkRBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLFFBM0RiLENBQUE7QUFBQSxRQThEQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2Q0FBaEIsQ0E5RGxCLENBQUE7QUFBQSxRQWlFQSxlQUFBLEdBQXFCLGVBQUEsS0FBbUIsYUFBbkIsSUFBcUMsQ0FBQSxDQUFDLEtBQXpDLEdBQXFELEtBQUssQ0FBQyxNQUEzRCxHQUF1RSxLQWpFekYsQ0FBQTtBQUFBLFFBb0VBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQXBDLENBQTJDLFdBQTNDLEVBQXdELGFBQXhELENBcEVBLENBQUE7QUFxRUEsUUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FBSDtBQUNFLFVBQUEsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBekMsQ0FBZ0QsV0FBaEQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFwQyxDQUF3QyxXQUF4QyxDQURBLENBREY7U0FBQSxNQUFBO0FBSUUsVUFBQSxJQUFDLENBQUEsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUF6QyxDQUE2QyxXQUE3QyxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQXBDLENBQXdDLGFBQXhDLENBREEsQ0FKRjtTQXJFQTtBQUFBLFFBNkVBLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUF1QixjQUF2QixFQUF1QyxJQUFDLENBQUEsVUFBeEMsRUFBb0QsSUFBQyxDQUFBLFVBQXJELEVBQWlFLEtBQWpFLENBN0VBLENBQUE7QUFBQSxRQWdGQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsWUFBbkIsQ0FBZ0MsZUFBaEMsQ0FoRkEsQ0FBQTtBQUFBLFFBa0ZBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFBLENBbEZBLENBQUE7QUFBQSxRQW9GQSxJQUFDLENBQUEsUUFBRCxDQUFVO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLFFBQVI7QUFBQSxVQUFrQixHQUFBLEVBQUssSUFBdkI7U0FBVixDQXBGQSxDQUFBO0FBdUZBLFFBQUEsSUFBRyw2QkFBQSxJQUFvQix5QkFBdkI7QUFDRSxVQUFBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQUEsQ0FERjtTQXZGQTtBQTBGQSxRQUFBLElBQUcsQ0FBQSxJQUFLLENBQUEsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsUUFBbkMsQ0FBNEMsV0FBNUMsQ0FBUDtBQUNFLFVBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQW5DLENBQXVDLFdBQXZDLENBQUEsQ0FERjtTQTFGQTtBQUFBLFFBOEZBLElBQUMsQ0FBQSx3QkFBRCxDQUFBLENBOUZBLENBQUE7ZUFpR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQTdHVjtPQUZNO0lBQUEsQ0FoSVI7QUFBQSxJQWlQQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsV0FBVyxDQUFDLFNBQS9CLEVBQTBDO0FBQUEsUUFBQyxLQUFBLEVBQU8sc0JBQVI7T0FBMUMsQ0FBbkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBL0IsRUFBMEM7QUFBQSxRQUFDLEtBQUEsRUFBTyxxQkFBUjtPQUExQyxDQUFuQixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLGlCQUFpQixDQUFDLE1BQXJDLEVBQTZDO0FBQUEsUUFBQyxLQUFBLEVBQU8sb0NBQVI7T0FBN0MsQ0FBbkIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFyQyxFQUE2QztBQUFBLFFBQUMsS0FBQSxFQUFPLGlDQUFSO09BQTdDLENBQW5CLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsVUFBVSxDQUFDLFlBQTlCLEVBQTRDO0FBQUEsUUFBQyxLQUFBLEVBQU8sb0NBQVI7T0FBNUMsQ0FBbkIsQ0FKQSxDQUFBO0FBQUEsTUFNQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFRLENBQUMsZUFOaEMsQ0FBQTtBQU9BO1dBQUEsdURBQUE7OEJBQUE7QUFDRSxzQkFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQWhELEVBQW9EO0FBQUEsVUFBQyxLQUFBLEVBQU8sRUFBQSxHQUFHLE9BQU8sQ0FBQyxLQUFYLEdBQWlCLEdBQWpCLEdBQW9CLE9BQU8sQ0FBQyxHQUE1QixHQUFnQywwQ0FBeEM7U0FBcEQsQ0FBbkIsRUFBQSxDQURGO0FBQUE7c0JBUlc7SUFBQSxDQWpQYjtBQUFBLElBNlBBLG9CQUFBLEVBQXNCLFNBQUEsR0FBQTtBQUVwQixVQUFBLG1FQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLFNBQWpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixTQUFTLENBQUMseUJBQVYsQ0FBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxDQUFuQixDQUhBLENBQUE7QUFBQSxNQU1BLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ2hDLGNBQUEsVUFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUFiLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixVQUFVLENBQUMsb0JBQVgsQ0FBZ0MsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBSDtVQUFBLENBQWhDLENBQW5CLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsVUFBVSxDQUFDLHFCQUFYLENBQWlDLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsS0FBRCxDQUFBLEVBQUg7VUFBQSxDQUFqQyxDQUFuQixFQUhnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBTkEsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxnQkFBNUIsQ0FBNkMsT0FBN0MsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ3BELGNBQUEsSUFBQTtBQUFBLFVBQUEsSUFBRyxDQUFBLENBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFULEtBQXFCLGFBQXJCLElBQXNDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBVCxLQUFxQixZQUE1RCxDQUFQO0FBQ0UsWUFBQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxHQUFoQixDQUFBO0FBQUEsWUFDQSxDQUFBLEdBQUksQ0FBQyxHQUFBLEdBQU0sQ0FBQyxDQUFDLE9BQVQsQ0FBQSxHQUFvQixHQUR4QixDQUFBO0FBQUEsWUFFQSxLQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsQ0FGQSxDQURGO1dBQUE7aUJBSUEsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUxvRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELENBWkEsQ0FBQTtBQUFBLE1Bb0JBLElBQUMsQ0FBQSxVQUFVLENBQUMsRUFBWixDQUFlLFVBQWYsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEdBQUE7QUFDekIsY0FBQSxJQUFBO0FBQUEsVUFBQSxDQUFBLEdBQUksS0FBQyxDQUFBLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBckIsR0FBeUIsR0FBN0IsQ0FBQTtBQUFBLFVBQ0EsQ0FBQSxHQUFJLENBQUMsR0FBQSxHQUFNLEtBQUMsQ0FBQSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQTVCLENBQUEsR0FBaUMsR0FEckMsQ0FBQTtpQkFFQSxLQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsS0FBcEIsRUFIeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQXBCQSxDQUFBO0FBQUEsTUEwQkEsSUFBQyxDQUFBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxnQkFBNUIsQ0FBNkMsT0FBN0MsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ3BELGNBQUEsV0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUMsQ0FBQyxVQUFaLENBQVosQ0FBQTtBQUFBLFVBRUEsQ0FBQSxHQUFJLFFBQUEsQ0FBUyxLQUFDLENBQUEsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUEvQixDQUZKLENBQUE7QUFBQSxVQUdBLENBQUEsR0FBSSxHQUFBLEdBQU0sUUFBQSxDQUFTLEtBQUMsQ0FBQSxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQS9CLENBSFYsQ0FBQTtBQUtBLFVBQUEsSUFBRyxDQUFDLENBQUMsT0FBTDtBQUNFLFlBQUEsS0FBQSxJQUFTLENBQVQsQ0FERjtXQUxBO0FBU0EsVUFBQSxJQUFHLENBQUMsQ0FBQyxRQUFMO0FBQ0UsWUFBQSxDQUFBLElBQUssS0FBTCxDQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsQ0FBQSxJQUFLLEtBQUwsQ0FIRjtXQVRBO0FBY0EsVUFBQSxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQ0UsWUFBQSxDQUFBLEdBQUksQ0FBSixDQURGO1dBZEE7QUFnQkEsVUFBQSxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQ0UsWUFBQSxDQUFBLEdBQUksQ0FBSixDQURGO1dBaEJBO0FBbUJBLFVBQUEsSUFBRyxDQUFBLEdBQUksR0FBUDtBQUNFLFlBQUEsQ0FBQSxHQUFJLEdBQUosQ0FERjtXQW5CQTtBQXFCQSxVQUFBLElBQUcsQ0FBQSxHQUFJLEdBQVA7QUFDRSxZQUFBLENBQUEsR0FBSSxHQUFKLENBREY7V0FyQkE7QUFBQSxVQXdCQSxDQUFBLElBQUssR0F4QkwsQ0FBQTtBQUFBLFVBeUJBLENBQUEsSUFBSyxHQXpCTCxDQUFBO2lCQTJCQSxLQUFDLENBQUEsWUFBRCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUE1Qm9EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsQ0ExQkEsQ0FBQTtBQUFBLE1BeURBLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBUyxDQUFDLGdCQUF2QixDQUF3QyxPQUF4QyxFQUFpRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMvQyxLQUFDLENBQUEsUUFBRCxDQUFVO0FBQUEsWUFBQSxLQUFBLEVBQU8sS0FBQyxDQUFBLFFBQVI7V0FBVixFQUQrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpELENBekRBLENBQUE7QUFBQSxNQTREQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBckIsQ0FBc0MsT0FBdEMsRUFBK0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO2lCQUM3QyxLQUFDLENBQUEsU0FBRCxDQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBcEIsRUFENkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQyxDQTVEQSxDQUFBO0FBQUEsTUErREEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQXZCLENBQXdDLE9BQXhDLEVBQWlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtpQkFDL0MsS0FBQyxDQUFBLFdBQUQsQ0FBYSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQXRCLEVBRCtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQsQ0EvREEsQ0FBQTtBQUFBLE1BbUVBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBTSxDQUFDLGdCQUFyQixDQUFzQyxPQUF0QyxFQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDN0MsY0FBQSxlQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFDLENBQUMsVUFBWixDQUFSLENBQUE7QUFFQSxVQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUw7QUFDRSxZQUFBLEtBQUEsSUFBUyxFQUFULENBREY7V0FGQTtBQUFBLFVBSUEsUUFBQSxHQUFXLFFBQUEsQ0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQWxCLENBSlgsQ0FBQTtBQUFBLFVBS0EsUUFBQSxJQUFZLEtBTFosQ0FBQTtBQU9BLFVBQUEsSUFBRyxRQUFBLEdBQVcsQ0FBZDtBQUNFLFlBQUEsUUFBQSxHQUFXLENBQVgsQ0FERjtXQVBBO0FBVUEsVUFBQSxJQUFHLFFBQUEsR0FBVyxHQUFkO0FBQ0UsWUFBQSxRQUFBLEdBQVcsR0FBWCxDQURGO1dBVkE7QUFBQSxVQWFBLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBVCxHQUFpQixRQWJqQixDQUFBO2lCQWVBLEtBQUMsQ0FBQSxTQUFELENBQVcsUUFBWCxFQWhCNkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQyxDQW5FQSxDQUFBO0FBQUEsTUFxRkEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQXZCLENBQXdDLE9BQXhDLEVBQWlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUMvQyxjQUFBLGVBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLENBQUMsQ0FBQyxVQUFaLENBQVIsQ0FBQTtBQUVBLFVBQUEsSUFBRyxDQUFDLENBQUMsT0FBTDtBQUNFLFlBQUEsS0FBQSxJQUFTLEVBQVQsQ0FERjtXQUZBO0FBQUEsVUFJQSxRQUFBLEdBQVcsUUFBQSxDQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBbEIsQ0FKWCxDQUFBO0FBQUEsVUFLQSxRQUFBLElBQVksS0FMWixDQUFBO0FBT0EsVUFBQSxJQUFHLFFBQUEsR0FBVyxDQUFkO0FBQ0UsWUFBQSxRQUFBLEdBQVcsQ0FBWCxDQURGO1dBUEE7QUFVQSxVQUFBLElBQUcsUUFBQSxHQUFXLEdBQWQ7QUFDRSxZQUFBLFFBQUEsR0FBVyxHQUFYLENBREY7V0FWQTtBQUFBLFVBYUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFULEdBQWlCLFFBYmpCLENBQUE7aUJBZUEsS0FBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLEVBaEIrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpELENBckZBLENBQUE7QUFBQSxNQXVHQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGdCQUExQixDQUEyQyxPQUEzQyxFQUFvRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBRWxELFVBQUEsS0FBQyxDQUFBLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBekMsQ0FBZ0QsV0FBaEQsQ0FBQSxDQUFBO0FBRUEsVUFBQSxJQUFHLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQXBDLENBQTZDLFdBQTdDLENBQUg7QUFDRSxZQUFBLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQXBDLENBQTJDLFdBQTNDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBcEMsQ0FBd0MsYUFBeEMsQ0FEQSxDQUFBO21CQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsRUFBMkQsS0FBM0QsRUFIRjtXQUFBLE1BQUE7QUFLRSxZQUFBLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQXBDLENBQTJDLGFBQTNDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBcEMsQ0FBd0MsV0FBeEMsQ0FEQSxDQUFBO21CQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsRUFBMkQsSUFBM0QsRUFQRjtXQUprRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBELENBdkdBLENBQUE7QUFBQSxNQXFIQSxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBbkIsQ0FBb0MsT0FBcEMsRUFBNkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLFdBQUQsQ0FBQSxFQUQyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDLENBckhBLENBQUE7QUFBQSxNQXlIQSxJQUFDLENBQUEsVUFBVSxDQUFDLGtCQUFrQixDQUFDLGdCQUEvQixDQUFnRCxPQUFoRCxFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN2RCxLQUFDLENBQUEsV0FBRCxDQUFBLEVBRHVEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsQ0F6SEEsQ0FBQTtBQUFBLE1BNkhBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsZ0JBQS9CLENBQWdELE9BQWhELEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUN2RCxjQUFBLFFBQUE7QUFBQSxVQUFBLElBQUcsQ0FBQyxDQUFDLE1BQUYsSUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVQsS0FBcUIsWUFBckM7QUFDRSxZQUFBLFFBQUEsR0FBZSxJQUFBLFNBQUEsQ0FBVSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVQsQ0FBc0IsWUFBdEIsQ0FBVixDQUFmLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFFBQUQsQ0FBVTtBQUFBLGNBQUEsS0FBQSxFQUFPLFFBQVA7QUFBQSxjQUFpQixNQUFBLEVBQVEsS0FBekI7YUFBVixFQUZGO1dBRHVEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsQ0E3SEEsQ0FBQTtBQUFBLE1BbUlBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsZ0JBQS9CLENBQWdELFVBQWhELEVBQTRELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUcxRCxjQUFBLDZEQUFBO0FBQUEsVUFBQSxJQUFHLENBQUMsQ0FBQyxNQUFGLElBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFULEtBQXFCLFlBQWxDLElBQW1ELENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUE5QixDQUF1QyxVQUF2QyxDQUFuRCxJQUEwRyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVQsQ0FBc0IsV0FBdEIsQ0FBQSxLQUF3QyxPQUFsSixJQUE4SixDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVQsQ0FBc0IsV0FBdEIsQ0FBQSxLQUF3QyxPQUF6TTtBQUVFLFlBQUEsSUFBRyxnQ0FBSDtBQUE2QixjQUFBLEtBQUMsQ0FBQSxrQkFBa0IsQ0FBQyxPQUFwQixDQUFBLENBQUEsQ0FBN0I7YUFBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLGtCQUFELEdBQXNCLEdBQUEsQ0FBQSxtQkFGdEIsQ0FBQTtBQUFBLFlBSUEsS0FBQyxDQUFBLGVBQUQsR0FBbUIsQ0FBQyxDQUFDLE1BSnJCLENBQUE7QUFBQSxZQU1BLE9BQUEsR0FBVSxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsS0FBZCxFQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQyxLQUFuQyxFQUEwQyxLQUExQyxFQUFpRCxLQUFqRCxFQUF3RCxLQUF4RCxFQUErRCxLQUEvRCxFQUFzRSxNQUF0RSxFQUE4RSxNQUE5RSxFQUFzRixNQUF0RixFQUE4RixNQUE5RixDQU5WLENBQUE7QUFBQSxZQVFBLEtBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEsVUFBQSxDQUFXLGtCQUFYLENBUnRCLENBQUE7QUFBQSxZQVNBLEtBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLGFBQVgsQ0FUbEIsQ0FBQTtBQUFBLFlBV0EsS0FBQyxDQUFBLFVBQVUsQ0FBQyxTQUFTLENBQUMsZ0JBQXRCLENBQXVDLE9BQXZDLEVBQWdELFNBQUEsR0FBQTtxQkFDOUMsS0FBQyxDQUFBLGdCQUFELENBQUEsRUFEOEM7WUFBQSxDQUFoRCxDQVhBLENBQUE7QUFBQSxZQWVBLFNBQUEsR0FBWSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVQsQ0FBc0IsV0FBVyxDQUFDLFdBQVosQ0FBQSxDQUF0QixDQWZaLENBQUE7QUFnQkEsWUFBQSxJQUFHLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQUEsR0FBTSxDQUFBLENBQXhCLENBQUg7QUFDRSxjQUFBLFNBQUEsR0FBWSxTQUFTLENBQUMsT0FBVixDQUFrQixHQUFsQixFQUF1QixFQUF2QixDQUFaLENBREY7YUFoQkE7QUFBQSxZQWtCQSxPQUFBLEdBQVUsS0FBQyxDQUFBLFVBQVUsQ0FBQyxjQUFlLENBQUEsU0FBQSxDQWxCckMsQ0FBQTtBQUFBLFlBbUJBLE9BQUEsR0FBVSxRQUFRLENBQUMsc0JBQVQsQ0FBQSxDQW5CVixDQUFBO0FBQUEsWUFvQkEsQ0FBQSxHQUFJLE9BQU8sQ0FBQyxNQXBCWixDQUFBO0FBcUJBLG1CQUFNLENBQUEsRUFBTixHQUFBO0FBQ0UsY0FBQSxNQUFBLEdBQWEsSUFBQSxNQUFBLENBQU8sUUFBUCxDQUFiLENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBakIsQ0FBOEIsWUFBOUIsRUFBNEMsT0FBUSxDQUFBLENBQUEsQ0FBcEQsQ0FEQSxDQUFBO0FBQUEsY0FFQSxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQWpCLENBQThCLFdBQTlCLEVBQTJDLE9BQVEsQ0FBQSxDQUFBLENBQW5ELENBRkEsQ0FBQTtBQUFBLGNBR0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFqQixDQUE4QixPQUE5QixFQUF1QyxjQUFBLEdBQWlCLE9BQVEsQ0FBQSxDQUFBLENBQWhFLENBSEEsQ0FBQTtBQUFBLGNBSUEsS0FBQyxDQUFBLGtCQUFrQixDQUFDLEdBQXBCLENBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixNQUFNLENBQUMsU0FBekIsRUFBb0M7QUFBQSxnQkFBQyxLQUFBLEVBQU8sRUFBQSxHQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFULENBQXNCLFdBQXRCLENBQUQsQ0FBRixHQUFzQyxHQUF0QyxHQUF5QyxPQUFRLENBQUEsQ0FBQSxDQUFqRCxHQUFvRCxLQUFwRCxHQUF5RCxPQUFRLENBQUEsQ0FBQSxDQUF6RTtlQUFwQyxDQUF4QixDQUpBLENBQUE7QUFBQSxjQUtBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQU0sQ0FBQyxTQUEzQixDQUxBLENBREY7WUFBQSxDQXJCQTtBQUFBLFlBNEJBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLFdBQTFCLENBQXNDLE9BQXRDLENBNUJBLENBQUE7QUFBQSxZQThCQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFULEdBQXNCLENBOUI3QixDQUFBO0FBQUEsWUErQkEsTUFBQSxHQUFTLEtBQUMsQ0FBQSxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQXhCLEdBQXVDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBaEQsR0FBK0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUF4RSxHQUFvRixDQS9CN0YsQ0FBQTtBQUFBLFlBZ0NBLEtBQUMsQ0FBQSxjQUFjLENBQUMsU0FBUyxDQUFDLFlBQTFCLENBQXVDLE9BQXZDLEVBQWlELFFBQUEsR0FBUSxJQUFSLEdBQWEsY0FBYixHQUEyQixNQUEzQixHQUFrQyxJQUFuRixDQWhDQSxDQUFBO0FBQUEsWUFrQ0EsS0FBQyxDQUFBLGNBQWMsQ0FBQyxTQUFTLENBQUMsZ0JBQTFCLENBQTJDLE9BQTNDLEVBQW9ELFNBQUMsQ0FBRCxHQUFBO0FBQ2xELGtCQUFBLFFBQUE7QUFBQSxjQUFBLElBQUcsQ0FBQyxDQUFDLE1BQUYsSUFBYSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVQsS0FBcUIsWUFBckM7QUFFRSxnQkFBQSxRQUFBLEdBQWUsSUFBQSxTQUFBLENBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFULENBQXNCLFlBQXRCLENBQVYsQ0FBZixDQUFBO0FBQUEsZ0JBQ0EsS0FBQyxDQUFBLFFBQUQsQ0FBVTtBQUFBLGtCQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsa0JBQWlCLE1BQUEsRUFBUSxLQUF6QjtpQkFBVixDQURBLENBQUE7dUJBR0EsS0FBQyxDQUFBLGdCQUFELENBQUEsRUFMRjtlQURrRDtZQUFBLENBQXBELENBbENBLENBQUE7QUFBQSxZQTJDQSxLQUFDLENBQUEsWUFBWSxDQUFDLEdBQWQsQ0FBa0IsS0FBQyxDQUFBLFVBQW5CLENBM0NBLENBQUE7bUJBNENBLEtBQUMsQ0FBQSxZQUFZLENBQUMsR0FBZCxDQUFrQixLQUFDLENBQUEsY0FBbkIsRUE5Q0Y7V0FIMEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RCxDQW5JQSxDQUFBO0FBQUEsTUFzTEEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFZLENBQUMsZ0JBQXpCLENBQTBDLE9BQTFDLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUVqRCxjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBYSxJQUFBLE1BQUEsQ0FBTyxRQUFQLENBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFqQixDQUE4QixPQUE5QixFQUF1QyxjQUFBLEdBQWlCLEtBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFBLENBQXhELENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxZQUFqQixDQUE4QixZQUE5QixFQUE0QyxLQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBQSxDQUE1QyxDQUZBLENBQUE7aUJBR0EsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsV0FBcEIsQ0FBZ0MsTUFBTSxDQUFDLFNBQXZDLEVBTGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQsQ0F0TEEsQ0FBQTtBQUFBLE1BOExBLFNBQUEsR0FBWSxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGFBQXZCLENBQXFDLHNCQUFyQyxDQUE0RCxDQUFDLFFBQTdELENBQUEsQ0E5TFosQ0FBQTtBQUFBLE1BK0xBLFNBQUEsR0FBWTtBQUFBLFFBQ1YsR0FBQSxFQUFLLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsYUFBdkIsQ0FBcUMsb0JBQXJDLENBQTBELENBQUMsUUFBM0QsQ0FBQSxDQURLO0FBQUEsUUFFVixHQUFBLEVBQUssSUFBQyxDQUFBLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxhQUF2QixDQUFxQyxvQkFBckMsQ0FBMEQsQ0FBQyxRQUEzRCxDQUFBLENBRks7QUFBQSxRQUdWLEdBQUEsRUFBSyxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGFBQXZCLENBQXFDLG9CQUFyQyxDQUEwRCxDQUFDLFFBQTNELENBQUEsQ0FISztBQUFBLFFBSVYsR0FBQSxFQUFLLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsYUFBdkIsQ0FBcUMsb0JBQXJDLENBQTBELENBQUMsUUFBM0QsQ0FBQSxDQUpLO09BL0xaLENBQUE7QUFBQSxNQXFNQSxTQUFBLEdBQVk7QUFBQSxRQUNWLEdBQUEsRUFBSyxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGFBQXZCLENBQXFDLG9CQUFyQyxDQUEwRCxDQUFDLFFBQTNELENBQUEsQ0FESztBQUFBLFFBRVYsR0FBQSxFQUFLLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsYUFBdkIsQ0FBcUMsb0JBQXJDLENBQTBELENBQUMsUUFBM0QsQ0FBQSxDQUZLO0FBQUEsUUFHVixHQUFBLEVBQUssSUFBQyxDQUFBLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxhQUF2QixDQUFxQyxvQkFBckMsQ0FBMEQsQ0FBQyxRQUEzRCxDQUFBLENBSEs7QUFBQSxRQUlWLEdBQUEsRUFBSyxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGFBQXZCLENBQXFDLG9CQUFyQyxDQUEwRCxDQUFDLFFBQTNELENBQUEsQ0FKSztPQXJNWixDQUFBO0FBQUEsTUE2TUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLFNBQVMsQ0FBQyxlQUFWLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDM0MsY0FBQSxLQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsU0FBQSxDQUFVLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBVixDQUFSLENBQUE7QUFFQSxVQUFBLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFIO0FBQ0UsWUFBQSxLQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FBQTttQkFFQSxLQUFDLENBQUEsUUFBRCxDQUFVO0FBQUEsY0FBQSxLQUFBLEVBQU8sS0FBQyxDQUFBLFFBQVI7QUFBQSxjQUFrQixJQUFBLEVBQU0sS0FBeEI7QUFBQSxjQUErQixNQUFBLEVBQVEsS0FBdkM7YUFBVixFQUhGO1dBSDJDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBbkIsQ0E3TUEsQ0FBQTtBQXFOQSxXQUFBLGlCQUFBO2tDQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLGVBQVIsQ0FBd0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDekMsZ0JBQUEsS0FBQTtBQUFBLFlBQUEsS0FBQSxHQUFRLFNBQUEsQ0FBVTtBQUFBLGNBQ2hCLENBQUEsRUFBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQVosQ0FBQSxDQURhO0FBQUEsY0FFaEIsQ0FBQSxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBWixDQUFBLENBRmE7QUFBQSxjQUdoQixDQUFBLEVBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFaLENBQUEsQ0FIYTthQUFWLENBQVIsQ0FBQTtBQU1BLFlBQUEsSUFBRyxLQUFDLENBQUEsaUJBQWlCLENBQUMsS0FBdEI7QUFDRSxjQUFBLEtBQUssQ0FBQyxRQUFOLENBQWUsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFaLENBQUEsQ0FBZixDQUFBLENBREY7YUFOQTtBQVNBLFlBQUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFBLENBQUg7QUFDRSxjQUFBLEtBQUMsQ0FBQSxRQUFELEdBQVksS0FBWixDQUFBO3FCQUVBLEtBQUMsQ0FBQSxRQUFELENBQVU7QUFBQSxnQkFBQSxLQUFBLEVBQU8sS0FBQyxDQUFBLFFBQVI7QUFBQSxnQkFBa0IsSUFBQSxFQUFNLEtBQXhCO0FBQUEsZ0JBQStCLE1BQUEsRUFBUSxLQUF2QztlQUFWLEVBSEY7YUFWeUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixDQUFuQixDQUFBLENBREY7QUFBQSxPQXJOQTtBQXFPQTtXQUFBLGlCQUFBO2tDQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxlQUFSLENBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ3pDLGdCQUFBLEtBQUE7QUFBQSxZQUFBLEtBQUEsR0FBUSxTQUFBLENBQVU7QUFBQSxjQUNoQixDQUFBLEVBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFaLENBQUEsQ0FEYTtBQUFBLGNBRWhCLENBQUEsRUFBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQVosQ0FBQSxDQUZhO0FBQUEsY0FHaEIsQ0FBQSxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBWixDQUFBLENBSGE7YUFBVixDQUFSLENBQUE7QUFNQSxZQUFBLElBQUcsS0FBQyxDQUFBLGlCQUFpQixDQUFDLEtBQXRCO0FBQ0UsY0FBQSxLQUFLLENBQUMsUUFBTixDQUFlLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBWixDQUFBLENBQWYsQ0FBQSxDQURGO2FBTkE7QUFTQSxZQUFBLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFIO0FBQ0UsY0FBQSxLQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FBQTtxQkFFQSxLQUFDLENBQUEsUUFBRCxDQUFVO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLEtBQUMsQ0FBQSxRQUFSO0FBQUEsZ0JBQWtCLElBQUEsRUFBTSxLQUF4QjtBQUFBLGdCQUErQixNQUFBLEVBQVEsS0FBdkM7ZUFBVixFQUhGO2FBVnlDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FBbkIsRUFBQSxDQURGO0FBQUE7c0JBdk9vQjtJQUFBLENBN1B0QjtBQUFBLElBcWZBLHdCQUFBLEVBQTBCLFNBQUEsR0FBQTtBQUV4QixNQUFBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixHQUFBLENBQUEsbUJBQXpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxxQkFBcUIsQ0FBQyxHQUF2QixDQUEyQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFiLENBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUV4RCxVQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsS0FBZ0IsUUFBbkI7QUFDRSxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQUEsQ0FBQSxDQURGO1dBQUE7QUFHQSxVQUFBLElBQUcsQ0FBQyxDQUFDLFVBQUYsS0FBZ0IsT0FBaEIsSUFBNEIsS0FBQyxDQUFBLE1BQUQsQ0FBUSxDQUFDLENBQUMsbUJBQVYsQ0FBL0I7bUJBQ0UsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBREY7V0FMd0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUEzQixDQUhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixHQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDdkIsVUFBQSxJQUFHLENBQUEsS0FBSyxDQUFBLE1BQUQsQ0FBUSxDQUFDLENBQUMsTUFBVixDQUFQO21CQUNFLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFERjtXQUR1QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWnpCLENBQUE7QUFBQSxNQWlCQSxJQUFDLENBQUEsYUFBYSxDQUFDLFFBQWYsR0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDeEIsS0FBQyxDQUFBLEtBQUQsQ0FBQSxFQUR3QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBakIxQixDQUFBO0FBQUEsTUFxQkEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBaEQsRUFBeUQsSUFBekQsQ0FyQkEsQ0FBQTthQXNCQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsSUFBQyxDQUFBLGFBQWEsQ0FBQyxRQUFqRCxFQUEyRCxJQUEzRCxFQXhCd0I7SUFBQSxDQXJmMUI7QUFBQSxJQWdoQkEsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsTUFBTSxDQUFDLG1CQUFQLENBQTJCLE9BQTNCLEVBQW9DLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBbkQsRUFBNEQsSUFBNUQsQ0FBQSxDQUFBO2FBQ0EsTUFBTSxDQUFDLG1CQUFQLENBQTJCLFFBQTNCLEVBQXFDLElBQUMsQ0FBQSxhQUFhLENBQUMsUUFBcEQsRUFBOEQsSUFBOUQsRUFGZ0I7SUFBQSxDQWhoQmxCO0FBQUEsSUFvaEJBLFdBQUEsRUFBYSxTQUFBLEdBQUE7YUFDWCxJQUFDLENBQUEsVUFBVSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBbkMsQ0FBMEMsV0FBMUMsRUFEVztJQUFBLENBcGhCYjtBQXVoQkE7QUFBQTs7Ozs7Ozs7O09BdmhCQTtBQUFBLElBaWlCQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7QUFFUixVQUFBLHVFQUFBO0FBQUEsNEJBRlMsT0FBaUQsSUFBaEQsYUFBQSxPQUFPLFdBQUEsS0FBSyxjQUFBLFFBQVEsV0FBQSxLQUFLLGFBQUEsT0FBTyxZQUFBLE1BQU0sY0FBQSxNQUVoRCxDQUFBO0FBQUEsTUFBQSxHQUFBLEdBQVMsV0FBSCxHQUFhLEdBQWIsR0FBc0IsS0FBNUIsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFZLGNBQUgsR0FBZ0IsTUFBaEIsR0FBNEIsSUFEckMsQ0FBQTtBQUFBLE1BRUEsR0FBQSxHQUFTLFdBQUgsR0FBYSxHQUFiLEdBQXNCLElBRjVCLENBQUE7QUFBQSxNQUdBLEtBQUEsR0FBVyxhQUFILEdBQWUsS0FBZixHQUEwQixJQUhsQyxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQVUsWUFBSCxHQUFjLElBQWQsR0FBd0IsSUFKL0IsQ0FBQTtBQUFBLE1BS0EsTUFBQSxHQUFZLGNBQUgsR0FBZ0IsTUFBaEIsR0FBNEIsSUFMckMsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQU5aLENBQUE7QUFTQSxNQUFBLElBQUcsR0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQXNCLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixDQUFBLENBQXRCLENBQUEsQ0FERjtPQVRBO0FBQUEsTUFXQSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLENBQUEsQ0FBdEIsQ0FYQSxDQUFBO0FBQUEsTUFhQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FiWCxDQUFBO0FBZUEsTUFBQSxJQUFHLE1BQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBUSxDQUFDLENBQVQsR0FBYSxHQUF4QixDQUF4QixFQUFzRCxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxRQUFRLENBQUMsQ0FBVCxHQUFhLEdBQXhCLENBQTVELENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsQ0FGQSxDQURGO09BZkE7QUFBQSxNQXFCQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVgsQ0FBb0IsU0FBQSxDQUFVO0FBQUEsUUFBQyxDQUFBLEVBQUcsUUFBUSxDQUFDLENBQWI7QUFBQSxRQUFnQixDQUFBLEVBQUcsQ0FBbkI7QUFBQSxRQUFzQixDQUFBLEVBQUcsQ0FBekI7T0FBVixDQUFzQyxDQUFDLFdBQXZDLENBQUEsQ0FBcEIsQ0FyQkEsQ0FBQTtBQXVCQSxNQUFBLElBQUcsR0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQXVCLEdBQUEsR0FBTSxRQUFRLENBQUMsQ0FBdEMsQ0FBQSxDQURGO09BdkJBO0FBMEJBLE1BQUEsSUFBRyxLQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsY0FBYyxDQUFDLFFBQWhCLENBQXlCLFNBQUEsQ0FBVTtBQUFBLFVBQUMsQ0FBQSxFQUFHLFFBQVEsQ0FBQyxDQUFiO0FBQUEsVUFBZ0IsQ0FBQSxFQUFHLENBQW5CO0FBQUEsVUFBc0IsQ0FBQSxFQUFHLENBQXpCO1NBQVYsQ0FBc0MsQ0FBQyxXQUF2QyxDQUFBLENBQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxRQUFoQixDQUF5QixJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVEsQ0FBQyxDQUFULEdBQWEsR0FBeEIsQ0FBekIsQ0FEQSxDQURGO09BMUJBO0FBQUEsTUE4QkEsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEtBQW5CLEdBQTJCLElBQUMsQ0FBQSxRQTlCNUIsQ0FBQTtBQWdDQSxNQUFBLElBQUcsSUFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFFBQW5CLENBQUEsQ0FBQSxDQURGO09BaENBO0FBbUNBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMENBQWhCLENBQUEsSUFBZ0UsQ0FBQSxNQUFuRTtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7ZUFFQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQywwQkFBUixDQUFtQyxDQUM3QyxDQUFDLElBQUMsQ0FBQSxVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBSyxDQUFDLEdBQXRCLEVBQTJCLElBQUMsQ0FBQSxVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBSyxDQUFDLE1BQWhELENBRDZDLEVBRTdDLENBQUMsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFHLENBQUMsR0FBcEIsRUFBeUIsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUFHLENBQUMsTUFBNUMsQ0FGNkMsQ0FBbkMsRUFIZDtPQXJDUTtJQUFBLENBamlCVjtBQUFBLElBK2tCQSxZQUFBLEVBQWMsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsR0FBQTtBQUNaLFVBQUEsa0JBQUE7O1FBRG1CLElBQUk7T0FDdkI7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBZSxJQUFBLFNBQUEsQ0FBVTtBQUFBLFFBQUMsQ0FBQSxFQUFHLFFBQVEsQ0FBQyxDQUFiO0FBQUEsUUFBZ0IsQ0FBQSxFQUFHLENBQW5CO0FBQUEsUUFBc0IsQ0FBQSxFQUFHLENBQXpCO0FBQUEsUUFBNEIsQ0FBQSxFQUFHLFFBQVEsQ0FBQyxDQUF4QztPQUFWLENBRGYsQ0FBQTthQUVBLElBQUMsQ0FBQSxRQUFELENBQVU7QUFBQSxRQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsUUFBaUIsTUFBQSxFQUFRLENBQXpCO0FBQUEsUUFBNEIsTUFBQSxFQUFRLEtBQXBDO09BQVYsRUFIWTtJQUFBLENBL2tCZDtBQUFBLElBcWxCQSxTQUFBLEVBQVcsU0FBQyxLQUFELEdBQUE7QUFDVCxVQUFBLGtCQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQWUsSUFBQSxTQUFBLENBQVU7QUFBQSxRQUFDLENBQUEsRUFBSSxHQUFBLEdBQU0sS0FBWDtBQUFBLFFBQW1CLENBQUEsRUFBRyxRQUFRLENBQUMsQ0FBL0I7QUFBQSxRQUFrQyxDQUFBLEVBQUcsUUFBUSxDQUFDLENBQTlDO0FBQUEsUUFBaUQsQ0FBQSxFQUFHLFFBQVEsQ0FBQyxDQUE3RDtPQUFWLENBRGYsQ0FBQTthQUVBLElBQUMsQ0FBQSxRQUFELENBQVU7QUFBQSxRQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsUUFBaUIsR0FBQSxFQUFLLEtBQXRCO0FBQUEsUUFBNkIsTUFBQSxFQUFRLEtBQXJDO09BQVYsRUFIUztJQUFBLENBcmxCWDtBQUFBLElBMmxCQSxXQUFBLEVBQWEsU0FBQyxLQUFELEdBQUE7QUFDWCxVQUFBLGtCQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxLQUFWLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQWUsSUFBQSxTQUFBLENBQVU7QUFBQSxRQUFDLENBQUEsRUFBRyxRQUFRLENBQUMsQ0FBYjtBQUFBLFFBQWdCLENBQUEsRUFBRyxRQUFRLENBQUMsQ0FBNUI7QUFBQSxRQUErQixDQUFBLEVBQUcsUUFBUSxDQUFDLENBQTNDO0FBQUEsUUFBOEMsQ0FBQSxFQUFHLEtBQUEsR0FBUSxHQUF6RDtPQUFWLENBRGYsQ0FBQTthQUVBLElBQUMsQ0FBQSxRQUFELENBQVU7QUFBQSxRQUFBLEtBQUEsRUFBTyxRQUFQO0FBQUEsUUFBaUIsS0FBQSxFQUFPLEtBQXhCO0FBQUEsUUFBK0IsTUFBQSxFQUFRLEtBQXZDO09BQVYsRUFIVztJQUFBLENBM2xCYjtBQUFBLElBaW1CQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQUQsQ0FBWCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxRQUFELENBQWYsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBRmxCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFIZCxDQUFBO2FBSUEsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUEsRUFMZ0I7SUFBQSxDQWptQmxCO0FBQUEsSUF5bUJBLE1BQUEsRUFBUSxTQUFDLEtBQUQsR0FBQTthQUNOLElBQUMsQ0FBQSxZQUFZLENBQUMsU0FBUyxDQUFDLFFBQXhCLENBQWlDLEtBQWpDLEVBRE07SUFBQSxDQXptQlI7R0FqQkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/chrome-color-picker.coffee
