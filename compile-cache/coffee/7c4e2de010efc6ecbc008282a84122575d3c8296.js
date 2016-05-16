(function() {
  var Unidragger, Unipointer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Unipointer = require('./Unipointer');


  /*!
   * Unidragger v2.1.0
   * Draggable base class
   * MIT license
   */

  module.exports = Unidragger = (function(_super) {
    var navigator, noop;

    __extends(Unidragger, _super);

    function Unidragger(args) {}

    noop = function() {};

    Unidragger.prototype.bindHandles = function() {
      this._bindHandles(true);
    };

    Unidragger.prototype.unbindHandles = function() {
      this._bindHandles(false);
    };

    navigator = window.navigator;


    /**
     * works as unbinder, as you can .bindHandles( false ) to unbind
     * @param {Boolean} isBind - will unbind if falsey
     */

    Unidragger.prototype._bindHandles = function(isBind) {
      var bindMethod, binderExtra, handle, i;
      isBind = isBind === void 0 ? true : !!isBind;
      binderExtra = void 0;
      if (navigator.pointerEnabled) {
        ({
          binderExtra: function(handle) {
            handle.style.touchAction = isBind ? 'none' : '';
          }
        });
      } else {
        binderExtra = noop;
      }
      bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
      i = 0;
      while (i < this.handles.length) {
        handle = this.handles[i];
        this._bindStartEvent(handle, isBind);
        binderExtra(handle);
        handle[bindMethod]('click', this);
        i++;
      }
    };


    /**
     * pointer start
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Unidragger.prototype.pointerDown = function(event, pointer) {
      var focused;
      if (event.target.nodeName === 'INPUT' && event.target.type === 'range') {
        this.isPointerDown = false;
        delete this.pointerIdentifier;
        return;
      }
      this._dragPointerDown(event, pointer);
      focused = document.activeElement;
      if (focused && focused.blur) {
        focused.blur();
      }
      this._bindPostStartEvents(event);
      this.emitEvent('pointerDown', [event, pointer]);
    };

    Unidragger.prototype._dragPointerDown = function(event, pointer) {
      var canPreventDefault;
      this.pointerDownPoint = Unipointer.getPointerPoint(pointer);
      canPreventDefault = this.canPreventDefaultOnPointerDown(event, pointer);
      if (canPreventDefault) {
        event.preventDefault();
      }
    };

    Unidragger.prototype.canPreventDefaultOnPointerDown = function(event) {
      return event.target.nodeName !== 'SELECT';
    };


    /**
     * drag move
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Unidragger.prototype.pointerMove = function(event, pointer) {
      var moveVector;
      moveVector = this._dragPointerMove(event, pointer);
      this.emitEvent('pointerMove', [event, pointer, moveVector]);
      this._dragMove(event, pointer, moveVector);
    };

    Unidragger.prototype._dragPointerMove = function(event, pointer) {
      var movePoint, moveVector;
      movePoint = Unipointer.getPointerPoint(pointer);
      moveVector = {
        x: movePoint.x - this.pointerDownPoint.x,
        y: movePoint.y - this.pointerDownPoint.y
      };
      if (!this.isDragging && this.hasDragStarted(moveVector)) {
        this._dragStart(event, pointer);
      }
      return moveVector;
    };

    Unidragger.prototype.hasDragStarted = function(moveVector) {
      return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
    };


    /**
     * pointer up
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Unidragger.prototype.pointerUp = function(event, pointer) {
      this.emitEvent('pointerUp', [event, pointer]);
      this._dragPointerUp(event, pointer);
    };

    Unidragger.prototype._dragPointerUp = function(event, pointer) {
      if (this.isDragging) {
        this._dragEnd(event, pointer);
      } else {
        this._staticClick(event, pointer);
      }
    };

    Unidragger.prototype._dragStart = function(event, pointer) {
      this.isDragging = true;
      this.dragStartPoint = Unipointer.getPointerPoint(pointer);
      this.isPreventingClicks = true;
      this.dragStart(event, pointer);
    };

    Unidragger.prototype.dragStart = function(event, pointer) {
      this.emitEvent('dragStart', [event, pointer]);
    };

    Unidragger.prototype._dragMove = function(event, pointer, moveVector) {
      if (!this.isDragging) {
        return;
      }
      this.dragMove(event, pointer, moveVector);
    };

    Unidragger.prototype.dragMove = function(event, pointer, moveVector) {
      event.preventDefault();
      this.emitEvent('dragMove', [event, pointer, moveVector]);
    };

    Unidragger.prototype._dragEnd = function(event, pointer) {
      this.isDragging = false;
      setTimeout((function() {
        delete this.isPreventingClicks;
      }).bind(this));
      this.dragEnd(event, pointer);
    };

    Unidragger.prototype.dragEnd = function(event, pointer) {
      this.emitEvent('dragEnd', [event, pointer]);
    };

    Unidragger.prototype.onclick = function(event) {
      if (this.isPreventingClicks) {
        event.preventDefault();
      }
    };

    Unidragger.prototype._staticClick = function(event, pointer) {
      var nodeName;
      if (this.isIgnoringMouseUp && event.type === 'mouseup') {
        return;
      }
      nodeName = event.target.nodeName;
      if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
        event.target.focus();
      }
      this.staticClick(event, pointer);
      if (event.type !== 'mouseup') {
        this.isIgnoringMouseUp = true;
        setTimeout((function() {
          delete this.isIgnoringMouseUp;
        }).bind(this), 400);
      }
    };

    Unidragger.prototype.staticClick = function(event, pointer) {
      this.emitEvent('staticClick', [event, pointer]);
    };

    Unidragger.getPointerPoint = Unipointer.getPointerPoint;

    Unidragger;

    return Unidragger;

  })(Unipointer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9EcmFnZ2FiaWxseS9VbmlEcmFnZ2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBQWIsQ0FBQTs7QUFFQTtBQUFBOzs7O0tBRkE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBRUosUUFBQSxlQUFBOztBQUFBLGlDQUFBLENBQUE7O0FBQWEsSUFBQSxvQkFBQyxJQUFELEdBQUEsQ0FBYjs7QUFBQSxJQU1BLElBQUEsR0FBTyxTQUFBLEdBQUEsQ0FOUCxDQUFBOztBQUFBLHlCQVVBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxDQUFBLENBRFc7SUFBQSxDQVZiLENBQUE7O0FBQUEseUJBY0EsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLENBQUEsQ0FEYTtJQUFBLENBZGYsQ0FBQTs7QUFBQSxJQWtCQSxTQUFBLEdBQVksTUFBTSxDQUFDLFNBbEJuQixDQUFBOztBQW9CQTtBQUFBOzs7T0FwQkE7O0FBQUEseUJBeUJBLFlBQUEsR0FBYyxTQUFDLE1BQUQsR0FBQTtBQUVaLFVBQUEsa0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBWSxNQUFBLEtBQVUsTUFBYixHQUE0QixJQUE1QixHQUFzQyxDQUFBLENBQUUsTUFBakQsQ0FBQTtBQUFBLE1BRUEsV0FBQSxHQUFjLE1BRmQsQ0FBQTtBQUdBLE1BQUEsSUFBRyxTQUFTLENBQUMsY0FBYjtBQUNFLFFBQUEsQ0FBQTtBQUFBLFVBQUEs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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/Draggabilly/UniDragger.coffee
