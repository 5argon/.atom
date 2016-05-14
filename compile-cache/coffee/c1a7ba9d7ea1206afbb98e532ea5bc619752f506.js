(function() {
  var Input, TinyColor, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  helper = require('../helper/helper');

  TinyColor = require('../helper/TinyColor');

  module.exports = Input = (function(_super) {
    __extends(Input, _super);

    Input.prototype.active = {};

    Input.prototype.color = null;

    Input.prototype.hex = null;

    Input.prototype.rgb = null;

    Input.prototype.hsl = null;

    Input.prototype.formats = ['hex', 'rgb', 'hsl'];

    Input.prototype.forced = true;


    /**
     * [constructor Input in atom]
     *
     * @method constructor
     *
     * @param  {[element]}    container   [the container element to attach to]
     *
     * @return {[component]}  [description]
     */

    function Input(container) {
      var element, innerButtons;
      element = ['hex'];
      this.hex = this.createInput('hex', element);
      container.appendChild(this.hex);
      element = ['r', 'g', 'b', 'a'];
      this.rgb = this.createInput('rgb', element);
      container.appendChild(this.rgb);
      element = ['h', 's', 'l', 'a'];
      this.hsl = this.createInput('hsl', element);
      container.appendChild(this.hsl);
      innerButtons = this.createComponent('ccp-side-buttons');
      this.button = document.createElement('BUTTON');
      this.button.classList.add('btn', 'btn-primary', 'btn-sm', 'icon', 'icon-code');
      innerButtons.appendChild(this.button);
      this.toggle = document.createElement('BUTTON');
      this.toggle.classList.add('btn', 'btn-info', 'btn-sm', 'icon');
      this.toggle.classList.add(atom.config.get('chrome-color-picker.General.paletteOpen') ? 'icon-fold' : 'icon-unfold');
      innerButtons.appendChild(this.toggle);
      container.appendChild(innerButtons);
      this.attachEventListeners();
    }


    /**
     * [createInput creates an input element with text label below]
     *
     * @method createInput
     *
     * @param  {[String]}   name   [class name of the container element]
     * @param  {[Object]}   inputs [Object with display text to add below] e.g = ['R','G','B']
     *
     * @return {[panel]}    [returns the element to add to the main panel]
     */

    Input.prototype.createInput = function(name, inputs) {
      var component, div, inner, input, text, _i, _len;
      component = this.createComponent('ccp-input');
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        text = inputs[_i];
        inner = this.createComponent('ccp-input-inner');
        input = document.createElement('atom-text-editor');
        input.setAttribute('type', 'text');
        input.classList.add(text);
        input.setAttribute('mini', true);
        div = document.createElement('DIV');
        if (name === 'hex') {
          text += ' or Named';
        }
        div.textContent = text;
        inner.appendChild(input);
        inner.appendChild(div);
        component.appendChild(inner);
        component.classList.add(name, 'invisible');
      }
      return component;
    };

    Input.prototype.attachEventListeners = function() {
      return this.button.addEventListener('click', (function(_this) {
        return function() {
          _this.next();
          return _this.UpdateUI();
        };
      })(this));
    };


    /**
     * [UpdateUI update the active text element]
     *
     * @method UpdateUI
     *
     */

    Input.prototype.UpdateUI = function() {
      var alpha, fallbackAlphaFormat, format, input, thisColor;
      this.forced = true;
      format = this.active.type;
      this.color = new TinyColor(this.color);
      alpha = false;
      thisColor = null;
      fallbackAlphaFormat = atom.config.get('chrome-color-picker.HexColors.fallbackAlphaFormat');
      if (this.color.getAlpha() < 1) {
        alpha = true;
        if (format === 'hex') {
          format = fallbackAlphaFormat;
          this.changeFormat(fallbackAlphaFormat);
        }
      }
      if (format === 'hex') {
        input = this.hex.querySelector('atom-text-editor.hex');
        input.getModel().setText(this.color.toHexString());
      }
      if (format === 'rgb' || format === 'rgba') {
        thisColor = this.color.toRgb();
        input = this.rgb.querySelector('atom-text-editor.r');
        input.getModel().setText(thisColor.r.toString());
        input = this.rgb.querySelector('atom-text-editor.g');
        input.getModel().setText(thisColor.g.toString());
        input = this.rgb.querySelector('atom-text-editor.b');
        input.getModel().setText(thisColor.b.toString());
      }
      if (format === 'hsl' || format === 'hsla') {
        thisColor = this.color.toHsl();
        input = this.hsl.querySelector('atom-text-editor.h');
        input.getModel().setText(Math.round(thisColor.h).toString());
        input = this.hsl.querySelector('atom-text-editor.s');
        input.getModel().setText("" + (Math.round(thisColor.s * 100).toString()) + "%");
        input = this.hsl.querySelector('atom-text-editor.l');
        input.getModel().setText("" + (Math.round(thisColor.l * 100).toString()) + "%");
      }
      if (alpha) {
        input = this[format].querySelector('atom-text-editor.a');
        input.getModel().setText(thisColor.a.toString());
        input.parentNode.removeAttribute('style');
        return this.alpha = true;
      } else if (format !== 'hex') {
        input = this[format].querySelector('atom-text-editor.a');
        input.parentNode.setAttribute('style', 'display: none');
        return this.alpha = false;
      }
    };

    Input.prototype.changeFormat = function(format) {
      var name, _i, _len, _ref;
      format = format.replace('a', '');
      _ref = this.formats;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this[name].classList.add('invisible');
      }
      this.active.type = format;
      this.active.component = this[format];
      this.active.component.classList.remove('invisible');
      return setTimeout(((function(_this) {
        return function() {
          _this.active.component.querySelector('atom-text-editor').focus();
          return _this.forced = true;
        };
      })(this)), 100);
    };

    Input.prototype.next = function() {
      var current;
      current = this.formats.indexOf(this.active.type);
      if (current === (this.formats.length - 1)) {
        current = 0;
      } else {
        current++;
      }
      return this.changeFormat(this.formats[current]);
    };

    Input.prototype.getColor = function() {
      var color, colorName, hex3, hexForceColor, hexFormat, hslFormat, rgbFormat;
      color = this.color.toString(this.active.type);
      hexFormat = atom.config.get('chrome-color-picker.HexColors.forceHexSize');
      rgbFormat = atom.config.get('chrome-color-picker.RgbColors.preferredFormat');
      hslFormat = atom.config.get('chrome-color-picker.HslColors.preferredFormat');
      hex3 = this.color.toString('hex3');
      colorName = this.color.toName();
      if (this.active.type === 'rgb' && rgbFormat !== 'standard') {
        color = this.color.toString(rgbFormat);
      }
      if (this.active.type === 'hsl' && hslFormat !== 'standard') {
        color = this.color.toString(hslFormat);
      }
      if (this.color.getAlpha() < 1 && atom.config.get('chrome-color-picker.General.autoShortColor')) {
        color = color.replace(RegExp(' ', 'g'), '');
        color = color.replace('0%', '0');
        color = color.replace('1.0', '1');
        color = color.replace('0.', '.');
      }
      if (this.active.type === 'hex' && atom.config.get('chrome-color-picker.HexColors.uppercaseHex')) {
        color = color.toUpperCase();
      }
      if (this.active.type === 'hex' && hexFormat) {
        hexForceColor = this.color.toString(hexFormat);
        if (hexForceColor) {
          color = hexForceColor;
        }
      }
      if (hex3 && atom.config.get('chrome-color-picker.HexColors.autoShortHex')) {
        color = hex3;
      }
      if (colorName && atom.config.get('chrome-color-picker.General.autoColorNames')) {
        color = colorName;
      }
      return color;
    };

    return Input;

  })(helper);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2NvcmUvSW5wdXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEscUJBQVIsQ0FEWixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRCQUFBLENBQUE7O0FBQUEsb0JBQUEsTUFBQSxHQUFRLEVBQVIsQ0FBQTs7QUFBQSxvQkFDQSxLQUFBLEdBQU8sSUFEUCxDQUFBOztBQUFBLG9CQUVBLEdBQUEsR0FBSyxJQUZMLENBQUE7O0FBQUEsb0JBR0EsR0FBQSxHQUFLLElBSEwsQ0FBQTs7QUFBQSxvQkFJQSxHQUFBLEdBQUssSUFKTCxDQUFBOztBQUFBLG9CQUtBLE9BQUEsR0FBUyxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsS0FBZixDQUxULENBQUE7O0FBQUEsb0JBT0EsTUFBQSxHQUFRLElBUFIsQ0FBQTs7QUFTQTtBQUFBOzs7Ozs7OztPQVRBOztBQWtCYSxJQUFBLGVBQUMsU0FBRCxHQUFBO0FBQ1gsVUFBQSxxQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLENBQUMsS0FBRCxDQUFWLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiLEVBQW9CLE9BQXBCLENBSFAsQ0FBQTtBQUFBLE1BSUEsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsSUFBQyxDQUFBLEdBQXZCLENBSkEsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxH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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/core/Input.coffee
