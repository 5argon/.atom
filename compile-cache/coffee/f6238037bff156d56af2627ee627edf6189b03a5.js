(function() {
  var InnerPanel, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  helper = require('../helper/helper');

  module.exports = InnerPanel = (function(_super) {
    __extends(InnerPanel, _super);


    /**
     * [constructor InnerPanels in atom]
     *
     * @method constructor
     *
     * @param  {[tag]}     name  [name of the element like x-foo]
     *
     * @return {[type]}    [description]
     */

    function InnerPanel(name, type) {
      if (type == null) {
        type = false;
      }
      this.component = this.createComponent(name);
      if (type) {
        this.component.classList.add(type);
      }
      this.component.tabIndex = '2';
    }

    InnerPanel.prototype.setColor = function(color) {
      return this.component.setAttribute('style', "background-image: linear-gradient(to right, white, " + color + ")");
    };

    InnerPanel.prototype.setPosition = function(left, top) {
      return this.component.setAttribute('style', "top: " + top + "px; left: " + left + "px");
    };

    return InnerPanel;

  })(helper);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL3VpL0lubmVyUGFuZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOztBQUFBO0FBQUE7Ozs7Ozs7O09BQUE7O0FBU2EsSUFBQSxvQkFBQyxJQUFELEVBQU8sSUFBUCxHQUFBOztRQUFPLE9BQU87T0FDekI7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsQ0FBYixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUg7QUFBYSxRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLElBQXpCLENBQUEsQ0FBYjtPQURBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBUyxDQUFDLFFBQVgsR0FBc0IsR0FKdEIsQ0FEVztJQUFBLENBVGI7O0FBQUEseUJBaUJBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxTQUFTLENBQUMsWUFBWCxDQUF3QixPQUF4QixFQUFrQyxxREFBQSxHQUFxRCxLQUFyRCxHQUEyRCxHQUE3RixFQURRO0lBQUEsQ0FqQlYsQ0FBQTs7QUFBQSx5QkFxQkEsV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTthQUNYLElBQUMsQ0FBQSxTQUFTLENBQUMsWUFBWCxDQUF3QixPQUF4QixFQUFrQyxPQUFBLEdBQU8sR0FBUCxHQUFXLFlBQVgsR0FBdUIsSUFBdkIsR0FBNEIsSUFBOUQsRUFEVztJQUFBLENBckJiLENBQUE7O3NCQUFBOztLQUR1QixPQUh6QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/ui/InnerPanel.coffee
