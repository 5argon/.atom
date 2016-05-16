(function() {
  var FloatingPanel, helper,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  helper = require('../helper/helper');

  module.exports = FloatingPanel = (function(_super) {
    __extends(FloatingPanel, _super);


    /**
    * [constructor FloatingPanel in atom]
    *
    * @method constructor
    *
    * @param  {[tag]}         name  [name of the element like x-foo]
    * @param  {[element]}    addTo [add to which dom element]
    *
    * @return {[type]}    [description]
     */

    function FloatingPanel(name, addTo) {
      this.component = this.createComponent(name);
      this.component.classList.add('invisible');
      this.triangle = this.createComponent('ccp-triangle');
      this.component.appendChild(this.triangle);
      addTo.appendChild(this.component);
    }

    FloatingPanel.prototype.setPlace = function(Cursor, EditorRoot, Editor, Match) {
      var ActualCursor, bottom, bounds, compBounds, left, tabs, top;
      bounds = Editor.getBoundingClientRect();
      compBounds = this.component.getBoundingClientRect();
      tabs = document.querySelector('[is=atom-tabs]');
      this.component.classList.remove('down');
      this.triangle.removeAttribute('style');
      top = Cursor.top - Editor.getScrollTop() + Cursor.height + tabs.clientHeight + 10;
      ActualCursor = EditorRoot.querySelector('.highlight.selection > .region');
      if (!ActualCursor) {
        ActualCursor = EditorRoot.querySelector('.cursor:last-of-type').getBoundingClientRect();
        left = ActualCursor.left - (compBounds.width / 2);
      } else {
        ActualCursor = ActualCursor.getBoundingClientRect();
        left = ActualCursor.left - (ActualCursor.width / 2);
      }
      if (left < bounds.left) {
        this.triangle.setAttribute('style', "left: calc(50% - " + (bounds.left - left + 4) + "px)");
        left = bounds.left;
      }
      if ((left + compBounds.width) > bounds.right) {
        this.triangle.setAttribute('style', "left: initial;right: calc(50% - " + (10 - (bounds.right - left)) + "px)");
        left -= bounds.right - left;
      }
      if ((top + compBounds.height) > bounds.bottom) {
        bottom = document.body.getBoundingClientRect().height + Cursor.height + 20 - top;
        this.component.classList.add('down');
        return this.component.setAttribute('style', "bottom: " + bottom + "px; left: " + left + "px");
      } else {
        return this.component.setAttribute('style', "top: " + top + "px; left: " + left + "px");
      }
    };

    FloatingPanel.prototype.add = function(element) {
      return this.component.appendChild(element.component);
    };

    FloatingPanel.prototype.toggle = function() {
      return this.component.classList.toggle('invisible');
    };

    FloatingPanel.prototype.destroy = function() {
      return this.component.parentNode.removeChild(this.component);
    };

    return FloatingPanel;

  })(helper);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL3VpL0Zsb2F0aW5nUGFuZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOztBQUFBO0FBQUE7Ozs7Ozs7OztPQUFBOztBQVdhLElBQUEsdUJBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtBQUVYLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLFdBQXpCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsZUFBRCxDQUFpQixjQUFqQixDQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QixJQUFDLENBQUEsUUFBeEIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxLQUFLLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsU0FBbkIsQ0FKQSxDQUZXO0lBQUEsQ0FYYjs7QUFBQSw0QkFvQkEsUUFBQSxHQUFVLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsTUFBckIsRUFBNkIsS0FBN0IsR0FBQTtBQUVSLFVBQUEseURBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMscUJBQVAsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsU0FBUyxDQUFDLHFCQUFY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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/ui/FloatingPanel.coffee
