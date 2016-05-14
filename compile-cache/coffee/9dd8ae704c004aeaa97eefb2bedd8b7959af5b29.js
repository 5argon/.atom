(function() {
  var Point, TagParser;

  Point = require('atom').Point;

  module.exports = TagParser = (function() {
    function TagParser(tags, grammar) {
      this.tags = tags;
      this.grammar = grammar;
      if (this.grammar === 'source.c++' || this.grammar === 'source.c' || this.grammar === 'source.cpp') {
        this.splitSymbol = '::';
      } else {
        this.splitSymbol = '.';
      }
    }

    TagParser.prototype.splitParentTag = function(parentTag) {
      var index;
      index = parentTag.indexOf(':');
      return {
        type: parentTag.substr(0, index),
        parent: parentTag.substr(index + 1)
      };
    };

    TagParser.prototype.splitNameTag = function(nameTag) {
      var index;
      index = nameTag.lastIndexOf(this.splitSymbol);
      if (index >= 0) {
        return nameTag.substr(index + this.splitSymbol.length);
      } else {
        return nameTag;
      }
    };

    TagParser.prototype.buildMissedParent = function(parents) {
      var i, name, now, parentTags, pre, type, _i, _len, _ref, _ref1, _results;
      parentTags = Object.keys(parents);
      parentTags.sort((function(_this) {
        return function(a, b) {
          var nameA, nameB, typeA, typeB, _ref, _ref1;
          _ref = _this.splitParentTag(a), typeA = _ref.typeA, nameA = _ref.parent;
          _ref1 = _this.splitParentTag(b), typeB = _ref1.typeB, nameB = _ref1.parent;
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        };
      })(this));
      _results = [];
      for (i = _i = 0, _len = parentTags.length; _i < _len; i = ++_i) {
        now = parentTags[i];
        _ref = this.splitParentTag(now), type = _ref.type, name = _ref.parent;
        if (parents[now] === null) {
          parents[now] = {
            name: name,
            type: type,
            position: null,
            parent: null
          };
          this.tags.push(parents[now]);
          if (i >= 1) {
            pre = parentTags[i - 1];
            _ref1 = this.splitParentTag(pre), type = _ref1.type, name = _ref1.parent;
            if (now.indexOf(name) >= 0) {
              parents[now].parent = pre;
              _results.push(parents[now].name = this.splitNameTag(parents[now].name));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    TagParser.prototype.parse = function() {
      var key, parent, parents, roots, tag, type, types, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4;
      roots = [];
      parents = {};
      types = {};
      this.tags.sort((function(_this) {
        return function(a, b) {
          return a.position.row - b.position.row;
        };
      })(this));
      _ref = this.tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        if (tag.parent) {
          parents[tag.parent] = null;
        }
      }
      _ref1 = this.tags;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tag = _ref1[_j];
        if (tag.parent) {
          _ref2 = this.splitParentTag(tag.parent), type = _ref2.type, parent = _ref2.parent;
          key = tag.type + ':' + parent + this.splitSymbol + tag.name;
        } else {
          key = tag.type + ':' + tag.name;
        }
        parents[key] = tag;
      }
      this.buildMissedParent(parents);
      _ref3 = this.tags;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        tag = _ref3[_k];
        if (tag.parent) {
          parent = parents[tag.parent];
          if (!parent.position) {
            parent.position = new Point(tag.position.row - 1);
          }
        }
      }
      this.tags.sort((function(_this) {
        return function(a, b) {
          return a.position.row - b.position.row;
        };
      })(this));
      _ref4 = this.tags;
      for (_l = 0, _len3 = _ref4.length; _l < _len3; _l++) {
        tag = _ref4[_l];
        tag.label = tag.name;
        tag.icon = "icon-" + tag.type;
        if (tag.parent) {
          parent = parents[tag.parent];
          if (parent.children == null) {
            parent.children = [];
          }
          parent.children.push(tag);
        } else {
          roots.push(tag);
        }
        types[tag.type] = null;
      }
      return {
        root: {
          label: 'root',
          icon: null,
          children: roots
        },
        types: Object.keys(types)
      };
    };

    TagParser.prototype.getNearestTag = function(row) {
      var left, mid, midRow, nearest, right;
      left = 0;
      right = this.tags.length - 1;
      while (left <= right) {
        mid = Math.floor((left + right) / 2);
        midRow = this.tags[mid].position.row;
        if (row < midRow) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      nearest = left - 1;
      return this.tags[nearest];
    };

    return TagParser;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtdHJlZS12aWV3L2xpYi90YWctcGFyc2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxtQkFBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQURYLENBQUE7QUFJQSxNQUFBLElBQUcsSUFBQyxDQUFBLE9BQUQsS0FBWSxZQUFaLElBQTRCLElBQUMsQ0FBQSxPQUFELEtBQVksVUFBeEMsSUFDQSxJQUFDLENBQUEsT0FBRCxLQUFZLFlBRGY7QUFFRSxRQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBZixDQUZGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFmLENBSkY7T0FMVztJQUFBLENBQWI7O0FBQUEsd0JBV0EsY0FBQSxHQUFnQixTQUFDLFNBQUQsR0FBQTtBQUNkLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLENBQVIsQ0FBQTthQUVBO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsQ0FBakIsRUFBb0IsS0FBcEIsQ0FBTjtBQUFBLFFBQ0EsTUFBQSxFQUFRLFNBQVMsQ0FBQyxNQUFWLENBQWlCLEtBQUEsR0FBTSxDQUF2QixDQURSO1FBSGM7SUFBQSxDQVhoQixDQUFBOztBQUFBLHdCQWlCQSxZQUFBLEdBQWMsU0FBQyxPQUFELEdBQUE7QUFD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

//# sourceURL=/home/sargon/.atom/packages/symbols-tree-view/lib/tag-parser.coffee
