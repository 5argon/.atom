(function() {
  var Base, Emitter, Motion, MoveToNextSymbol, MoveToPreviousSymbol, Point, TagGenerator, requireFrom, state, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  requireFrom = function(pack, path) {
    var packPath;
    packPath = atom.packages.resolvePackagePath(pack);
    return require("" + packPath + "/lib/" + path);
  };

  _ref = require('atom'), Emitter = _ref.Emitter, Point = _ref.Point;

  _ = require('underscore-plus');

  TagGenerator = requireFrom('symbols-view', 'tag-generator');

  Base = requireFrom('vim-mode-plus', 'base');

  Motion = Base.getClass('Motion');

  state = {};

  MoveToNextSymbol = (function(_super) {
    __extends(MoveToNextSymbol, _super);

    function MoveToNextSymbol() {
      return MoveToNextSymbol.__super__.constructor.apply(this, arguments);
    }

    MoveToNextSymbol.commandPrefix = 'vim-mode-plus-user';

    MoveToNextSymbol.prototype.direction = 'next';

    MoveToNextSymbol.prototype.requireInput = true;

    MoveToNextSymbol.prototype.initialize = function() {
      this.emitter = new Emitter;
      return this.getTags();
    };

    MoveToNextSymbol.prototype.onDidGenerateTags = function(fn) {
      return this.emitter.on('did-generate-tags', fn);
    };

    MoveToNextSymbol.prototype.getCachedTags = function() {
      return state.cachedTags;
    };

    MoveToNextSymbol.prototype.generateTags = function(fn) {
      var cache, filePath, scopeName;
      filePath = this.editor.getPath();
      scopeName = this.editor.getGrammar().scopeName;
      cache = this.getCachedTags();
      return new TagGenerator(filePath, scopeName).generate().then(function(tags) {
        cache[filePath] = tags;
        return fn(tags);
      });
    };

    MoveToNextSymbol.prototype.getTags = function() {
      var tags, _ref1;
      tags = (_ref1 = this.getCachedTags()[this.editor.getPath()]) != null ? _ref1.slice() : void 0;
      if (tags != null) {
        return this.input = tags;
      } else {
        return this.generateTags((function(_this) {
          return function(tags) {
            _this.input = tags;
            return _this.vimState.operationStack.process();
          };
        })(this));
      }
    };

    MoveToNextSymbol.prototype.detectRow = function(cursor) {
      var cursorRow, tags;
      tags = this.input.slice();
      if (this.direction === 'prev') {
        if (tags != null) {
          tags.reverse();
        }
      }
      cursorRow = cursor.getBufferRow();
      return _.detect(tags, (function(_this) {
        return function(tag) {
          var row;
          row = tag.position.row;
          switch (_this.direction) {
            case 'prev':
              return row < cursorRow;
            case 'next':
              return row > cursorRow;
          }
        };
      })(this));
    };

    MoveToNextSymbol.prototype.moveCursor = function(cursor) {
      return this.countTimes((function(_this) {
        return function() {
          var tag;
          if ((tag = _this.detectRow(cursor)) != null) {
            cursor.setBufferPosition(tag.position);
            return cursor.moveToFirstCharacterOfLine();
          }
        };
      })(this));
    };

    return MoveToNextSymbol;

  })(Motion);

  MoveToPreviousSymbol = (function(_super) {
    __extends(MoveToPreviousSymbol, _super);

    function MoveToPreviousSymbol() {
      return MoveToPreviousSymbol.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousSymbol.prototype.direction = 'prev';

    return MoveToPreviousSymbol;

  })(MoveToNextSymbol);

  module.exports = {
    state: state,
    MoveToNextSymbol: MoveToNextSymbol,
    MoveToPreviousSymbol: MoveToPreviousSymbol
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlLXBsdXMtbW92ZS10by1zeW1ib2xzL2xpYi9tb3ZlLXRvLXN5bWJvbHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ1osUUFBQSxRQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFpQyxJQUFqQyxDQUFYLENBQUE7V0FDQSxPQUFBLENBQVEsRUFBQSxHQUFHLFFBQUgsR0FBWSxPQUFaLEdBQW1CLElBQTNCLEVBRlk7RUFBQSxDQUFkLENBQUE7O0FBQUEsRUFJQSxPQUFtQixPQUFBLENBQVEsTUFBUixDQUFuQixFQUFDLGVBQUEsT0FBRCxFQUFVLGFBQUEsS0FKVixDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUxKLENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQWUsV0FBQSxDQUFZLGNBQVosRUFBNEIsZUFBNUIsQ0FQZixDQUFBOztBQUFBLEVBUUEsSUFBQSxHQUFPLFdBQUEsQ0FBWSxlQUFaLEVBQTZCLE1BQTdCLENBUlAsQ0FBQTs7QUFBQSxFQVVBLE1BQUEsR0FBUyxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsQ0FWVCxDQUFBOztBQUFBLEVBWUEsS0FBQSxHQUFRLEVBWlIsQ0FBQTs7QUFBQSxFQWNNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZ0JBQUMsQ0FBQSxhQUFELEdBQWdCLG9CQUFoQixDQUFBOztBQUFBLCtCQUNBLFNBQUEsR0FBVyxNQURYLENBQUE7O0FBQUEsK0JBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFBQSwr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

//# sourceURL=/home/sargon/.atom/packages/vim-mode-plus-move-to-symbols/lib/move-to-symbols.coffee
