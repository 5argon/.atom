(function() {
  var ModifierView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = ModifierView = (function(_super) {
    __extends(ModifierView, _super);

    function ModifierView() {
      return ModifierView.__super__.constructor.apply(this, arguments);
    }

    ModifierView.content = function() {
      return this.div({
        "class": 'modifier'
      });
    };

    ModifierView.prototype.initialize = function(params) {
      this.text(params.label);
      return this.addClass('modifier-' + params.label.toLowerCase());
    };

    ModifierView.prototype.setActive = function(active) {
      if (active) {
        return this.addClass('modifier-active');
      } else {
        return this.removeClass('modifier-active');
      }
    };

    return ModifierView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc2FyZ29uLy5hdG9tL3BhY2thZ2VzL2tleWJvYXJkLWxvY2FsaXphdGlvbi9saWIvdmlld3MvbW9kaWZpZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLG1DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFVBQVA7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDJCQUdBLFVBQUEsR0FBWSxTQUFDLE1BQUQsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsS0FBYixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLFdBQUEsR0FBYyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQWIsQ0FBQSxDQUF4QixFQUZVO0lBQUEsQ0FIWixDQUFBOztBQUFBLDJCQU9BLFNBQUEsR0FBVyxTQUFDLE1BQUQsR0FBQTtBQUNULE1BQUEsSUFBRyxNQUFIO2VBQWUsSUFBQyxDQUFBLFFBQUQsQ0FBVSxpQkFBVixFQUFmO09BQUEsTUFBQTtlQUFpRCxJQUFDLENBQUEsV0FBRCxDQUFhLGlCQUFiLEVBQWpEO09BRFM7SUFBQSxDQVBYLENBQUE7O3dCQUFBOztLQUZ5QixLQUgzQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/sargon/.atom/packages/keyboard-localization/lib/views/modifier-view.coffee
