(function() {
  var $, $$, Emitter, ScrollView, TreeNode, TreeView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, ScrollView = _ref.ScrollView;

  Emitter = require('event-kit').Emitter;

  module.exports = {
    TreeNode: TreeNode = (function(_super) {
      __extends(TreeNode, _super);

      function TreeNode() {
        this.dblClickItem = __bind(this.dblClickItem, this);
        this.clickItem = __bind(this.clickItem, this);
        return TreeNode.__super__.constructor.apply(this, arguments);
      }

      TreeNode.content = function(_arg) {
        var children, icon, label;
        label = _arg.label, icon = _arg.icon, children = _arg.children;
        if (children) {
          return this.li({
            "class": 'list-nested-item list-selectable-item'
          }, (function(_this) {
            return function() {
              _this.div({
                "class": 'list-item'
              }, function() {
                return _this.span({
                  "class": "icon " + icon
                }, label);
              });
              return _this.ul({
                "class": 'list-tree'
              }, function() {
                var child, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = children.length; _i < _len; _i++) {
                  child = children[_i];
                  _results.push(_this.subview('child', new TreeNode(child)));
                }
                return _results;
              });
            };
          })(this));
        } else {
          return this.li({
            "class": 'list-item list-selectable-item'
          }, (function(_this) {
            return function() {
              return _this.span({
                "class": "icon " + icon
              }, label);
            };
          })(this));
        }
      };

      TreeNode.prototype.initialize = function(item) {
        this.emitter = new Emitter;
        this.item = item;
        this.item.view = this;
        this.on('dblclick', this.dblClickItem);
        return this.on('click', this.clickItem);
      };

      TreeNode.prototype.setCollapsed = function() {
        if (this.item.children) {
          return this.toggleClass('collapsed');
        }
      };

      TreeNode.prototype.setSelected = function() {
        return this.addClass('selected');
      };

      TreeNode.prototype.onDblClick = function(callback) {
        var child, _i, _len, _ref1, _results;
        this.emitter.on('on-dbl-click', callback);
        if (this.item.children) {
          _ref1 = this.item.children;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            _results.push(child.view.onDblClick(callback));
          }
          return _results;
        }
      };

      TreeNode.prototype.onSelect = function(callback) {
        var child, _i, _len, _ref1, _results;
        this.emitter.on('on-select', callback);
        if (this.item.children) {
          _ref1 = this.item.children;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            _results.push(child.view.onSelect(callback));
          }
          return _results;
        }
      };

      TreeNode.prototype.clickItem = function(event) {
        var $target, left, right, selected, width;
        if (this.item.children) {
          selected = this.hasClass('selected');
          this.removeClass('selected');
          $target = this.find('.list-item:first');
          left = $target.position().left;
          right = $target.children('span').position().left;
          width = right - left;
          if (event.offsetX <= width) {
            this.toggleClass('collapsed');
          }
          if (selected) {
            this.addClass('selected');
          }
          if (event.offsetX <= width) {
            return false;
          }
        }
        this.emitter.emit('on-select', {
          node: this,
          item: this.item
        });
        return false;
      };

      TreeNode.prototype.dblClickItem = function(event) {
        this.emitter.emit('on-dbl-click', {
          node: this,
          item: this.item
        });
        return false;
      };

      return TreeNode;

    })(View),
    TreeView: TreeView = (function(_super) {
      __extends(TreeView, _super);

      function TreeView() {
        this.sortByRow = __bind(this.sortByRow, this);
        this.sortByName = __bind(this.sortByName, this);
        this.toggleTypeVisible = __bind(this.toggleTypeVisible, this);
        this.traversal = __bind(this.traversal, this);
        this.onSelect = __bind(this.onSelect, this);
        return TreeView.__super__.constructor.apply(this, arguments);
      }

      TreeView.content = function() {
        return this.div({
          "class": '-tree-view-'
        }, (function(_this) {
          return function() {
            return _this.ul({
              "class": 'list-tree has-collapsable-children',
              outlet: 'root'
            });
          };
        })(this));
      };

      TreeView.prototype.initialize = function() {
        TreeView.__super__.initialize.apply(this, arguments);
        return this.emitter = new Emitter;
      };

      TreeView.prototype.deactivate = function() {
        return this.remove();
      };

      TreeView.prototype.onSelect = function(callback) {
        return this.emitter.on('on-select', callback);
      };

      TreeView.prototype.setRoot = function(root, ignoreRoot) {
        if (ignoreRoot == null) {
          ignoreRoot = true;
        }
        this.rootNode = new TreeNode(root);
        this.rootNode.onDblClick((function(_this) {
          return function(_arg) {
            var item, node;
            node = _arg.node, item = _arg.item;
            return node.setCollapsed();
          };
        })(this));
        this.rootNode.onSelect((function(_this) {
          return function(_arg) {
            var item, node;
            node = _arg.node, item = _arg.item;
            _this.clearSelect();
            node.setSelected();
            return _this.emitter.emit('on-select', {
              node: node,
              item: item
            });
          };
        })(this));
        this.root.empty();
        return this.root.append($$(function() {
          return this.div((function(_this) {
            return function() {
              var child, _i, _len, _ref1, _results;
              if (ignoreRoot) {
                _ref1 = root.children;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  child = _ref1[_i];
                  _results.push(_this.subview('child', child.view));
                }
                return _results;
              } else {
                return _this.subview('root', root.view);
              }
            };
          })(this));
        }));
      };

      TreeView.prototype.traversal = function(root, doing) {
        var child, _i, _len, _ref1, _results;
        doing(root.item);
        if (root.item.children) {
          _ref1 = root.item.children;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            child = _ref1[_i];
            _results.push(this.traversal(child.view, doing));
          }
          return _results;
        }
      };

      TreeView.prototype.toggleTypeVisible = function(type) {
        return this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            if (item.type === type) {
              return item.view.toggle();
            }
          };
        })(this));
      };

      TreeView.prototype.sortByName = function(ascending) {
        if (ascending == null) {
          ascending = true;
        }
        this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            var _ref1;
            return (_ref1 = item.children) != null ? _ref1.sort(function(a, b) {
              if (ascending) {
                return a.name.localeCompare(b.name);
              } else {
                return b.name.localeCompare(a.name);
              }
            }) : void 0;
          };
        })(this));
        return this.setRoot(this.rootNode.item);
      };

      TreeView.prototype.sortByRow = function(ascending) {
        if (ascending == null) {
          ascending = true;
        }
        this.traversal(this.rootNode, (function(_this) {
          return function(item) {
            var _ref1;
            return (_ref1 = item.children) != null ? _ref1.sort(function(a, b) {
              if (ascending) {
                return a.position.row - b.position.row;
              } else {
                return b.position.row - a.position.row;
              }
            }) : void 0;
          };
        })(this));
        return this.setRoot(this.rootNode.item);
      };

      TreeView.prototype.clearSelect = function() {
        return $('.list-selectable-item').removeClass('selected');
      };

      TreeView.prototype.select = function(item) {
        this.clearSelect();
        return item != null ? item.view.setSelected() : void 0;
      };

      return TreeView;

    })(ScrollView)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtdHJlZS12aWV3L2xpYi90cmVlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsWUFBQSxJQUFSLEVBQWMsa0JBQUEsVUFBZCxDQUFBOztBQUFBLEVBQ0MsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBZ0I7QUFDZCxpQ0FBQSxDQUFBOzs7Ozs7T0FBQTs7QUFBQSxNQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixZQUFBLHFCQUFBO0FBQUEsUUFEVSxhQUFBLE9BQU8sWUFBQSxNQUFNLGdCQUFBLFFBQ3ZCLENBQUE7QUFBQSxRQUFBLElBQUcsUUFBSDtpQkFDRSxJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sdUNBQVA7V0FBSixFQUFvRCxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUEsR0FBQTtBQUNsRCxjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sV0FBUDtlQUFMLEVBQXlCLFNBQUEsR0FBQTt1QkFDdkIsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGtCQUFBLE9BQUEsRUFBUSxPQUFBLEdBQU8sSUFBZjtpQkFBTixFQUE2QixLQUE3QixFQUR1QjtjQUFBLENBQXpCLENBQUEsQ0FBQTtxQkFFQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFdB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

//# sourceURL=/home/sargon/.atom/packages/symbols-tree-view/lib/tree-view.coffee
