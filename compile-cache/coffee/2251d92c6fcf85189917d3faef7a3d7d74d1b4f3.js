(function() {
  var Entry, History, settings, _;

  _ = require('underscore-plus');

  Entry = require('./entry');

  settings = require('./settings');

  History = (function() {
    function History() {
      this.init();
    }

    History.prototype.init = function() {
      this.index = 0;
      return this.entries = [];
    };

    History.prototype.clear = function() {
      var e, _i, _len, _ref;
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e.destroy();
      }
      return this.init();
    };

    History.prototype.destroy = function() {
      var e, _i, _len, _ref, _ref1;
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        e.destroy();
      }
      return _ref1 = {}, this.index = _ref1.index, this.entries = _ref1.entries, _ref1;
    };

    History.prototype.isIndexAtHead = function() {
      return this.index === this.entries.length;
    };

    History.prototype.findIndex = function(direction, URI) {
      var entry, index, indexes, start, _i, _len, _ref;
      if (URI == null) {
        URI = null;
      }
      _ref = (function() {
        var _i, _j, _ref, _results, _results1;
        switch (direction) {
          case 'next':
            return [
              start = this.index + 1, (function() {
                _results = [];
                for (var _i = start, _ref = this.entries.length - 1; start <= _ref ? _i <= _ref : _i >= _ref; start <= _ref ? _i++ : _i--){ _results.push(_i); }
                return _results;
              }).apply(this)
            ];
          case 'prev':
            return [
              start = this.index - 1, (function() {
                _results1 = [];
                for (var _j = start; start <= 0 ? _j <= 0 : _j >= 0; start <= 0 ? _j++ : _j--){ _results1.push(_j); }
                return _results1;
              }).apply(this)
            ];
        }
      }).call(this), start = _ref[0], indexes = _ref[1];
      if (!((0 <= start && start <= (this.entries.length - 1)))) {
        return null;
      }
      for (_i = 0, _len = indexes.length; _i < _len; _i++) {
        index = indexes[_i];
        entry = this.entries[index];
        if (!entry.isValid()) {
          continue;
        }
        if (URI != null) {
          if (entry.URI === URI) {
            return index;
          }
        } else {
          return index;
        }
      }
    };

    History.prototype.get = function(direction, _arg) {
      var URI, index;
      URI = (_arg != null ? _arg : {}).URI;
      index = this.findIndex(direction, URI);
      if (index != null) {
        return this.entries[this.index = index];
      }
    };

    History.prototype.add = function(_arg, _arg1) {
      var URI, e, editor, newEntry, point, setIndexToHead, _i, _len, _ref;
      editor = _arg.editor, point = _arg.point, URI = _arg.URI;
      setIndexToHead = (_arg1 != null ? _arg1 : {}).setIndexToHead;
      newEntry = new Entry(editor, point, URI);
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.isAtSameRow(newEntry)) {
          e.destroy();
        }
      }
      this.entries.push(newEntry);
      if (setIndexToHead != null ? setIndexToHead : true) {
        this.removeEntries();
        return this.index = this.entries.length;
      }
    };

    History.prototype.removeEntries = function() {
      var e, removeCount, removed, _i, _j, _len, _len1, _ref, _results;
      _ref = this.entries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (!e.isValid()) {
          e.destroy();
        }
      }
      this.entries = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.entries;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          e = _ref1[_j];
          if (e.isValid()) {
            _results.push(e);
          }
        }
        return _results;
      }).call(this);
      removeCount = this.entries.length - settings.get('max');
      if (removeCount > 0) {
        removed = this.entries.splice(0, removeCount);
        _results = [];
        for (_j = 0, _len1 = removed.length; _j < _len1; _j++) {
          e = removed[_j];
          _results.push(e.destroy());
        }
        return _results;
      }
    };

    History.prototype.inspect = function(msg) {
      var ary, e, i, s;
      ary = (function() {
        var _i, _len, _ref, _results;
        _ref = this.entries;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          e = _ref[i];
          s = i === this.index ? "> " : "  ";
          _results.push("" + s + i + ": " + (e.inspect()));
        }
        return _results;
      }).call(this);
      if (this.index === this.entries.length) {
        ary.push("> " + this.index + ":");
      }
      return ary.join("\n");
    };

    return History;

  })();

  module.exports = History;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2N1cnNvci1oaXN0b3J5L2xpYi9oaXN0b3J5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEsaUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBRFc7SUFBQSxDQUFiOztBQUFBLHNCQUdBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBVCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUZQO0lBQUEsQ0FITixDQUFBOztBQUFBLHNCQU9BLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLGlCQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3FCQUFBO0FBQUEsUUFBQSxDQUFDLENBQUMsT0FBRixDQUFBLENBQUEsQ0FBQTtBQUFBLE9BQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBRks7SUFBQSxDQVBQLENBQUE7O0FBQUEsc0JBV0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsd0JBQUE7QUFBQTtBQUFBLFdBQUEsMkNBQUE7cUJBQUE7QUFBQSxRQUFBLENBQUMsQ0FBQyxPQUFGLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FBQTthQUNBLFFBQXFCLEVBQXJCLEVBQUMsSUFBQyxDQUFBLGNBQUEsS0FBRixFQUFTLElBQUMsQ0FBQSxnQkFBQSxPQUFWLEVBQUEsTUFG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

//# sourceURL=/home/sargon/.atom/packages/cursor-history/lib/history.coffee
