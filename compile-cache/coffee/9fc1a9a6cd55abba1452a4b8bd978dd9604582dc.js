
/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */

(function() {
  var GetSize;

  module.exports = GetSize = (function() {
    var getStyle, getStyleSize, getZeroSize, isBoxSizeOuter, isSetup, measurements, measurementsLength, setup;

    function GetSize() {}

    measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];

    measurementsLength = measurements.length;

    isSetup = false;

    isBoxSizeOuter = void 0;

    getStyleSize = function(value) {
      var isValid, num;
      num = parseFloat(value);
      isValid = value.indexOf('%') === -1 && !isNaN(num);
      return isValid && num;
    };

    getZeroSize = function() {
      var i, measurement, size;
      size = {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0
      };
      i = 0;
      while (i < measurementsLength) {
        measurement = measurements[i];
        size[measurement] = 0;
        i++;
      }
      return size;
    };


    /**
     * getStyle, get style of element, check for Firefox bug
     * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
     */

    getStyle = function(elem) {
      return getComputedStyle(elem);
    };


    /**
     * setup
     * check isBoxSizerOuter
     * do on first getSize() rather than on page load for Firefox bug
     */

    setup = function() {
      var body, div, style;
      if (isSetup) {
        return;
      }
      isSetup = true;

      /**
       * WebKit measures the outer-width on style.width on border-box elems
       * IE & Firefox<29 measures the inner-width
       */
      div = document.createElement('div');
      div.style.width = '200px';
      div.style.padding = '1px 2px 3px 4px';
      div.style.borderStyle = 'solid';
      div.style.borderWidth = '1px 2px 3px 4px';
      div.style.boxSizing = 'border-box';
      body = document.body || document.documentElement;
      body.appendChild(div);
      style = getStyle(div);
      isBoxSizeOuter = getStyleSize(style.width) === 200;
      body.removeChild(div);
    };

    GetSize.prototype.getSize = function(elem) {
      var borderHeight, borderWidth, i, isBorderBox, isBorderBoxSizeOuter, marginHeight, marginWidth, measurement, num, paddingHeight, paddingWidth, size, style, styleHeight, styleWidth, value;
      setup();
      if (typeof elem === 'string') {
        elem = document.querySelector(elem);
      }
      if (!elem || typeof elem !== 'object' || !elem.nodeType) {
        return;
      }
      style = getStyle(elem);
      if (style.display === 'none') {
        return getZeroSize();
      }
      size = {};
      size.width = elem.offsetWidth;
      size.height = elem.offsetHeight;
      isBorderBox = size.isBorderBox = style.boxSizing === 'border-box';
      i = 0;
      while (i < measurementsLength) {
        measurement = measurements[i];
        value = style[measurement];
        num = parseFloat(value);
        size[measurement] = !isNaN(num) ? num : 0;
        i++;
      }
      paddingWidth = size.paddingLeft + size.paddingRight;
      paddingHeight = size.paddingTop + size.paddingBottom;
      marginWidth = size.marginLeft + size.marginRight;
      marginHeight = size.marginTop + size.marginBottom;
      borderWidth = size.borderLeftWidth + size.borderRightWidth;
      borderHeight = size.borderTopWidth + size.borderBottomWidth;
      isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
      styleWidth = getStyleSize(style.width);
      if (styleWidth !== false) {
        size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
      }
      styleHeight = getStyleSize(style.height);
      if (styleHeight !== false) {
        size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
      }
      size.innerWidth = size.width - (paddingWidth + borderWidth);
      size.innerHeight = size.height - (paddingHeight + borderHeight);
      size.outerWidth = size.width + marginWidth;
      size.outerHeight = size.height + marginHeight;
      return size;
    };

    return GetSize;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9EcmFnZ2FiaWxseS9HZXRTaXplLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7Ozs7R0FBQTtBQUFBO0FBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosUUFBQSxxR0FBQTs7eUJBQUE7O0FBQUEsSUFBQSxZQUFBLEdBQWUsQ0FDYixhQURhLEVBRWIsY0FGYSxFQUdiLFlBSGEsRUFJYixlQUphLEVBS2IsWUFMYSxFQU1iLGFBTmEsRUFPYixXQVBhLEVBUWIsY0FSYSxFQVNiLGlCQVRhLEVBVWIsa0JBVmEsRUFXYixnQkFYYSxFQVliLG1CQVphLENBQWYsQ0FBQTs7QUFBQSxJQWNBLGtCQUFBLEdBQXFCLFlBQVksQ0FBQyxNQWRsQyxDQUFBOztBQUFBLElBZ0JBLE9BQUEsR0FBVSxLQWhCVixDQUFBOztBQUFBLElBaUJBLGNBQUEsR0FBaUIsTUFqQmpCLENBQUE7O0FBQUEsSUFzQkEsWUFBQSxHQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsVUFBQSxZQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sVUFBQSxDQUFXLEtBQVgsQ0FBTixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLENBQUEsS0FBc0IsQ0FBQSxDQUF0QixJQUE2QixDQUFBLEtBQUksQ0FBTSxHQUFOLENBRjNDLENBQUE7YUFHQSxPQUFBLElBQVksSUFKQztJQUFBLENBdEJmLENBQUE7O0FBQUEsSUE0QkEsV0FBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsb0JBQUE7QUFBQSxNQUFBLElBQUEsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLENBQVA7QUFB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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/Draggabilly/GetSize.coffee
