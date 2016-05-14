(function() {
  var $, $$, SymbolsContextMenu, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View;

  module.exports = SymbolsContextMenu = (function(_super) {
    __extends(SymbolsContextMenu, _super);

    function SymbolsContextMenu() {
      return SymbolsContextMenu.__super__.constructor.apply(this, arguments);
    }

    SymbolsContextMenu.content = function() {
      return this.div({
        "class": 'symbols-context-menu'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'select-list popover-list'
          }, function() {
            _this.input({
              type: 'text',
              "class": 'hidden-input',
              outlet: 'hiddenInput'
            });
            return _this.ol({
              "class": 'list-group mark-active',
              outlet: 'menus'
            });
          });
        };
      })(this));
    };

    SymbolsContextMenu.prototype.initialize = function() {
      return this.hiddenInput.on('focusout', (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
    };

    SymbolsContextMenu.prototype.clear = function() {
      return this.menus.empty();
    };

    SymbolsContextMenu.prototype.addMenu = function(name, active, callback) {
      var menu;
      menu = $$(function() {
        return this.li({
          "class": (active ? 'active' : '')
        }, name);
      });
      menu.on('mousedown', (function(_this) {
        return function() {
          menu.toggleClass('active');
          _this.hiddenInput.blur();
          return callback(name);
        };
      })(this));
      return this.menus.append(menu);
    };

    SymbolsContextMenu.prototype.toggle = function(type) {
      var menu, _i, _len, _ref1, _results;
      _ref1 = this.menus.find('li');
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        menu = _ref1[_i];
        if ($(menu).text() === type) {
          _results.push($(menu).toggleClass('active'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SymbolsContextMenu.prototype.addSeparator = function() {
      return this.menus.append($$(function() {
        return this.li({
          "class": 'separator'
        });
      }));
    };

    SymbolsContextMenu.prototype.show = function() {
      if (this.menus.children().length > 0) {
        SymbolsContextMenu.__super__.show.apply(this, arguments);
        return this.hiddenInput.focus();
      }
    };

    SymbolsContextMenu.prototype.attach = function() {
      return atom.views.getView(atom.workspace).appendChild(this.element);
    };

    return SymbolsContextMenu;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtdHJlZS12aWV3L2xpYi9zeW1ib2xzLWNvbnRleHQtbWVudS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWdCLE9BQUEsQ0FBUSxzQkFBUixDQUFoQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGtCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxzQkFBUDtPQUFMLEVBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2xDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTywwQkFBUDtXQUFMLEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsY0FBYyxPQUFBLEVBQU8sY0FBckI7QUFBQSxjQUFxQyxNQUFBLEVBQVEsYUFBN0M7YUFBUCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsT0FBQSxFQUFPLHdCQUFQO0FBQUEsY0FBaUMsTUFBQSxFQUFRLE9BQXpDO2FBQUosRUFGc0M7VUFBQSxDQUF4QyxFQURrQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsaUNBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTth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

//# sourceURL=/home/sargon/.atom/packages/symbols-tree-view/lib/symbols-context-menu.coffee
