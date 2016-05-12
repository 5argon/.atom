(function() {
  var SelectListView, SymbolsListView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  SelectListView = require('atom-space-pen-views').SelectListView;

  module.exports = SymbolsListView = (function(_super) {
    __extends(SymbolsListView, _super);

    function SymbolsListView(serializedState) {
      SymbolsListView.__super__.constructor.apply(this, arguments);
      this.addClass('symbols-list');
      this.setItems([]);
    }

    SymbolsListView.prototype.items = [];

    SymbolsListView.prototype.callOnConfirm = null;

    SymbolsListView.prototype.viewForItem = function(item) {
      return "<li class='full-menu list-tree'>" + ("<span class='pastille list-item-" + item.type + "'></span>") + ("<span class='list-item'>" + item.label + "</span>") + "</li>";
    };

    SymbolsListView.prototype.confirmed = function(item) {
      if ((item.objet != null) && (this.callOnConfirm != null)) {
        return this.callOnConfirm(item.range);
      }
    };

    SymbolsListView.prototype.cleanItems = function() {
      this.items = [];
      return this.setItems(this.items);
    };

    SymbolsListView.prototype.getFilterKey = function() {
      return "label";
    };

    SymbolsListView.prototype.addItem = function(item) {
      this.items.push(item);
      return this.setItems(this.items);
    };

    SymbolsListView.prototype.sortItems = function() {
      this.items.sort(function(a, b) {
        var _ref, _ref1;
        return ((_ref = a.range) != null ? _ref.start.row : void 0) - ((_ref1 = b.range) != null ? _ref1.start.row : void 0);
      });
      return this.setItems(this.items);
    };

    SymbolsListView.prototype.serialize = function() {};

    SymbolsListView.prototype.destroy = function() {
      return this.element.remove();
    };

    return SymbolsListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL3N5bWJvbHMtbGlzdC9saWIvc3ltYm9scy1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLGlCQUFrQixPQUFBLENBQVEsc0JBQVIsRUFBbEIsY0FERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDVTtBQUNGLHNDQUFBLENBQUE7O0FBQWEsSUFBQSx5QkFBQyxlQUFELEdBQUE7QUFDVCxNQUFBLGtEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVYsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLEVBQVYsQ0FGQSxDQURTO0lBQUEsQ0FBYjs7QUFBQSw4QkFLQSxLQUFBLEdBQU8sRUFMUCxDQUFBOztBQUFBLDhCQU1BLGFBQUEsR0FBZSxJQU5mLENBQUE7O0FBQUEsOEJBUUEsV0FBQSxHQUFhLFNBQUMsSUFBRCxHQUFBO2FBQ1Qsa0NBQUEsR0FDSSxDQUFDLGtDQUFBLEdBQWtDLElBQUksQ0FBQyxJQUF2QyxHQUE0QyxXQUE3QyxDQURKLEdBRUksQ0FBQywwQkFBQSxHQUEwQixJQUFJLENBQUMsS0FBL0IsR0FBcUMsU0FBdEMsQ0FGSixHQUdBLFFBSlM7SUFBQSxDQVJiLENBQUE7O0FBQUEsOEJBY0EsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1AsTUFBQSxJQUFHLG9CQUFBLElBQWdCLDRCQUFuQjtlQUNJLElBQUMsQ0FBQSxhQUFELENBQWdCLElBQUksQ0FBQyxLQUFyQixFQURKO09BRE87SUFBQSxDQWRYLENBQUE7O0FBQUEsOEJBa0JBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsS0FBWCxFQUZRO0lBQUEsQ0FsQlosQ0FBQTs7QUFBQSw4QkFzQkEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFNLFFBQU47SUFBQSxDQXRCZCxDQUFBOztBQUFBLDhCQXdCQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsS0FBWCxFQUZLO0lBQUEsQ0F4QlQsQ0FBQTs7QUFBQSw4QkE0QkEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO0FBQ1IsWUFBQSxXQUFBOytDQUFPLENBQUUsS0FBSyxDQUFDLGFBQWYscUNBQTRCLENBQUUsS0FBSyxDQUFDLGNBRDVCO01BQUEsQ0FBWixDQUFBLENBQUE7YUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxLQUFYLEVBSE87SUFBQSxDQTVCWCxDQUFBOztBQUFBLDhCQWlDQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBakNYLENBQUE7O0FBQUEsOEJBbUNBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQSxFQURLO0lBQUEsQ0FuQ1QsQ0FBQTs7MkJBQUE7O0tBRDBCLGVBSmxDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/sargon/.atom/packages/symbols-list/lib/symbols-list-view.coffee
