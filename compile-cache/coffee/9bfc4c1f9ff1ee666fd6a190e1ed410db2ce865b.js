(function() {
  var Swatch, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  helper = require('../helper/helper');

  module.exports = Swatch = (function(_super) {
    __extends(Swatch, _super);

    Swatch.prototype.color = 'rgba(0,0,0,0)';


    /**
     * [constructor Swatch in atom]
     *
     * @method constructor
     *
     * @param  {[class]}   type    [a class for styling the swatch]
     *
     * @return {[type]}    [description]
     */

    function Swatch(type) {
      this.component = this.createComponent('ccp-swatch');
      this.component.classList.add(type);
    }

    Swatch.prototype.setColor = function(color) {
      this.color = color;
      return this.component.setAttribute('style', 'background: ' + this.color);
    };

    Swatch.prototype.getColor = function() {
      return this.color;
    };

    return Swatch;

  })(helper);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2NvcmUvU3dhdGNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxDQUFBOztBQUFBLHFCQUFBLEtBQUEsR0FBTyxlQUFQLENBQUE7O0FBQ0E7QUFBQTs7Ozs7Ozs7T0FEQTs7QUFVYSxJQUFBLGdCQUFDLElBQUQsR0FBQTtBQUVYLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsZUFBRCxDQUFpQixZQUFqQixDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLElBQXpCLENBREEsQ0FGVztJQUFBLENBVmI7O0FBQUEscUJBZ0JBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFULENBQUE7YUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLFlBQVgsQ0FBd0IsT0FBeEIsRUFBaUMsY0FBQSxHQUFpQixJQUFDLENBQUEsS0FBbkQsRUFGUTtJQUFBLENBaEJWLENBQUE7O0FBQUEscUJBcUJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsTUFETztJQUFBLENBckJWLENBQUE7O2tCQUFBOztLQURtQixPQUhyQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/core/Swatch.coffee
