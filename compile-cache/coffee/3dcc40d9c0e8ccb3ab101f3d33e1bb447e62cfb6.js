(function() {
  var $, Point, Range, SymbolsContextMenu, SymbolsTreeView, TagGenerator, TagParser, TreeView, View, jQuery, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, jQuery = _ref1.jQuery, View = _ref1.View;

  TreeView = require('./tree-view').TreeView;

  TagGenerator = require('./tag-generator');

  TagParser = require('./tag-parser');

  SymbolsContextMenu = require('./symbols-context-menu');

  module.exports = SymbolsTreeView = (function(_super) {
    __extends(SymbolsTreeView, _super);

    function SymbolsTreeView() {
      return SymbolsTreeView.__super__.constructor.apply(this, arguments);
    }

    SymbolsTreeView.content = function() {
      return this.div({
        "class": 'symbols-tree-view tool-panel focusable-panel'
      });
    };

    SymbolsTreeView.prototype.initialize = function() {
      this.treeView = new TreeView;
      this.append(this.treeView);
      this.cachedStatus = {};
      this.contextMenu = new SymbolsContextMenu;
      this.autoHideTypes = atom.config.get('symbols-tree-view.zAutoHideTypes');
      this.treeView.onSelect((function(_this) {
        return function(_arg) {
          var bottom, desiredScrollCenter, desiredScrollTop, done, editor, from, height, item, left, node, screenPosition, screenRange, step, to, top, width, _ref2;
          node = _arg.node, item = _arg.item;
          if (item.position.row >= 0 && (editor = atom.workspace.getActiveTextEditor())) {
            screenPosition = editor.screenPositionForBufferPosition(item.position);
            screenRange = new Range(screenPosition, screenPosition);
            _ref2 = editor.pixelRectForScreenRange(screenRange), top = _ref2.top, left = _ref2.left, height = _ref2.height, width = _ref2.width;
            bottom = top + height;
            desiredScrollCenter = top + height / 2;
            if (!((editor.getScrollTop() < desiredScrollCenter && desiredScrollCenter < editor.getScrollBottom()))) {
              desiredScrollTop = desiredScrollCenter - editor.getHeight() / 2;
            }
            from = {
              top: editor.getScrollTop()
            };
            to = {
              top: desiredScrollTop
            };
            step = function(now) {
              return editor.setScrollTop(now);
            };
            done = function() {
              editor.scrollToBufferPosition(item.position, {
                center: true
              });
              editor.setCursorBufferPosition(item.position);
              return editor.moveToFirstCharacterOfLine();
            };
            return jQuery(from).animate(to, {
              duration: _this.animationDuration,
              step: step,
              done: done
            });
          }
        };
      })(this));
      atom.config.observe('symbols-tree-view.scrollAnimation', (function(_this) {
        return function(enabled) {
          return _this.animationDuration = enabled ? 300 : 0;
        };
      })(this));
      this.minimalWidth = 5;
      this.originalWidth = atom.config.get('symbols-tree-view.defaultWidth');
      return atom.config.observe('symbols-tree-view.autoHide', (function(_this) {
        return function(autoHide) {
          if (!autoHide) {
            return _this.width(_this.originalWidth);
          } else {
            return _this.width(_this.minimalWidth);
          }
        };
      })(this));
    };

    SymbolsTreeView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    SymbolsTreeView.prototype.getScopeName = function() {
      var _ref2, _ref3;
      return (_ref2 = atom.workspace.getActiveTextEditor()) != null ? (_ref3 = _ref2.getGrammar()) != null ? _ref3.scopeName : void 0 : void 0;
    };

    SymbolsTreeView.prototype.populate = function() {
      var editor, filePath;
      if (!(editor = this.getEditor())) {
        return this.hide();
      } else {
        filePath = editor.getPath();
        this.generateTags(filePath);
        this.show();
        this.onEditorSave = editor.onDidSave((function(_this) {
          return function(state) {
            filePath = editor.getPath();
            return _this.generateTags(filePath);
          };
        })(this));
        return this.onChangeRow = editor.onDidChangeCursorPosition((function(_this) {
          return function(_arg) {
            var newBufferPosition, oldBufferPosition;
            oldBufferPosition = _arg.oldBufferPosition, newBufferPosition = _arg.newBufferPosition;
            if (oldBufferPosition.row !== newBufferPosition.row) {
              return _this.focusCurrentCursorTag();
            }
          };
        })(this));
      }
    };

    SymbolsTreeView.prototype.focusCurrentCursorTag = function() {
      var editor, row, tag;
      if (editor = this.getEditor()) {
        row = editor.getCursorBufferPosition().row;
        tag = this.parser.getNearestTag(row);
        return this.treeView.select(tag);
      }
    };

    SymbolsTreeView.prototype.focusClickedTag = function(editor, text) {
      var t, tag;
      console.log("clicked: " + text);
      if (editor = this.getEditor()) {
        tag = ((function() {
          var _i, _len, _ref2, _results;
          _ref2 = this.parser.tags;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            t = _ref2[_i];
            if (t.name === text) {
              _results.push(t);
            }
          }
          return _results;
        }).call(this))[0];
        this.treeView.select(tag);
        return jQuery('.list-item.list-selectable-item.selected').click();
      }
    };

    SymbolsTreeView.prototype.updateContextMenu = function(types) {
      var editor, toggleSortByName, toggleTypeVisible, type, visible, _i, _j, _len, _len1, _ref2, _ref3, _ref4, _ref5;
      this.contextMenu.clear();
      editor = (_ref2 = this.getEditor()) != null ? _ref2.id : void 0;
      toggleTypeVisible = (function(_this) {
        return function(type) {
          _this.treeView.toggleTypeVisible(type);
          return _this.nowTypeStatus[type] = !_this.nowTypeStatus[type];
        };
      })(this);
      toggleSortByName = (function(_this) {
        return function() {
          var type, visible, _ref3;
          _this.nowSortStatus[0] = !_this.nowSortStatus[0];
          if (_this.nowSortStatus[0]) {
            _this.treeView.sortByName();
          } else {
            _this.treeView.sortByRow();
          }
          _ref3 = _this.nowTypeStatus;
          for (type in _ref3) {
            visible = _ref3[type];
            if (!visible) {
              _this.treeView.toggleTypeVisible(type);
            }
          }
          return _this.focusCurrentCursorTag();
        };
      })(this);
      if (this.cachedStatus[editor]) {
        _ref3 = this.cachedStatus[editor], this.nowTypeStatus = _ref3.nowTypeStatus, this.nowSortStatus = _ref3.nowSortStatus;
        _ref4 = this.nowTypeStatus;
        for (type in _ref4) {
          visible = _ref4[type];
          if (!visible) {
            this.treeView.toggleTypeVisible(type);
          }
        }
        if (this.nowSortStatus[0]) {
          this.treeView.sortByName();
        }
      } else {
        this.cachedStatus[editor] = {
          nowTypeStatus: {},
          nowSortStatus: [false]
        };
        for (_i = 0, _len = types.length; _i < _len; _i++) {
          type = types[_i];
          this.cachedStatus[editor].nowTypeStatus[type] = true;
        }
        this.sortByNameScopes = atom.config.get('symbols-tree-view.sortByNameScopes');
        if (this.sortByNameScopes.indexOf(this.getScopeName()) !== -1) {
          this.cachedStatus[editor].nowSortStatus[0] = true;
          this.treeView.sortByName();
        }
        _ref5 = this.cachedStatus[editor], this.nowTypeStatus = _ref5.nowTypeStatus, this.nowSortStatus = _ref5.nowSortStatus;
      }
      for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
        type = types[_j];
        this.contextMenu.addMenu(type, this.nowTypeStatus[type], toggleTypeVisible);
      }
      this.contextMenu.addSeparator();
      return this.contextMenu.addMenu('sort by name', this.nowSortStatus[0], toggleSortByName);
    };

    SymbolsTreeView.prototype.generateTags = function(filePath) {
      return new TagGenerator(filePath, this.getScopeName()).generate().done((function(_this) {
        return function(tags) {
          var root, type, types, _i, _len, _ref2, _results;
          _this.parser = new TagParser(tags, _this.getScopeName());
          _ref2 = _this.parser.parse(), root = _ref2.root, types = _ref2.types;
          _this.treeView.setRoot(root);
          _this.updateContextMenu(types);
          _this.focusCurrentCursorTag();
          if (_this.autoHideTypes) {
            _results = [];
            for (_i = 0, _len = types.length; _i < _len; _i++) {
              type = types[_i];
              if (_this.autoHideTypes.indexOf(type) !== -1) {
                _this.treeView.toggleTypeVisible(type);
                _results.push(_this.contextMenu.toggle(type));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this));
    };

    SymbolsTreeView.prototype.serialize = function() {};

    SymbolsTreeView.prototype.destroy = function() {
      return this.element.remove();
    };

    SymbolsTreeView.prototype.attach = function() {
      if (atom.config.get('tree-view.showOnRightSide')) {
        this.panel = atom.workspace.addLeftPanel({
          item: this
        });
      } else {
        this.panel = atom.workspace.addRightPanel({
          item: this
        });
      }
      this.contextMenu.attach();
      return this.contextMenu.hide();
    };

    SymbolsTreeView.prototype.attached = function() {
      this.onChangeEditor = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          _this.removeEventForEditor();
          return _this.populate();
        };
      })(this));
      this.onChangeAutoHide = atom.config.observe('symbols-tree-view.autoHide', (function(_this) {
        return function(autoHide) {
          if (!autoHide) {
            return _this.off('mouseenter mouseleave');
          } else {
            _this.mouseenter(function(event) {
              _this.stop();
              return _this.animate({
                width: _this.originalWidth
              }, {
                duration: _this.animationDuration
              });
            });
            return _this.mouseleave(function(event) {
              _this.stop();
              if (atom.config.get('tree-view.showOnRightSide')) {
                if (event.offsetX > 0) {
                  return _this.animate({
                    width: _this.minimalWidth
                  }, {
                    duration: _this.animationDuration
                  });
                }
              } else {
                if (event.offsetX <= 0) {
                  return _this.animate({
                    width: _this.minimalWidth
                  }, {
                    duration: _this.animationDuration
                  });
                }
              }
            });
          }
        };
      })(this));
      return this.on("contextmenu", (function(_this) {
        return function(event) {
          var left;
          left = event.pageX;
          if (left + _this.contextMenu.width() > atom.getSize().width) {
            left = left - _this.contextMenu.width();
          }
          _this.contextMenu.css({
            left: left,
            top: event.pageY
          });
          _this.contextMenu.show();
          return false;
        };
      })(this));
    };

    SymbolsTreeView.prototype.removeEventForEditor = function() {
      var _ref2, _ref3;
      if ((_ref2 = this.onEditorSave) != null) {
        _ref2.dispose();
      }
      return (_ref3 = this.onChangeRow) != null ? _ref3.dispose() : void 0;
    };

    SymbolsTreeView.prototype.detached = function() {
      var _ref2, _ref3;
      if ((_ref2 = this.onChangeEditor) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.onChangeAutoHide) != null) {
        _ref3.dispose();
      }
      this.removeEventForEditor();
      return this.off("contextmenu");
    };

    SymbolsTreeView.prototype.remove = function() {
      SymbolsTreeView.__super__.remove.apply(this, arguments);
      return this.panel.destroy();
    };

    SymbolsTreeView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.remove();
      } else {
        this.populate();
        return this.attach();
      }
    };

    SymbolsTreeView.prototype.showView = function() {
      if (!this.hasParent()) {
        this.populate();
        return this.attach();
      }
    };

    SymbolsTreeView.prototype.hideView = function() {
      if (this.hasParent()) {
        return this.remove();
      }
    };

    return SymbolsTreeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtdHJlZS12aWV3L2xpYi9zeW1ib2xzLXRyZWUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLENBQUE7O0FBQUEsRUFDQSxRQUFvQixPQUFBLENBQVEsc0JBQVIsQ0FBcEIsRUFBQyxVQUFBLENBQUQsRUFBSSxlQUFBLE1BQUosRUFBWSxhQUFBLElBRFosQ0FBQTs7QUFBQSxFQUVDLFdBQVksT0FBQSxDQUFRLGFBQVIsRUFBWixRQUZELENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUpaLENBQUE7O0FBQUEsRUFLQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FMckIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyw4Q0FBUDtPQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsOEJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxHQUFBLENBQUEsUUFBWixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxRQUFULENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFlBQUQs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

//# sourceURL=/home/sargon/.atom/packages/symbols-tree-view/lib/symbols-tree-view.coffee
