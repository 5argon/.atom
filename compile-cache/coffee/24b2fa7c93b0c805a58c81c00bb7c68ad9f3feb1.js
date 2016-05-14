(function() {
  var ColorMatchers, TinyColor,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ColorMatchers = require('./TinyColor/ColorMatchers');

  module.exports = TinyColor = (function(_super) {
    __extends(TinyColor, _super);

    TinyColor.prototype.tinyCounter = 0;

    TinyColor.prototype.names = {
      aliceblue: 'f0f8ff',
      antiquewhite: 'faebd7',
      aqua: '0ff',
      aquamarine: '7fffd4',
      azure: 'f0ffff',
      beige: 'f5f5dc',
      bisque: 'ffe4c4',
      black: '000',
      blanchedalmond: 'ffebcd',
      blue: '00f',
      blueviolet: '8a2be2',
      brown: 'a52a2a',
      burlywood: 'deb887',
      burntsienna: 'ea7e5d',
      cadetblue: '5f9ea0',
      chartreuse: '7fff00',
      chocolate: 'd2691e',
      coral: 'ff7f50',
      cornflowerblue: '6495ed',
      cornsilk: 'fff8dc',
      crimson: 'dc143c',
      cyan: '0ff',
      darkblue: '00008b',
      darkcyan: '008b8b',
      darkgoldenrod: 'b8860b',
      darkgray: 'a9a9a9',
      darkgreen: '006400',
      darkgrey: 'a9a9a9',
      darkkhaki: 'bdb76b',
      darkmagenta: '8b008b',
      darkolivegreen: '556b2f',
      darkorange: 'ff8c00',
      darkorchid: '9932cc',
      darkred: '8b0000',
      darksalmon: 'e9967a',
      darkseagreen: '8fbc8f',
      darkslateblue: '483d8b',
      darkslategray: '2f4f4f',
      darkslategrey: '2f4f4f',
      darkturquoise: '00ced1',
      darkviolet: '9400d3',
      deeppink: 'ff1493',
      deepskyblue: '00bfff',
      dimgray: '696969',
      dimgrey: '696969',
      dodgerblue: '1e90ff',
      firebrick: 'b22222',
      floralwhite: 'fffaf0',
      forestgreen: '228b22',
      fuchsia: 'f0f',
      gainsboro: 'dcdcdc',
      ghostwhite: 'f8f8ff',
      gold: 'ffd700',
      goldenrod: 'daa520',
      gray: '808080',
      green: '008000',
      greenyellow: 'adff2f',
      grey: '808080',
      honeydew: 'f0fff0',
      hotpink: 'ff69b4',
      indianred: 'cd5c5c',
      indigo: '4b0082',
      ivory: 'fffff0',
      khaki: 'f0e68c',
      lavender: 'e6e6fa',
      lavenderblush: 'fff0f5',
      lawngreen: '7cfc00',
      lemonchiffon: 'fffacd',
      lightblue: 'add8e6',
      lightcoral: 'f08080',
      lightcyan: 'e0ffff',
      lightgoldenrodyellow: 'fafad2',
      lightgray: 'd3d3d3',
      lightgreen: '90ee90',
      lightgrey: 'd3d3d3',
      lightpink: 'ffb6c1',
      lightsalmon: 'ffa07a',
      lightseagreen: '20b2aa',
      lightskyblue: '87cefa',
      lightslategray: '789',
      lightslategrey: '789',
      lightsteelblue: 'b0c4de',
      lightyellow: 'ffffe0',
      lime: '0f0',
      limegreen: '32cd32',
      linen: 'faf0e6',
      magenta: 'f0f',
      maroon: '800000',
      mediumaquamarine: '66cdaa',
      mediumblue: '0000cd',
      mediumorchid: 'ba55d3',
      mediumpurple: '9370db',
      mediumseagreen: '3cb371',
      mediumslateblue: '7b68ee',
      mediumspringgreen: '00fa9a',
      mediumturquoise: '48d1cc',
      mediumvioletred: 'c71585',
      midnightblue: '191970',
      mintcream: 'f5fffa',
      mistyrose: 'ffe4e1',
      moccasin: 'ffe4b5',
      navajowhite: 'ffdead',
      navy: '000080',
      oldlace: 'fdf5e6',
      olive: '808000',
      olivedrab: '6b8e23',
      orange: 'ffa500',
      orangered: 'ff4500',
      orchid: 'da70d6',
      palegoldenrod: 'eee8aa',
      palegreen: '98fb98',
      paleturquoise: 'afeeee',
      palevioletred: 'db7093',
      papayawhip: 'ffefd5',
      peachpuff: 'ffdab9',
      peru: 'cd853f',
      pink: 'ffc0cb',
      plum: 'dda0dd',
      powderblue: 'b0e0e6',
      purple: '800080',
      rebeccapurple: '663399',
      red: 'f00',
      rosybrown: 'bc8f8f',
      royalblue: '4169e1',
      saddlebrown: '8b4513',
      salmon: 'fa8072',
      sandybrown: 'f4a460',
      seagreen: '2e8b57',
      seashell: 'fff5ee',
      sienna: 'a0522d',
      silver: 'c0c0c0',
      skyblue: '87ceeb',
      slateblue: '6a5acd',
      slategray: '708090',
      slategrey: '708090',
      snow: 'fffafa',
      springgreen: '00ff7f',
      steelblue: '4682b4',
      tan: 'd2b48c',
      teal: '008080',
      thistle: 'd8bfd8',
      tomato: 'ff6347',
      turquoise: '40e0d0',
      violet: 'ee82ee',
      wheat: 'f5deb3',
      white: 'fff',
      whitesmoke: 'f5f5f5',
      yellow: 'ff0',
      yellowgreen: '9acd32'
    };

    TinyColor.prototype.hexNames = [];

    function TinyColor(color, opts) {
      var rgb;
      if (color == null) {
        color = '';
      }
      if (opts == null) {
        opts = {};
      }
      if (color instanceof TinyColor) {
        return color;
      }
      if (!(this instanceof TinyColor)) {
        return new TinyColor(color, opts);
      }
      this.hexNames = this.flip(this.names);
      rgb = this.inputToRGB(color);
      this._originalInput = color;
      this._r = rgb.r;
      this._g = rgb.g;
      this._b = rgb.b;
      this._a = rgb.a;
      this._roundA = Math.round(100 * this._a) / 100;
      this._format = opts.format || rgb.format;
      this._gradientType = opts.gradientType;
      if (this._r < 1) {
        this._r = Math.round(this._r);
      }
      if (this._g < 1) {
        this._g = Math.round(this._g);
      }
      if (this._b < 1) {
        this._b = Math.round(this._b);
      }
      this._ok = rgb.ok;
      this._tc_id = this.tinyCounter++;
      return;
    }

    TinyColor.prototype.fromRatio = function(color, opts) {
      var i, newColor;
      if (typeof color === 'object') {
        newColor = {};
        for (i in color) {
          if (color.hasOwnProperty(i)) {
            if (i === 'a') {
              newColor[i] = color[i];
            } else {
              newColor[i] = this.convertToPercentage(color[i]);
            }
          }
        }
        color = newColor;
      }
      return TinyColor(color, opts);
    };

    TinyColor.prototype.inputToRGB = function(color) {
      var a, format, ok, rgb;
      rgb = {
        r: 0,
        g: 0,
        b: 0
      };
      a = 1;
      ok = false;
      format = false;
      if (typeof color === 'string') {
        color = this.stringInputToObject(color);
      }
      if (typeof color === 'object') {
        if (this.isValidCSSUnit(color.r) && this.isValidCSSUnit(color.g) && this.isValidCSSUnit(color.b)) {
          rgb = this.rgbToRgb(color.r, color.g, color.b);
          ok = true;
          format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        } else if (this.isValidCSSUnit(color.h) && this.isValidCSSUnit(color.s) && this.isValidCSSUnit(color.v)) {
          color.s = this.convertToPercentage(color.s);
          color.v = this.convertToPercentage(color.v);
          rgb = this.hsvToRgb(color.h, color.s, color.v);
          ok = true;
          format = 'hsv';
        } else if (this.isValidCSSUnit(color.h) && this.isValidCSSUnit(color.s) && this.isValidCSSUnit(color.l)) {
          color.s = this.convertToPercentage(color.s);
          color.l = this.convertToPercentage(color.l);
          rgb = this.hslToRgb(color.h, color.s, color.l);
          ok = true;
          format = 'hsl';
        }
        if (color.hasOwnProperty('a')) {
          a = color.a;
        }
      }
      a = this.boundAlpha(a);
      return {
        ok: ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a: a
      };
    };

    TinyColor.prototype.rgbToRgb = function(r, g, b) {
      return {
        r: this.bound01(r, 255) * 255,
        g: this.bound01(g, 255) * 255,
        b: this.bound01(b, 255) * 255
      };
    };

    TinyColor.prototype.rgbToHsl = function(r, g, b) {
      var d, h, l, max, min, s;
      r = this.bound01(r, 255);
      g = this.bound01(g, 255);
      b = this.bound01(b, 255);
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = void 0;
      s = void 0;
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return {
        h: h,
        s: s,
        l: l
      };
    };

    TinyColor.prototype.hslToRgb = function(h, s, l) {
      var b, g, p, q, r;
      r = void 0;
      g = void 0;
      b = void 0;
      h = this.bound01(h, 360);
      s = this.bound01(s, 100);
      l = this.bound01(l, 100);
      if (s === 0) {
        r = g = b = l;
      } else {
        q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
        p = 2 * l - q;
        r = this.hue2rgb(p, q, h + 1 / 3);
        g = this.hue2rgb(p, q, h);
        b = this.hue2rgb(p, q, h - (1 / 3));
      }
      return {
        r: r * 255,
        g: g * 255,
        b: b * 255
      };
    };

    TinyColor.prototype.hue2rgb = function(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };

    TinyColor.prototype.rgbToHsv = function(r, g, b) {
      var d, h, max, min, s, v;
      r = this.bound01(r, 255);
      g = this.bound01(g, 255);
      b = this.bound01(b, 255);
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = void 0;
      s = void 0;
      v = max;
      d = max - min;
      s = max === 0 ? 0 : d / max;
      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return {
        h: h,
        s: s,
        v: v
      };
    };

    TinyColor.prototype.hsvToRgb = function(h, s, v) {
      var b, f, g, i, mod, p, q, r, t;
      h = this.bound01(h, 360) * 6;
      s = this.bound01(s, 100);
      v = this.bound01(v, 100);
      i = Math.floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - (f * s));
      t = v * (1 - ((1 - f) * s));
      mod = i % 6;
      r = [v, q, p, p, t, v][mod];
      g = [t, v, v, q, p, p][mod];
      b = [p, p, t, v, v, q][mod];
      return {
        r: r * 255,
        g: g * 255,
        b: b * 255
      };
    };

    TinyColor.prototype.rgbToHex = function(r, g, b, allow3Char) {
      var hex;
      hex = [this.pad2(Math.round(r).toString(16)), this.pad2(Math.round(g).toString(16)), this.pad2(Math.round(b).toString(16))];
      if (allow3Char && hex[0].charAt(0) === hex[0].charAt(1) && hex[1].charAt(0) === hex[1].charAt(1) && hex[2].charAt(0) === hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
      }
      return hex.join('');
    };

    TinyColor.prototype.rgbaToHex = function(r, g, b, a) {
      var hex;
      hex = [this.pad2(this.convertDecimalToHex(a)), this.pad2(Math.round(r).toString(16)), this.pad2(Math.round(g).toString(16)), this.pad2(Math.round(b).toString(16))];
      return hex.join('');
    };

    TinyColor.prototype.flip = function(o) {
      var flipped, i;
      flipped = {};
      for (i in o) {
        if (o.hasOwnProperty(i)) {
          flipped[o[i]] = i;
        }
      }
      return flipped;
    };

    TinyColor.prototype.boundAlpha = function(a) {
      a = parseFloat(a);
      if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
      }
      return a;
    };

    TinyColor.prototype.bound01 = function(n, max) {
      var processPercent;
      if (this.isOnePointZero(n)) {
        n = '100%';
      }
      processPercent = this.isPercentage(n);
      n = Math.min(max, Math.max(0, parseFloat(n)));
      if (processPercent) {
        n = parseInt(n * max, 10) / 100;
      }
      if (Math.abs(n - max) < 0.000001) {
        return 1;
      }
      return n % max / parseFloat(max);
    };

    TinyColor.prototype.clamp01 = function(val) {
      return Math.min(1, Math.max(0, val));
    };

    TinyColor.prototype.parseIntFromHex = function(val) {
      return parseInt(val, 16);
    };

    TinyColor.prototype.isOnePointZero = function(n) {
      return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
    };

    TinyColor.prototype.isPercentage = function(n) {
      return typeof n === 'string' && n.indexOf('%') !== -1;
    };

    TinyColor.prototype.pad2 = function(c) {
      if (c.length === 1) {
        return "0" + c;
      } else {
        return "" + c;
      }
    };

    TinyColor.prototype.convertToPercentage = function(n) {
      if (n <= 1) {
        n = "" + (n * 100) + "%";
      }
      return n;
    };

    TinyColor.prototype.convertDecimalToHex = function(d) {
      return Math.round(parseFloat(d) * 255).toString(16);
    };

    TinyColor.prototype.convertHexToDecimal = function(h) {
      return this.parseIntFromHex(h) / 255;
    };

    TinyColor.prototype.isValidCSSUnit = function(color) {
      return !!this.matchers.CSS_UNIT.exec(color);
    };

    TinyColor.prototype.stringInputToObject = function(color) {
      var match, named;
      color = color.replace(/^\s+/, '').replace(/\s+$/, '').toLowerCase();
      named = false;
      if (this.names[color]) {
        color = this.names[color];
        named = true;
      } else if (color === 'transparent') {
        return {
          r: 0,
          g: 0,
          b: 0,
          a: 0,
          format: 'name'
        };
      }
      match = void 0;
      if (match = this.matchers.rgb.exec(color)) {
        return {
          r: match[1],
          g: match[2],
          b: match[3]
        };
      }
      if (match = this.matchers.rgba.exec(color)) {
        return {
          r: match[1],
          g: match[2],
          b: match[3],
          a: match[4]
        };
      }
      if (match = this.matchers.hsl.exec(color)) {
        return {
          h: match[1],
          s: match[2],
          l: match[3]
        };
      }
      if (match = this.matchers.hsla.exec(color)) {
        return {
          h: match[1],
          s: match[2],
          l: match[3],
          a: match[4]
        };
      }
      if (match = this.matchers.hsv.exec(color)) {
        return {
          h: match[1],
          s: match[2],
          v: match[3]
        };
      }
      if (match = this.matchers.hsva.exec(color)) {
        return {
          h: match[1],
          s: match[2],
          v: match[3],
          a: match[4]
        };
      }
      if (match = this.matchers.hex8.exec(color)) {
        return {
          a: this.convertHexToDecimal(match[1]),
          r: this.parseIntFromHex(match[2]),
          g: this.parseIntFromHex(match[3]),
          b: this.parseIntFromHex(match[4]),
          format: named ? 'name' : 'hex8'
        };
      }
      if (match = this.matchers.hex6.exec(color)) {
        return {
          r: this.parseIntFromHex(match[1]),
          g: this.parseIntFromHex(match[2]),
          b: this.parseIntFromHex(match[3]),
          format: named ? 'name' : 'hex'
        };
      }
      if (match = this.matchers.hex3.exec(color)) {
        return {
          r: this.parseIntFromHex(match[1] + '' + match[1]),
          g: this.parseIntFromHex(match[2] + '' + match[2]),
          b: this.parseIntFromHex(match[3] + '' + match[3]),
          format: named ? 'name' : 'hex'
        };
      }
      return false;
    };

    TinyColor.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };

    TinyColor.prototype.isLight = function() {
      return !this.isDark();
    };

    TinyColor.prototype.isValid = function() {
      return this._ok;
    };

    TinyColor.prototype.getOriginalInput = function() {
      return this._originalInput;
    };

    TinyColor.prototype.getFormat = function() {
      return this._format;
    };

    TinyColor.prototype.getAlpha = function() {
      return this._a;
    };

    TinyColor.prototype.getBrightness = function() {
      var rgb;
      rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    };

    TinyColor.prototype.getLuminance = function() {
      var B, BsRGB, G, GsRGB, R, RsRGB, rgb;
      rgb = this.toRgb();
      RsRGB = void 0;
      GsRGB = void 0;
      BsRGB = void 0;
      R = void 0;
      G = void 0;
      B = void 0;
      RsRGB = rgb.r / 255;
      GsRGB = rgb.g / 255;
      BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };

    TinyColor.prototype.setAlpha = function(value) {
      this._a = this.boundAlpha(value);
      this._roundA = Math.round(100 * this._a) / 100;
      return this;
    };

    TinyColor.prototype.toHsv = function() {
      var hsv;
      hsv = this.rgbToHsv(this._r, this._g, this._b);
      return {
        h: hsv.h * 360,
        s: hsv.s,
        v: hsv.v,
        a: this._a
      };
    };

    TinyColor.prototype.toHsvString = function() {
      var h, hsv, s, v;
      hsv = this.rgbToHsv(this._r, this._g, this._b);
      h = Math.round(hsv.h * 360);
      s = Math.round(hsv.s * 100);
      v = Math.round(hsv.v * 100);
      if (this._a === 1) {
        return "hsv(" + h + ", " + s + "%, " + v + "%)";
      } else {
        return "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
      }
    };

    TinyColor.prototype.toHsl = function() {
      var hsl;
      hsl = this.rgbToHsl(this._r, this._g, this._b);
      return {
        h: hsl.h * 360,
        s: hsl.s,
        l: hsl.l,
        a: this._a
      };
    };

    TinyColor.prototype.toHslString = function() {
      var h, hsl, l, s;
      hsl = this.rgbToHsl(this._r, this._g, this._b);
      h = Math.round(hsl.h * 360);
      s = Math.round(hsl.s * 100);
      l = Math.round(hsl.l * 100);
      if (this._a === 1) {
        return "hsl(" + h + ", " + s + "%, " + l + "%)";
      } else {
        return "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
      }
    };

    TinyColor.prototype.toRatioHslString = function() {
      var h, hsl, l, s;
      hsl = this.rgbToHsl(this._r, this._g, this._b);
      h = Math.round(hsl.h * 360);
      s = Math.round(hsl.s);
      l = Math.round(hsl.l);
      if (this._a === 1) {
        return "hsl(" + h + ", " + s + ", " + l + ")";
      } else {
        return "hsla(" + h + ", " + s + ", " + l + ", " + this._roundA + ")";
      }
    };

    TinyColor.prototype.toHex = function(allow3Char) {
      return this.rgbToHex(this._r, this._g, this._b, allow3Char);
    };

    TinyColor.prototype.toHexString = function(allow3Char) {
      return "#" + (this.toHex(allow3Char));
    };

    TinyColor.prototype.toHex8 = function() {
      return this.rgbaToHex(this._r, this._g, this._b, this._a);
    };

    TinyColor.prototype.toHex8String = function() {
      return "#" + (this.toHex8());
    };

    TinyColor.prototype.toRgb = function() {
      var b, c_b, c_g, c_r;
      c_r = Math.round(this._r);
      c_g = Math.round(this._g);
      c_b = Math.round(this._b);
      if (c_r > 255) {
        c_r = 255;
      }
      if (c_g > 255) {
        c_g = 255;
      }
      if (c_b > 255) {
        c_(b = 255);
      }
      return {
        r: c_r,
        g: c_g,
        b: c_b,
        a: this._a
      };
    };

    TinyColor.prototype.toRgbString = function() {
      if (this._a === 1) {
        return "rgb(" + (Math.round(this._r)) + ", " + (Math.round(this._g)) + ", " + (Math.round(this._b)) + ")";
      } else {
        return "rgba(" + (Math.round(this._r)) + ", " + (Math.round(this._g)) + ", " + (Math.round(this._b)) + ", " + this._roundA + ")";
      }
    };

    TinyColor.prototype.toPercentageRgb = function() {
      return {
        r: "" + (Math.round(this.bound01(this._r, 255) * 100)) + "%",
        g: "" + (Math.round(this.bound01(this._g, 255) * 100)) + "%",
        b: "" + (Math.round(this.bound01(this._b, 255) * 100)) + "%",
        a: this._a
      };
    };

    TinyColor.prototype.toPercentageRgbString = function() {
      if (this._a === 1) {
        return "rgb(" + (Math.round(this.bound01(this._r, 255) * 100)) + "%, " + (Math.round(this.bound01(this._g, 255) * 100)) + "%, " + (Math.round(this.bound01(this._b, 255) * 100)) + "%)";
      } else {
        return "rgba(" + (Math.round(this.bound01(this._r, 255) * 100)) + "%, " + (Math.round(this.bound01(this._g, 255) * 100)) + "%, " + (Math.round(this.bound01(this._b, 255) * 100)) + "%, " + this._roundA + ")";
      }
    };

    TinyColor.prototype.toRatioRgbString = function() {
      if (this._a === 1) {
        return "rgb(" + (Math.round(this.bound01(this._r, 255))) + ", " + (Math.round(this.bound01(this._g, 255))) + ", " + (Math.round(this.bound01(this._b, 255))) + ")";
      } else {
        return "rgba(" + (Math.round(this.bound01(this._r, 255))) + ", " + (Math.round(this.bound01(this._g, 255))) + ", " + (Math.round(this.bound01(this._b, 255))) + ", " + this._roundA + ")";
      }
    };

    TinyColor.prototype.toName = function() {
      if (this._a === 0) {
        return 'transparent';
      }
      if (this._a < 1) {
        return false;
      }
      return this.hexNames[this.rgbToHex(this._r, this._g, this._b, true)] || false;
    };

    TinyColor.prototype.toString = function(format) {
      var formatSet, formattedString, hasAlpha, needsAlphaFormat;
      formatSet = !!format;
      format = format || this._format;
      formattedString = false;
      hasAlpha = this._a < 1 && this._a >= 0;
      needsAlphaFormat = !formatSet && hasAlpha && (format === 'hex' || format === 'hex6' || format === 'hex3' || format === 'name');
      if (needsAlphaFormat) {
        if (format === 'name' && this._a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === 'rgb') {
        formattedString = this.toRgbString();
      }
      if (format === 'prgb') {
        formattedString = this.toPercentageRgbString();
      }
      if (format === 'rrgb') {
        formattedString = this.toRatioRgbString();
      }
      if (format === 'hex' || format === 'hex6') {
        formattedString = this.toHexString();
      }
      if (format === 'hex3') {
        formattedString = this.toHexString(true);
      }
      if (format === 'hex8') {
        formattedString = this.toHex8String();
      }
      if (format === 'name') {
        formattedString = this.toName();
      }
      if (format === 'hsl') {
        formattedString = this.toHslString();
      }
      if (format === 'rhsl') {
        formattedString = this.toRatioHslString();
      }
      if (format === 'hsv') {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };

    TinyColor.prototype.clone = function() {
      return TinyColor(this.toString());
    };

    TinyColor.prototype.random = function() {
      return this.fromRatio({
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
      });
    };

    TinyColor.prototype.equals = function(color1, color2) {
      if (!color1 || !color2) {
        return false;
      }
      return TinyColor(color1).toRgbString() === TinyColor(color2).toRgbString();
    };

    return TinyColor;

  })(ColorMatchers);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9UaW55Q29sb3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSwyQkFBUixDQUFoQixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGdDQUFBLENBQUE7O0FBQUEsd0JBQUEsV0FBQSxHQUFhLENBQWIsQ0FBQTs7QUFBQSx3QkFJQSxLQUFBLEdBQU87QUFBQSxNQUNMLFNBQUEsRUFBVyxRQUROO0FBQUEsTUFFTCxZQUFBLEVBQWMsUUFGVDtBQUFBLE1BR0wsSUFBQSxFQUFNLEtBSEQ7QUFBQSxNQUlMLFVBQUEsRUFBWSxRQUpQO0FBQUEsTUFLTCxLQUFBLEVBQU8sUUFMRjtBQUFBLE1BTUwsS0FBQSxFQUFPLFFBTkY7QUFBQSxNQU9MLE1BQUEsRUFBUSxRQVBIO0FBQUEsTUFRTCxLQUFBLEVBQU8sS0FSRjtBQUFBLE1BU0wsY0FBQSxFQUFnQixRQVRYO0FBQUEsTUFVTCxJQUFBLEVBQU0sS0FWRDtBQUFBLE1BV0wsVUFBQSxFQUFZLFFBWFA7QUFBQSxNQVlMLEtBQUEsRUFBTyxRQVpGO0FBQUEsTUFhTCxTQUFBLEVBQVcsUUFiTjtBQUFBLE1BY0wsV0FBQSxFQUFhLFFBZFI7QUFBQSxNQWVMLFNBQUEsRUFBVyxRQWZOO0FBQUEsTUFnQkwsVUFBQSxFQUFZLFFBaEJQO0FBQUEsTUFpQkwsU0FBQSxFQUFXLFFBakJOO0FBQUEsTUFrQkwsS0FBQSxFQUFPLFFBbEJGO0FBQUEsTUFtQkwsY0FBQSxFQUFnQixRQW5CWDtBQUFBLE1Bb0JMLFFBQUEsRUFBVSxRQXBCTDtBQUFBLE1BcUJMLE9B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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/TinyColor.coffee
