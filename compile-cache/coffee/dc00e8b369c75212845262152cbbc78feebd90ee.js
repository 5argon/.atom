(function() {
  var CompositeDisposable, Entry, fs, path, settings;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  settings = require('./settings');

  path = null;

  Entry = (function() {
    function Entry(editor, point, URI) {
      this.point = point;
      this.URI = URI;
      this.destroyed = false;
      if (!editor.isAlive()) {
        return;
      }
      this.editor = editor;
      this.subscriptions = new CompositeDisposable;
      this.marker = this.editor.markBufferPosition(this.point, {
        invalidate: 'never',
        persistent: false
      });
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function(_arg) {
          var newHeadBufferPosition;
          newHeadBufferPosition = _arg.newHeadBufferPosition;
          return _this.point = newHeadBufferPosition;
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.unSubscribe();
        };
      })(this)));
    }

    Entry.prototype.unSubscribe = function() {
      var _ref;
      this.subscriptions.dispose();
      return _ref = {}, this.editor = _ref.editor, this.subscriptions = _ref.subscriptions, _ref;
    };

    Entry.prototype.destroy = function() {
      var _ref, _ref1;
      if (this.editor != null) {
        this.unSubscribe();
      }
      this.destroyed = true;
      if ((_ref = this.marker) != null) {
        _ref.destroy();
      }
      return _ref1 = {}, this.point = _ref1.point, this.URI = _ref1.URI, this.marker = _ref1.marker, _ref1;
    };

    Entry.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Entry.prototype.setURI = function(URI) {
      this.URI = URI;
    };

    Entry.prototype.isValid = function() {
      var _ref;
      if (this.isDestroyed()) {
        return false;
      }
      if (settings.get('excludeClosedBuffer')) {
        return ((_ref = this.editor) != null ? _ref.isAlive() : void 0) && fs.existsSync(this.URI);
      } else {
        return fs.existsSync(this.URI);
      }
    };

    Entry.prototype.isAtSameRow = function(_arg) {
      var URI, point;
      URI = _arg.URI, point = _arg.point;
      if ((point != null) && (this.point != null)) {
        return (URI === this.URI) && (point.row === this.point.row);
      } else {
        return false;
      }
    };

    Entry.prototype.inspect = function() {
      var s;
      if (path == null) {
        path = require('path');
      }
      s = "" + this.point + ", " + (path.basename(this.URI));
      if (!this.isValid()) {
        s += ' [invalid]';
      }
      return s;
    };

    return Entry;

  })();

  module.exports = Entry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2N1cnNvci1oaXN0b3J5L2xpYi9lbnRyeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBVyxPQUFBLENBQVEsSUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLElBSFAsQ0FBQTs7QUFBQSxFQVFNO0FBQ1MsSUFBQSxlQUFDLE1BQUQsRUFBVSxLQUFWLEVBQWtCLEdBQWxCLEdBQUE7QUFDWCxNQURvQixJQUFDLENBQUEsUUFBQSxLQUNyQixDQUFBO0FBQUEsTUFENEIsSUFBQyxDQUFBLE1BQUEsR0FDN0IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxNQUFvQixDQUFDLE9BQVAsQ0FBQSxDQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFIVixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSmpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUEyQixJQUFDLENBQUEsS0FBNUIsRUFDUjtBQUFBLFFBQUEsVUFBQSxFQUFZLE9BQVo7QUFBQSxRQUNBLFVBQUEsRUFBWSxLQURaO09BRFEsQ0FMVixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FB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

//# sourceURL=/home/sargon/.atom/packages/cursor-history/lib/entry.coffee
