(function() {
  var Sliders, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  helper = require('../helper/helper');

  module.exports = Sliders = (function(_super) {
    __extends(Sliders, _super);


    /**
     * [constructor Sliders in atom]
     *
     * @method constructor
     *
     * @param  {[class]}   type  [a class for styling the slider]
     *
     * @return {[type]}    [description]
     */

    function Sliders(type) {
      this.slider = document.createElement('INPUT');
      this.slider.setAttribute('type', 'range');
      this.component = this.createComponent('ccp-slider');
      this.component.classList.add(type);
      this.component.appendChild(this.slider);
    }

    Sliders.prototype.setValue = function(value) {
      return this.slider.value = value;
    };

    Sliders.prototype.getValue = function() {
      return this.slider.value;
    };

    Sliders.prototype.setMax = function(max) {
      return this.slider.max = max;
    };

    Sliders.prototype.setColor = function(color) {
      return this.component.setAttribute('style', "background-image: linear-gradient(to right, rgba(204, 154, 129, 0), " + color + ")");
    };

    return Sliders;

  })(helper);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2NvcmUvU2xpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSiw4QkFBQSxDQUFBOztBQUFBO0FBQUE7Ozs7Ozs7O09BQUE7O0FBU2EsSUFBQSxpQkFBQyxJQUFELEdBQUE7QUFFWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkIsT0FBN0IsQ0FEQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxlQUFELENBQWlCLFlBQWpCLENBSmIsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsSUFBekIsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBUyxDQUFDLFdBQVgsQ0FBdUIsSUFBQyxDQUFBLE1BQXhCLENBTkEsQ0FGVztJQUFBLENBVGI7O0FBQUEsc0JBb0JBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixNQURSO0lBQUEsQ0FwQlYsQ0FBQTs7QUFBQSxzQkF1QkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFEQTtJQUFBLENBdkJWLENBQUE7O0FBQUEsc0JBMEJBLE1BQUEsR0FBUSxTQUFDLEdBQUQsR0FBQTthQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsR0FBUixHQUFjLElBRFI7SUFBQSxDQTFCUixDQUFBOztBQUFBLHNCQThCQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0IsT0FBeEIsRUFBa0Msc0VBQUEsR0FBc0UsS0FBdEUsR0FBNEUsR0FBOUcsRUFEUTtJQUFBLENBOUJWLENBQUE7O21CQUFBOztLQUZvQixPQUh0QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/core/Slider.coffee
