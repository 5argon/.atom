(function() {
  var Helper;

  module.exports = Helper = (function() {
    function Helper() {}

    String.prototype.isRegistered = function() {
      return document.createElement(this).constructor !== HTMLElement;
    };

    Helper.prototype.createComponent = function(name) {
      var component;
      if (!name.isRegistered()) {
        document.registerElement(name);
      }
      return component = document.createElement(name);
    };

    Helper.prototype.add = function(element) {
      return this.component.appendChild(element.component);
    };

    Helper.prototype["delete"] = function() {
      return this.component.parentNode.removeChild(this.component);
    };

    Helper.prototype.addClass = function(classes) {
      return this.component.classList.add(classes);
    };

    Helper.prototype.removeClass = function(classes) {
      return this.component.classList.remove(classes);
    };

    return Helper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO3dCQUNKOztBQUFBLElBQUEsTUFBTSxDQUFBLFNBQUUsQ0FBQSxZQUFSLEdBQXVCLFNBQUEsR0FBQTthQUNyQixRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixDQUF5QixDQUFDLFdBQTFCLEtBQTJDLFlBRHRCO0lBQUEsQ0FBdkIsQ0FBQTs7QUFBQSxxQkFJQSxlQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBRWYsVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsSUFBUSxDQUFDLFlBQUwsQ0FBQSxDQUFQO0FBQ0UsUUFBQSxRQUFRLENBQUMsZUFBVCxDQUF5QixJQUF6QixDQUFBLENBREY7T0FBQTthQUdBLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QixFQUxHO0lBQUEsQ0FKakIsQ0FBQTs7QUFBQSxxQkFZQSxHQUFBLEdBQUssU0FBQyxPQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsU0FBUyxDQUFDLFdBQVgsQ0FBdUIsT0FBTyxDQUFDLFNBQS9CLEVBREc7SUFBQSxDQVpMLENBQUE7O0FBQUEscUJBZ0JBLFNBQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsU0FBUyxDQUFDLFVBQVUsQ0FBQyxXQUF0QixDQUFrQyxJQUFDLENBQUEsU0FBbkMsRUFETTtJQUFBLENBaEJSLENBQUE7O0FBQUEscUJBb0JBLFFBQUEsR0FBVSxTQUFDLE9BQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLE9BQXpCLEVBRFE7SUFBQSxDQXBCVixDQUFBOztBQUFBLHFCQXdCQSxXQUFBLEdBQWEsU0FBQyxPQUFELEdBQUE7YUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFyQixDQUE0QixPQUE1QixFQURXO0lBQUEsQ0F4QmIsQ0FBQTs7a0JBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/helper.coffee
