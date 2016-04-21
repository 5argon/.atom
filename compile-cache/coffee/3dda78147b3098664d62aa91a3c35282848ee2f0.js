(function() {
  var $, Disposable, HexView, ScrollView, entities, fs, path, zero, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  Disposable = require('atom').Disposable;

  path = require('path');

  fs = require('fs-plus');

  entities = null;

  module.exports = HexView = (function(_super) {
    __extends(HexView, _super);

    function HexView() {
      this.hex = __bind(this.hex, this);
      this.initialize = __bind(this.initialize, this);
      return HexView.__super__.constructor.apply(this, arguments);
    }

    HexView.content = function() {
      return this.div({
        "class": 'hex-view padded pane-item',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'hex-dump',
            outlet: 'hexDump'
          });
        };
      })(this));
    };

    HexView.prototype.initialize = function(_arg) {
      this.filePath = _arg.filePath;
      return HexView.__super__.initialize.apply(this, arguments);
    };

    HexView.prototype.attached = function() {
      if (entities == null) {
        entities = require('entities');
      }
      this.hexFile(this.filePath);
      return this.hexDump.css({
        'font-family': atom.config.get('editor.fontFamily'),
        'font-size': atom.config.get('editor.fontSize')
      });
    };

    HexView.prototype.hexFile = function(filePath) {
      var stream;
      stream = fs.ReadStream(filePath);
      return stream.on('data', (function(_this) {
        return function(chunk) {
          if (_this.hexDump.is(':empty')) {
            return _this.hex(chunk);
          }
        };
      })(this));
    };

    HexView.prototype.getPath = function() {
      return this.filePath;
    };

    HexView.prototype.getURI = function() {
      return this.filePath;
    };

    HexView.prototype.getTitle = function() {
      return "" + (path.basename(this.getPath())) + " Hex";
    };

    HexView.prototype.onDidChangeTitle = function() {
      return new Disposable();
    };

    HexView.prototype.onDidChangeModified = function() {
      return new Disposable();
    };

    HexView.prototype.hex = function(buffer) {
      var ascii, b, bytesPerLine, hex, i, j, last, lastBytes, offset, offsetLength, rows, v;
      bytesPerLine = atom.config.get('hex.bytesPerLine');
      rows = Math.ceil(buffer.length / bytesPerLine);
      last = buffer.length % bytesPerLine || bytesPerLine;
      offsetLength = buffer.length.toString(16).length;
      if (offsetLength < 6) {
        offsetLength = 6;
      }
      offset = "Offset:";
      hex = "";
      ascii = "";
      i = 0;
      while (i < bytesPerLine) {
        offset += " " + (zero(i, 2));
        i++;
      }
      b = 0;
      lastBytes = void 0;
      v = void 0;
      i = 0;
      while (i < rows) {
        hex += "" + (zero(b, offsetLength)) + ":";
        lastBytes = (i === rows - 1 ? last : bytesPerLine);
        j = 0;
        while (j < lastBytes) {
          hex += " " + (zero(buffer[b], 2));
          b++;
          j++;
        }
        b -= lastBytes;
        j = 0;
        while (j < lastBytes) {
          v = buffer[b];
          if ((v > 31 && v < 127) || v > 159) {
            ascii += entities.encodeHTML(String.fromCharCode(v));
          } else {
            ascii += ".";
          }
          b++;
          j++;
        }
        hex += "<br>";
        ascii += "<br>";
        i++;
      }
      this.hexDump.append("<header>" + offset + "</header>");
      this.hexDump.append("<div class=\"hex\">" + hex + "</div>");
      return this.hexDump.append("<div class=\"ascii\">" + ascii + "</div>");
    };

    return HexView;

  })(ScrollView);

  zero = function(n, max) {
    n = n.toString(16).toUpperCase();
    while (n.length < max) {
      n = "0" + n;
    }
    return n;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9oZXgvbGliL2hleC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBQUosQ0FBQTs7QUFBQSxFQUNDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQURELENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxJQUpYLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywyQkFBUDtBQUFBLFFBQW9DLFFBQUEsRUFBVSxDQUFBLENBQTlDO09BQUwsRUFBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDckQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFVBQVA7QUFBQSxZQUFtQixNQUFBLEVBQVEsU0FBM0I7V0FBTCxFQURxRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsc0JBSUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsTUFEWSxJQUFDLENBQUEsV0FBRixLQUFFLFFBQ2IsQ0FBQTthQUFBLHlD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

//# sourceURL=/Users/Sargon/.atom/packages/hex/lib/hex-view.coffee
