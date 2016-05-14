(function() {
  var JsxView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = JsxView = (function(_super) {
    __extends(JsxView, _super);

    function JsxView() {
      return JsxView.__super__.constructor.apply(this, arguments);
    }

    JsxView.content = function() {
      return this.div({
        "class": 'jsx overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div('The JSX package is Alive! It\'s ALIVE!', {
            "class": 'message'
          });
        };
      })(this));
    };

    JsxView.prototype.initialize = function(serializeState) {
      return atom.commands.add('atom-workspace', {
        'jsx:run': (function(_this) {
          return function() {
            return _this.run();
          };
        })(this)
      });
    };

    JsxView.prototype.serialize = function() {};

    JsxView.prototype.destroy = function() {
      return this.detach();
    };

    JsxView.prototype.run = function() {
      console.log('JSX run called!!');
      if (this.hasParent()) {
        return this.detach();
      } else {
        return atom.workspaceView.append(this);
      }
    };

    return JsxView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1qc3gvbGliL2pzeC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLE9BQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNCQUFQO09BQUwsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEMsS0FBQyxDQUFBLEdBQUQsQ0FBSyx3Q0FBTCxFQUErQztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBL0MsRUFEa0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHNCQUlBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTthQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLFNBQUEsRUFBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsR0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYO09BQXBDLEVBRFU7SUFBQSxDQUpaLENBQUE7O0FBQUEsc0JBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQVJYLENBQUE7O0FBQUEsc0JBV0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUEsRUFETztJQUFBLENBWFQsQ0FBQTs7QUFBQSxzQkFjQSxHQUFBLEdBQUssU0FBQSxHQUFBO0FBQ0gsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGtCQUFaLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFuQixDQUEwQixJQUExQixFQUhGO09BRkc7SUFBQSxDQWRMLENBQUE7O21CQUFBOztLQURvQixLQUh0QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/.atom/packages/language-jsx/lib/jsx-view.coffee
