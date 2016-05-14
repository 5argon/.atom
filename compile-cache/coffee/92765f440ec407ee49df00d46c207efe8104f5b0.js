(function() {
  var EvEmitter, Unipointer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EvEmitter = require('./EvEmitter');


  /*!
   * Unipointer v2.1.0
   * base class for doing one thing with pointer event
   * MIT license
   */

  module.exports = Unipointer = (function(_super) {
    __extends(Unipointer, _super);

    function Unipointer() {
      return Unipointer.__super__.constructor.apply(this, arguments);
    }

    Unipointer.prototype.noop = function() {};

    Unipointer.prototype.bindStartEvent = function(elem) {
      this._bindStartEvent(elem, true);
    };

    Unipointer.prototype.unbindStartEvent = function(elem) {
      this._bindStartEvent(elem, false);
    };


    /**
     * works as unbinder, as you can ._bindStart( false ) to unbind
     * @param {Boolean} isBind - will unbind if falsey
     */

    Unipointer.prototype._bindStartEvent = function(elem, isBind) {
      var bindMethod;
      isBind = isBind === void 0 ? true : !!isBind;
      bindMethod = isBind ? 'addEventListener' : 'removeEventListener';
      elem[bindMethod]('mousedown', this);
      elem[bindMethod]('touchstart', this);
    };

    Unipointer.prototype.handleEvent = function(event) {
      var method;
      method = 'on' + event.type;
      if (this[method]) {
        this[method](event);
      }
    };

    Unipointer.prototype.getTouch = function(touches) {
      var i, touch;
      i = 0;
      while (i < touches.length) {
        touch = touches[i];
        if (touch.identifier === this.pointerIdentifier) {
          return touch;
        }
        i++;
      }
    };

    Unipointer.prototype.onmousedown = function(event) {
      var button;
      button = event.button;
      if (button && button !== 0 && button !== 1) {
        return;
      }
      this._pointerDown(event, event);
    };

    Unipointer.prototype.ontouchstart = function(event) {
      this._pointerDown(event, event.changedTouches[0]);
    };

    Unipointer.prototype.onpointerdown = function(event) {
      this._pointerDown(event, event);
    };


    /**
     * pointer start
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Unipointer.prototype._pointerDown = function(event, pointer) {
      if (this.isPointerDown) {
        return;
      }
      this.isPointerDown = true;
      this.pointerIdentifier = pointer.pointerId !== void 0 ? pointer.pointerId : pointer.identifier;
      this.pointerDown(event, pointer);
    };

    Unipointer.prototype.pointerDown = function(event, pointer) {
      this._bindPostStartEvents(event);
      this.emitEvent('pointerDown', [event, pointer]);
    };

    Unipointer.prototype.postStartEvents = {
      mousedown: ['mousemove', 'mouseup'],
      touchstart: ['touchmove', 'touchend', 'touchcancel'],
      pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
      MSPointerDown: ['MSPointerMove', 'MSPointerUp', 'MSPointerCancel']
    };

    Unipointer.prototype._bindPostStartEvents = function(event) {
      var events;
      if (!event) {
        return;
      }
      events = this.postStartEvents[event.type];
      events.forEach((function(eventName) {
        window.addEventListener(eventName, this);
      }), this);
      this._boundPointerEvents = events;
    };

    Unipointer.prototype._unbindPostStartEvents = function() {
      if (!this._boundPointerEvents) {
        return;
      }
      this._boundPointerEvents.forEach((function(eventName) {
        window.removeEventListener(eventName, this);
      }), this);
      delete this._boundPointerEvents;
    };

    Unipointer.prototype.onmousemove = function(event) {
      this._pointerMove(event, event);
    };

    Unipointer.prototype.onpointermove = function(event) {
      if (event.pointerId === this.pointerIdentifier) {
        this._pointerMove(event, event);
      }
    };

    Unipointer.prototype.ontouchmove = function(event) {
      var touch;
      touch = this.getTouch(event.changedTouches);
      if (touch) {
        this._pointerMove(event, touch);
      }
    };


    /**
     * pointer move
     * @param {Event} event
     * @param {Event or Touch} pointer
     * @private
     */

    Unipointer.prototype._pointerMove = function(event, pointer) {
      this.pointerMove(event, pointer);
    };

    Unipointer.prototype.pointerMove = function(event, pointer) {
      this.emitEvent('pointerMove', [event, pointer]);
    };

    Unipointer.prototype.onmouseup = function(event) {
      this._pointerUp(event, event);
    };

    Unipointer.prototype.onpointerup = function(event) {
      if (event.pointerId === this.pointerIdentifier) {
        this._pointerUp(event, event);
      }
    };

    Unipointer.prototype.ontouchend = function(event) {
      var touch;
      touch = this.getTouch(event.changedTouches);
      if (touch) {
        this._pointerUp(event, touch);
      }
    };


    /**
     * pointer up
     * @param {Event} event
     * @param {Event or Touch} pointer
     * @private
     */

    Unipointer.prototype._pointerUp = function(event, pointer) {
      this._pointerDone();
      this.pointerUp(event, pointer);
    };

    Unipointer.prototype.pointerUp = function(event, pointer) {
      this.emitEvent('pointerUp', [event, pointer]);
    };

    Unipointer.prototype._pointerDone = function() {
      this.isPointerDown = false;
      delete this.pointerIdentifier;
      this._unbindPostStartEvents();
      this.pointerDone();
    };

    Unipointer.prototype.pointerDone = function() {
      return this.noop;
    };

    Unipointer.prototype.onpointercancel = function(event) {
      if (event.pointerId === this.pointerIdentifier) {
        this._pointerCancel(event, event);
      }
    };

    Unipointer.prototype.ontouchcancel = function(event) {
      var touch;
      touch = this.getTouch(event.changedTouches);
      if (touch) {
        this._pointerCancel(event, touch);
      }
    };


    /**
     * pointer cancel
     * @param {Event} event
     * @param {Event or Touch} pointer
     * @private
     */

    Unipointer.prototype._pointerCancel = function(event, pointer) {
      this._pointerDone();
      this.pointerCancel(event, pointer);
    };

    Unipointer.prototype.pointerCancel = function(event, pointer) {
      this.emitEvent('pointerCancel', [event, pointer]);
    };

    Unipointer.getPointerPoint = function(pointer) {
      return {
        x: pointer.pageX,
        y: pointer.pageY
      };
    };

    return Unipointer;

  })(EvEmitter);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9EcmFnZ2FiaWxseS9Vbmlwb2ludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxhQUFSLENBQVosQ0FBQTs7QUFFQTtBQUFBOzs7O0tBRkE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxTQUFBLEdBQUEsQ0FBTixDQUFBOztBQUFBLHlCQUVBLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7QUFDZCxNQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLEVBQXVCLElBQXZCLENBQUEsQ0FEYztJQUFBLENBRmhCLENBQUE7O0FBQUEseUJBTUEsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7QUFDaEIsTUFBQSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixFQUF1QixLQUF2QixDQUFBLENBRGdCO0lBQUEsQ0FObEIsQ0FBQTs7QUFVQTtBQUFBOzs7T0FWQTs7QUFBQSx5QkFjQSxlQUFBLEdBQWlCLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUVmLFVBQUEsVUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFZLE1BQUEsS0FBVSxNQUFiLEdBQTRCLElBQTVCLEdBQXNDLENBQUEsQ0FBSyxNQUFwRCxDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWdCLE1BQUgsR0FBZSxrQkFBZixHQUF1QyxxQkFEcEQsQ0FBQTtBQUFBLE1BR0EsSUFBSyxDQUFBLFVBQUEsQ0FBTCxDQUFpQixXQUFqQixFQUE4QixJQUE5QixDQUhBLENB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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/Draggabilly/Unipointer.coffee
