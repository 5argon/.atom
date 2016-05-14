(function() {
  var Draggabilly, GetSizeClass, Unidragger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Unidragger = require('./Draggabilly/UniDragger');

  GetSizeClass = require('./Draggabilly/GetSize');


  /*!
   * Draggabilly v2.1.0
   * Make that shiz draggable
   * http://draggabilly.desandro.com
   * MIT license
   */

  module.exports = Draggabilly = (function(_super) {
    var GetSize, applyGrid, extend, isElement, noop, requestAnimationFrame;

    __extends(Draggabilly, _super);

    Draggabilly.prototype.defaults = {};

    Draggabilly.prototype.document = window.document;

    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

    Draggabilly.prototype.lastTime = 0;

    Draggabilly.prototype.docElem = null;

    Draggabilly.prototype.transformProperty = null;

    Draggabilly.prototype.options = null;

    noop = function() {};

    extend = function(a, b) {
      var prop;
      for (prop in b) {
        a[prop] = b[prop];
      }
      return a;
    };

    isElement = function(obj) {
      return obj instanceof HTMLElement;
    };

    function Draggabilly(element, options) {
      this.docElem = this.document.documentElement;
      this.transformProperty = typeof this.docElem.style.transform === 'string' ? 'transform' : 'WebkitTransform';
      this.element = typeof element === 'string' ? this.document.querySelector(element) : element;
      this.options = extend({}, this.defaults);
      this.option(options);
      this._create();
      return;
    }

    applyGrid = function(value, grid, method) {
      method = method || 'round';
      if (grid) {
        return Math[method](value / grid) * grid;
      } else {
        return value;
      }
    };

    if (!requestAnimationFrame) {
      requestAnimationFrame = function(callback) {
        var currTime, id, timeToCall;
        currTime = (new Date).getTime();
        timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
        id = setTimeout(callback, timeToCall);
        this.lastTime = currTime + timeToCall;
        return id;
      };
    }


    /**
     * set options
     * @param {Object} opts
     */

    Draggabilly.prototype.option = function(opts) {
      extend(this.options, opts);
    };

    GetSize = function(elem) {
      var gS;
      gS = new GetSizeClass();
      return gS.getSize(elem);
    };

    Draggabilly.prototype._create = function() {
      var style;
      this.position = {};
      this._getPosition();
      this.startPoint = {
        x: 0,
        y: 0
      };
      this.dragPoint = {
        x: 0,
        y: 0
      };
      this.startPosition = extend({}, this.position);
      style = getComputedStyle(this.element);
      if (style.position !== 'relative' && style.position !== 'absolute') {
        this.element.style.position = 'relative';
      }
      this.enable();
      this.setHandles();
    };


    /**
     * set this.handles and bind start events to 'em
     */

    Draggabilly.prototype.setHandles = function() {
      this.handles = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element];
      this.bindHandles();
    };


    /**
     * emits events via EvEmitter events
     * @param {String} type - name of event
     * @param {Event} event - original event
     * @param {Array} args - extra arguments
     */

    Draggabilly.prototype.dispatchEvent = function(type, event, args) {
      var emitArgs;
      emitArgs = [event].concat(args);
      this.emitEvent(type, emitArgs);
    };

    Draggabilly.prototype._getPosition = function() {
      var style, x, y;
      style = getComputedStyle(this.element);
      x = this._getPositionCoord(style.left, 'width');
      y = this._getPositionCoord(style.top, 'height');
      this.position.x = isNaN(x) ? 0 : x;
      this.position.y = isNaN(y) ? 0 : y;
      this._addTransformPosition(style);
    };

    Draggabilly.prototype._getPositionCoord = function(styleSide, measure) {
      var parentSize;
      if (styleSide.indexOf('%') !== -1) {
        parentSize = GetSize(this.element.parentNode);
        return parseFloat(styleSide) / 100 * parentSize[measure];
      }
      return parseInt(styleSide, 10);
    };

    Draggabilly.prototype._addTransformPosition = function(style) {
      var matrixValues, transform, translateX, translateY, xIndex;
      transform = style[this.transformProperty];
      if (transform.indexOf('matrix') !== 0) {
        return;
      }
      matrixValues = transform.split(',');
      xIndex = transform.indexOf('matrix3d') === 0 ? 12 : 4;
      translateX = parseInt(matrixValues[xIndex], 10);
      translateY = parseInt(matrixValues[xIndex + 1], 10);
      this.position.x += translateX;
      this.position.y += translateY;
    };


    /**
     * pointer start
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Draggabilly.prototype.pointerDown = function(event, pointer) {
      var focused;
      this._dragPointerDown(event, pointer);
      focused = document.activeElement;
      if (focused && focused.blur && focused !== document.body) {
        focused.blur();
      }
      this._bindPostStartEvents(event);
      this.element.classList.add('is-pointer-down');
      this.dispatchEvent('pointerDown', event, [pointer]);
    };


    /**
     * drag move
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Draggabilly.prototype.pointerMove = function(event, pointer) {
      var moveVector;
      moveVector = this._dragPointerMove(event, pointer);
      this.dispatchEvent('pointerMove', event, [pointer, moveVector]);
      this._dragMove(event, pointer, moveVector);
    };


    /**
     * drag start
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Draggabilly.prototype.dragStart = function(event, pointer) {
      if (!this.isEnabled) {
        return;
      }
      this._getPosition();
      this.measureContainment();
      this.startPosition.x = this.position.x;
      this.startPosition.y = this.position.y;
      this.setLeftTop();
      this.dragPoint.x = 0;
      this.dragPoint.y = 0;
      this.element.classList.add('is-dragging');
      this.dispatchEvent('dragStart', event, [pointer]);
      this.animate();
    };

    Draggabilly.prototype.measureContainment = function() {
      var borderSizeX, borderSizeY, container, containerRect, containerSize, containment, elemRect, elemSize, position;
      containment = this.options.containment;
      if (!containment) {
        return;
      }
      container = isElement(containment) ? containment : typeof containment === 'string' ? document.querySelector(containment) : this.element.parentNode;
      elemSize = GetSize(this.element);
      containerSize = GetSize(container);
      elemRect = this.element.getBoundingClientRect();
      containerRect = container.getBoundingClientRect();
      borderSizeX = containerSize.borderLeftWidth + containerSize.borderRightWidth;
      borderSizeY = containerSize.borderTopWidth + containerSize.borderBottomWidth;
      position = this.relativeStartPosition = {
        x: elemRect.left - (containerRect.left + containerSize.borderLeftWidth),
        y: elemRect.top - (containerRect.top + containerSize.borderTopWidth)
      };
      this.containSize = {
        width: containerSize.width - borderSizeX - position.x - elemSize.width,
        height: containerSize.height - borderSizeY - position.y - elemSize.height
      };
    };


    /**
     * drag move
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Draggabilly.prototype.dragMove = function(event, pointer, moveVector) {
      var dragX, dragY, grid, gridX, gridY;
      if (!this.isEnabled) {
        return;
      }
      dragX = moveVector.x;
      dragY = moveVector.y;
      grid = this.options.grid;
      gridX = grid && grid[0];
      gridY = grid && grid[1];
      dragX = applyGrid(dragX, gridX);
      dragY = applyGrid(dragY, gridY);
      dragX = this.containDrag('x', dragX, gridX);
      dragY = this.containDrag('y', dragY, gridY);
      dragX = this.options.axis === 'y' ? 0 : dragX;
      dragY = this.options.axis === 'x' ? 0 : dragY;
      this.position.x = this.startPosition.x + dragX;
      this.position.y = this.startPosition.y + dragY;
      this.dragPoint.x = dragX;
      this.dragPoint.y = dragY;
      this.dispatchEvent('dragMove', event, [pointer, moveVector]);
    };

    Draggabilly.prototype.containDrag = function(axis, drag, grid) {
      var max, measure, min, rel;
      if (!this.options.containment) {
        return drag;
      }
      measure = axis === 'x' ? 'width' : 'height';
      rel = this.relativeStartPosition[axis];
      min = applyGrid(-rel, grid, 'ceil');
      max = this.containSize[measure];
      max = applyGrid(max, grid, 'floor');
      return Math.min(max, Math.max(min, drag));
    };


    /**
     * pointer up
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Draggabilly.prototype.pointerUp = function(event, pointer) {
      this.element.classList.remove('is-pointer-down');
      this.dispatchEvent('pointerUp', event, [pointer]);
      this._dragPointerUp(event, pointer);
    };


    /**
     * drag end
     * @param {Event} event
     * @param {Event or Touch} pointer
     */

    Draggabilly.prototype.dragEnd = function(event, pointer) {
      if (!this.isEnabled) {
        return;
      }
      if (this.transformProperty) {
        this.element.style[this.transformProperty] = '';
        this.setLeftTop();
      }
      this.element.classList.remove('is-dragging');
      this.dispatchEvent('dragEnd', event, [pointer]);
    };

    Draggabilly.prototype.animate = function() {
      var _this;
      if (!this.isDragging) {
        return;
      }
      this.positionDrag();
      _this = this;
      requestAnimationFrame(function() {
        _this.animate();
      });
    };

    Draggabilly.prototype.setLeftTop = function() {
      this.element.style.left = "" + this.position.x + "px";
      this.element.style.top = "" + this.position.y + "px";
    };

    Draggabilly.prototype.positionDrag = function() {
      this.element.style[this.transformProperty] = "translate3d(" + this.dragPoint.x + "px, " + this.dragPoint.y + "px, 0)";
    };

    Draggabilly.prototype.staticClick = function(event, pointer) {
      this.dispatchEvent('staticClick', event, [pointer]);
    };

    Draggabilly.prototype.enable = function() {
      this.isEnabled = true;
    };

    Draggabilly.prototype.disable = function() {
      this.isEnabled = false;
      if (this.isDragging) {
        this.dragEnd();
      }
    };

    Draggabilly.prototype.destroy = function() {
      this.disable();
      this.element.style[this.transformProperty] = '';
      this.element.style.left = '';
      this.element.style.top = '';
      this.element.style.position = '';
      this.unbindHandles();
    };

    return Draggabilly;

  })(Unidragger);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL1Nhcmdvbi8uYXRvbS9wYWNrYWdlcy9jaHJvbWUtY29sb3ItcGlja2VyL2xpYi9tb2R1bGVzL2hlbHBlci9EcmFnZ2FiaWxseS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsMEJBQVIsQ0FBYixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx1QkFBUixDQURmLENBQUE7O0FBR0E7QUFBQTs7Ozs7S0FIQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFFSixRQUFBLGtFQUFBOztBQUFBLGtDQUFBLENBQUE7O0FBQUEsMEJBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSwwQkFDQSxRQUFBLEdBQVUsTUFBTSxDQUFDLFFBRGpCLENBQUE7O0FBQUEsSUFJQSxxQkFBQSxHQUF3QixNQUFNLENBQUMscUJBQVAsSUFBZ0MsTUFBTSxDQUFDLDJCQUovRCxDQUFBOztBQUFBLDBCQU1BLFFBQUEsR0FBVSxDQU5WLENBQUE7O0FBQUEsMEJBUUEsT0FBQSxHQUFTLElBUlQsQ0FBQTs7QUFBQSwwQkFTQSxpQkFBQSxHQUFtQixJQVRuQixDQUFBOztBQUFBLDBCQVVBLE9BQUEsR0FBUyxJQVZULENBQUE7O0FBQUEsSUFZQSxJQUFBLEdBQU8sU0FBQSxHQUFBLENBWlAsQ0FBQTs7QUFBQSxJQWdCQSxNQUFBLEdBQVMsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO0FBQ1AsVUFBQSxJQUFBO0FBQUEsV0FBQSxTQUFBLEdBQUE7QUFDRSxRQUFBLENBQUUsQ0FBQSxJQUFBLENBQUYsR0FBVSxDQUFFLENBQUEsSUFBQSxDQUFaLENBREY7QUFBQSxPQUFBO2FBRUEsRUFITztJQUFBLENBaEJULENBQUE7O0FB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

//# sourceURL=/Users/Sargon/.atom/packages/chrome-color-picker/lib/modules/helper/Draggabilly.coffee
