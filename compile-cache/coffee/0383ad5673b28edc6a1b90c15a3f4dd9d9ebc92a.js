
/**
 * EvEmitter v1.0.1
 * Lil' event emitter
 * MIT License
 */

(function() {
  var EvEmitter;

  module.exports = EvEmitter = (function() {
    function EvEmitter() {}

    EvEmitter.prototype.on = function(eventName, listener) {
      var events, listeners;
      if (!eventName || !listener) {
        return;
      }
      events = this._events = this._events || {};
      listeners = events[eventName] = events[eventName] || [];
      if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
      }
      return this;
    };

    EvEmitter.prototype.once = function(eventName, listener) {
      var onceEvents, onceListeners;
      if (!eventName || !listener) {
        return;
      }
      this.on(eventName, listener);
      onceEvents = this._onceEvents = this._onceEvents || {};
      onceListeners = onceEvents[eventName] = onceEvents[eventName] || [];
      onceListeners[listener] = true;
      return this;
    };

    EvEmitter.prototype.off = function(eventName, listener) {
      var index, listeners;
      listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      return this;
    };

    EvEmitter.prototype.emitEvent = function(eventName, args) {
      var i, isOnce, listener, listeners, onceListeners;
      listeners = this._events && this._events[eventName];
      if (!listeners || !listeners.length) {
        return;
      }
      i = 0;
      listener = listeners[i];
      args = args || [];
      onceListeners = this._onceEvents && this._onceEvents[eventName];
      while (listener) {
        isOnce = onceListeners && onceListeners[listener];
        if (isOnce) {
          this.off(eventName, listener);
          delete onceListeners[listener];
        }
        listener.apply(this, args);
        i += isOnce ? 0 : 1;
        listener = listeners[i];
      }
      return this;
    };

    return EvEmitter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9EcmFnZ2FiaWxseS9FdkVtaXR0ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007MkJBRUo7O0FBQUEsd0JBQUEsRUFBQSxHQUFJLFNBQUMsU0FBRCxFQUFZLFFBQVosR0FBQTtBQUNGLFVBQUEsaUJBQUE7QUFBQSxNQUFBLElBQUcsQ0FBQSxTQUFBLElBQWlCLENBQUEsUUFBcEI7QUFDRSxjQUFBLENBREY7T0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE9BQUQsSUFBWSxFQUhoQyxDQUFBO0FBQUEsTUFLQSxTQUFBLEdBQVksTUFBTyxDQUFBLFNBQUEsQ0FBUCxHQUFvQixNQUFPLENBQUEsU0FBQSxDQUFQLElBQXFCLEVBTHJELENBQUE7QUFPQSxNQUFBLElBQUcsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsUUFBbEIsQ0FBQSxLQUErQixDQUFBLENBQWxDO0FBQ0UsUUFBQSxTQUFTLENBQUMsSUFBVixDQUFlLFFBQWYsQ0FBQSxDQURGO09BUEE7YUFTQSxLQVZFO0lBQUEsQ0FBSixDQUFBOztBQUFBLHdCQVlBLElBQUEsR0FBTSxTQUFDLFNBQUQsRUFBWSxRQUFaLEdBQUE7QUFDSixVQUFBLHlCQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsU0FBQSxJQUFpQixDQUFBLFFBQXBCO0FBQ0UsY0FBQSxDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxFQUFELENBQUksU0FBSixFQUFlLFFBQWYsQ0FIQSxDQUFBO0FBQUEsTUFNQSxVQUFBLEdBQWEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsV0FBRCxJQUFnQixFQU41QyxDQUFBO0FBQUEsTUFRQSxhQUFBLEdBQWdCLFVBQVcsQ0FBQSxTQUFBLENBQVgsR0FBd0IsVUFBVyxDQUFBLFNBQUEsQ0FBWCxJQUF5QixFQVJqRSxDQUFBO0FBQUEsTUFVQSxhQUFjLENBQUEsUUFBQSxDQUFkLEdBQTBCLElBVjFCLENBQUE7YUFXQSxLQVpJO0lBQUEsQ0FaTixDQUFBOztBQUFBLHdCQTBCQSxHQUFBLEdBQUssU0FBQyxTQUFELEVBQVksUUFBWixHQUFBO0FBQ0gsVUFBQSxnQkFBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxPQUFELElBQWEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxTQUFBLENBQWxDLENBQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxTQUFBLElBQWlCLENBQUEsU0FBYSxDQUFDLE1BQWxDO0FBQ0UsY0FBQSxDQURGO09BREE7QUFBQSxNQUdBLEtBQUEsR0FBUSxTQUFTLENBQUMsT0FBVixDQUFrQixRQUFsQixDQUhSLENBQUE7QUFJQSxNQUFBLElBQUcsS0FBQSxLQUFXLENBQUEsQ0FBZDtBQUNFLFFBQUEsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsS0FBakIsRUFBd0IsQ0FBeEIsQ0FBQSxDQURGO09BSkE7YUFNQSxLQVBHO0lBQUEsQ0ExQkwsQ0FBQTs7QUFBQSx3QkFtQ0EsU0FBQSxHQUFXLFNBQUMsU0FBRCxFQUFZLElBQVosR0FBQTtBQUNULFVBQUEsNkNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsT0FBRCxJQUFhLElBQUMsQ0FBQSxPQUFRLENBQUEsU0FBQSxDQUFsQyxDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsU0FBQSxJQUFpQixDQUFBLFNBQWEsQ0FBQyxNQUFsQztBQUNFLGNBQUEsQ0FERjtPQURBO0FBQUEsTUFHQSxDQUFBLEdBQUksQ0FISixDQUFBO0FBQUEsTUFJQSxRQUFBLEdBQVcsU0FBVSxDQUFBLENBQUEsQ0FKckIsQ0FBQTtBQUFBLE1BS0EsSUFBQSxHQUFPLElBQUEsSUFBUSxFQUxmLENBQUE7QUFBQSxNQU9BLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLFdBQUQsSUFBaUIsSUFBQyxDQUFBLFdBQVksQ0FBQSxTQUFBLENBUDlDLENBQUE7QUFRQSxhQUFNLFFBQU4sR0FBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLGFBQUEsSUFBa0IsYUFBYyxDQUFBLFFBQUEsQ0FBekMsQ0FBQTtBQUNBLFFBQUEsSUFBRyxNQUFIO0FBR0UsVUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0IsUUFBaEIsQ0FBQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQUEsYUFBcUIsQ0FBQSxRQUFBLENBRnJCLENBSEY7U0FEQTtBQUFBLFFBUUEsUUFBUSxDQUFDLEtBQVQsQ0FBZSxJQUFmLEVBQWtCLElBQWxCLENBUkEsQ0FBQTtBQUFBLFFBVUEsQ0FBQSxJQUFRLE1BQUgsR0FBZSxDQUFmLEdBQXNCLENBVjNCLENBQUE7QUFBQSxRQVdBLFFBQUEsR0FBVyxTQUFVLENBQUEsQ0FBQSxDQVhyQixDQURGO01BQUEsQ0FSQTthQXFCQSxLQXRCUztJQUFBLENBbkNYLENBQUE7O3FCQUFBOztNQVRGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/Draggabilly/EvEmitter.coffee
